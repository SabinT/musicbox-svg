import './MusicBoxSvg.css';

import { IMusicBoxProfile } from "../model/IMusicBoxProfile";
import MidiFile, { MidiTrack, MidiFileFormat } from "../model/MidiFile";
import * as React from 'react';
import { NoteMidiEvent, ChannelMessageType } from "../model/MidiEvents";
import { MidiNote } from "../model/MidiConstants";
import { Callout } from "@blueprintjs/core";
import { IMusicBoxSvgFormatOptions } from "../model/IMusicBoxSvgFormatOptions";

const JIGSAW_WIDTH = 2;
const JIGSAW_OPENFACTOR = 0.3;
const JIGSAW_CLOSEFACTOR = 0.5;
const MAX_START_SKEW = 10;

export interface IMusicBoxSvgProps {
    midiFile: MidiFile;

    /**
     * Profile of the music box for which to generate SVG.
     */
    musicBoxProfile: IMusicBoxProfile;

    /**
     * Options for pagination and formatting of generated layout.
     */
    formatting: IMusicBoxSvgFormatOptions;

    /** The HTML element id for the <svg> element. */
    elementId: string;
}

/** Used for paginating notes into multiple chunks. */
export interface IMidiEventPage {
    /**
     * Page number.
     */
    pageNum: number;

    /**
     * The reference 'origin' in seconds since the start of song for this page.
     * Used to calculate offsets for events.
     */
    startTimeInSeconds: number;

    /**
     * The timestamp for the last event in this page.
     */
    endTimeInSeconds: number;

    /**
     * The note on events to render on this page.
     */
    midiEvents: NoteMidiEvent[];
}

export default class MusicBoxSvg extends React.Component<IMusicBoxSvgProps, {}> {
    // References to generated SVGs
    private svgRefs: (SVGElement | null)[] = [];
    private numPages: number = 0;

    private error: string = '';

    public getNumPages(): number {
        return this.numPages;
    }

    public getSvg(page: number): string | null {
        const svgRef = this.svgRefs[page];
        return svgRef ? svgRef.outerHTML : null;
    }

    public render() {
        // TODO optimize this: recalc only needed on page settings changes
        try {
            const pages = this.paginateEvents();
            this.numPages = pages.length;

            const mbProfile = this.props.musicBoxProfile;
            const supportedNotes = mbProfile.supportedNotes;

            // Distance between two note lines
            const noteGap: number = mbProfile.contentWidthMm / (mbProfile.supportedNotes.length - 1);
            const noteOffsetY: number = (mbProfile.paperWidthMm - mbProfile.contentWidthMm) / 2;

            // An index of the note's position from the top of the music box sheet.
            const noteIndices: Map<MidiNote, number> = new Map<MidiNote, number>();
            [...supportedNotes].sort().forEach((note, i) => {
                noteIndices.set(note, supportedNotes.length - i - 1);
            });

            let totalPaperLength = 0;
            pages.forEach(p => { totalPaperLength += (p.endTimeInSeconds - p.startTimeInSeconds) * mbProfile.millimetersPerSecond });

            return (
                <>
                    <Callout intent={!this.error ? 'success' : 'danger'}>
                        {
                            this.error &&
                            <p>{this.error}</p>
                        }
                        {<p>Total paper length: {totalPaperLength.toFixed(2)} mm, width: {mbProfile.paperWidthMm} mm</p>}
                    </Callout>
                    {pages.map((page) => {
                        return (
                            <div className='mb-musicBoxSvgWrapper'>
                                { this.generateSvgForPage(pages, page, noteIndices, noteGap, noteOffsetY)}
                            </div>
                        )
                    })}
                </>
            );
        } catch (error) {
            return (
                <Callout intent='danger'>
                    <p>Error encountered</p>
                    <p>{JSON.stringify(error)}</p>
                </Callout>
            );
        }
    }

    private generateSvgForPage(
        pages: IMidiEventPage[],
        page: IMidiEventPage,
        noteIndices: Map<MidiNote, number>,
        noteGap: number,
        noteOffsetY: number): JSX.Element {

        // The width of the leading pattern (for distinguishing first page)
        const xLen = (page.endTimeInSeconds - page.startTimeInSeconds) * this.props.musicBoxProfile.millimetersPerSecond;
        const yLen = this.props.musicBoxProfile.paperWidthMm;

        // While paginating, the center of holes at the end of page align with page end,
        // unless JIGSAW_WIDTH is greater
        const svgXLength = xLen + (
            this.props.musicBoxProfile.holeDiameterMm > JIGSAW_WIDTH
                ? this.props.musicBoxProfile.holeDiameterMm
                : JIGSAW_WIDTH
        );

        const formatOptions = this.props.formatting;
        const drawLeadingBorder = (formatOptions && !formatOptions.omitPageBoundaries) || page.pageNum === 0;
        const drawTrailingBorder = (formatOptions && !formatOptions.omitPageBoundaries) || page.pageNum === pages.length - 1; // last page

        const pageSvg =
            <svg key={page.pageNum}
                width={svgXLength + 'mm'}
                height={yLen + 'mm'}
                ref={(el) => { this.svgRefs[page.pageNum] = el; }}
                // Namespace required to tell browsers to render downloaded files instead of displaying xml.
                xmlns={'http://www.w3.org/2000/svg'}>

                <g>
                    {
                        formatOptions && formatOptions.renderBorder &&
                        <>
                            {this.renderSvgLineMm((page.pageNum === 0 && !this.props.formatting.loopMode) ? this.calculateStartSkew() : 0, 0, xLen, 0)}
                            {this.renderSvgLineMm(0, yLen, xLen, yLen)}
                            {
                                drawLeadingBorder && this.renderLeadingBorder(yLen, /* isFirstPage: */page.pageNum === 0)
                            }
                            {
                                drawTrailingBorder &&
                                this.renderTrailingBorder(xLen, yLen, /* isLastPage: */ page.pageNum === pages.length - 1)
                            }
                        </>
                    }
                    {
                        page.midiEvents.map((noteOnEvent, i) =>
                            createCircle(
                                /* key: */`${page.pageNum}_${i}`,
                                noteOnEvent,
                                noteIndices,
                                noteGap,
                                page.startTimeInSeconds,
                                noteOffsetY,
                                this.props.musicBoxProfile))
                    }
                </g>
            </svg>;

        return pageSvg;
    }

    private renderLeadingBorder(height: number, isFirstPage: boolean) {
        if (isFirstPage && !this.props.formatting.loopMode) {
            // Special kind of leading border to identify the start
            const skewMm = this.calculateStartSkew();

            return this.renderSvgLineMm(skewMm, 0, 0, height);
        } else {
            // Render jigsaw joiner so that it can join with previous page
            // (also enabled in loop mode for first page)
            const profile = this.props.musicBoxProfile;

            return this.renderJigsawJoiner(
                /* xStart: */0,
                height
            );
        }
    }

    private calculateStartSkew() {
        return this.props.formatting.startPaddingMm < MAX_START_SKEW ?
            this.props.formatting.startPaddingMm :
            MAX_START_SKEW;
    }

    private renderTrailingBorder(xLen: number, yLen: number, isLastPage: boolean) {
        if (isLastPage && !this.props.formatting.loopMode) {
            // Just a boring straight line
            return this.renderSvgLineMm(xLen, 0, xLen, yLen);
        } else {
            // Jigsaw joiner to connect to next page
            // Also enabled for last page in loop mode
            return this.renderJigsawJoiner(xLen, yLen)
        }
    }

    private renderSvgLineMm(x1: number, y1: number, x2: number, y2: number) {
        return <line x1={x1 + 'mm'} y1={y1 + 'mm'} x2={x2 + 'mm'} y2={y2 + 'mm'} stroke='black' />;
    }

    private renderJigsawJoiner(xStart: number, height: number) {
        // The gap on either side between content area and paper edge
        const profile = this.props.musicBoxProfile;
        const gap = 0.5 * (profile.paperWidthMm - profile.contentWidthMm - profile.holeDiameterMm);

        const a = JIGSAW_OPENFACTOR; // open factor
        const b = JIGSAW_CLOSEFACTOR; // close factor

        const h = 0.5 * gap; // half gap

        const points = [
            // lower half
            { x: xStart, y: 0 },
            { x: xStart, y: h - a * h },
            { x: xStart + JIGSAW_WIDTH, y: h - b * h },
            { x: xStart + JIGSAW_WIDTH, y: h + b * h },
            { x: xStart, y: h + a * h },

            // upper half
            { x: xStart, y: height - h - a * h },
            { x: xStart + JIGSAW_WIDTH, y: height - h - b * h },
            { x: xStart + JIGSAW_WIDTH, y: height - h + b * h },
            { x: xStart, y: height - h + a * h },
            { x: xStart, y: height }
        ]

        var lines: JSX.Element[] = [];

        for (let i = 0; i < points.length - 1; i++) {
            const p = points[i];
            const q = points[i + 1];
            lines.push(this.renderSvgLineMm(p.x, p.y, q.x, q.y));
        }

        return <>{lines}</>
    }

    private paginateEvents(): IMidiEventPage[] {
        const pages: IMidiEventPage[] = [];

        const mbProfile = this.props.musicBoxProfile;
        const supportedNotes = mbProfile.supportedNotes;
        const supportedNoteSet: Set<MidiNote> = new Set(supportedNotes);

        // An index of the note's position from the top of the music box sheet.
        const noteIndices: Map<MidiNote, number> = new Map<MidiNote, number>();
        [...supportedNotes].sort().forEach((note, i) => {
            noteIndices.set(note, supportedNotes.length - i - 1);
        });

        const supportedEvents: NoteMidiEvent[] = [];
        const unsupportedEvents: NoteMidiEvent[] = [];

        this.error = '';

        if (!this.props.midiFile.getTracks()) {
            this.error = 'No tracks found!';
        }

        // Filter notes bases on what'supported by the music box
        this.filterNotes(supportedNoteSet, supportedEvents, unsupportedEvents);
        if (unsupportedEvents.length > 0) {
            this.error += `Unsupported notes found: ${unsupportedEvents.length} total. Inspect MIDI file or music box profile`;
        }

        const formatOptions = this.props.formatting;
        const musicBoxProfile = this.props.musicBoxProfile;

        let pageLengthInSeconds = Infinity;
        if (formatOptions.pageWidthMm > 0) {
            pageLengthInSeconds = formatOptions.pageWidthMm / this.props.musicBoxProfile.millimetersPerSecond
        }

        let currentPage: IMidiEventPage = {
            // Add padding on the first page (set negative start time)
            startTimeInSeconds: -(formatOptions.startPaddingMm + musicBoxProfile.holeDiameterMm * 0.5)
                / musicBoxProfile.millimetersPerSecond,
            endTimeInSeconds: 0,
            midiEvents: [],
            pageNum: 0,
        };

        pages.push(currentPage);

        let currentNoteIndex = 0;
        let previousNoteEvent: NoteMidiEvent | null = null;
        const secondsPerHoleRadius = musicBoxProfile.holeDiameterMm * 0.5 / musicBoxProfile.millimetersPerSecond;

        while (currentNoteIndex < supportedEvents.length) {
            const noteEvent = supportedEvents[currentNoteIndex];
            const maxPageEndTime = currentPage.startTimeInSeconds + pageLengthInSeconds;

            if (noteEvent.absoluteTimeInSeconds + 0.5 * secondsPerHoleRadius > maxPageEndTime) {
                // Doesn't fit in current page
                if (previousNoteEvent) {
                    // Try to center the page boder between notes on both sides, as much as possible
                    const optimalPageEndTime = 0.5 * (previousNoteEvent.absoluteTimeInSeconds + noteEvent.absoluteTimeInSeconds);
                    const pageEndTime = (optimalPageEndTime > maxPageEndTime) ? maxPageEndTime : optimalPageEndTime;

                    // Finish current page
                    currentPage.endTimeInSeconds = pageEndTime;

                    // Start a new page
                    currentPage = {
                        startTimeInSeconds: pageEndTime,
                        endTimeInSeconds: 0,
                        midiEvents: [],
                        pageNum: currentPage.pageNum + 1,
                    };

                    pages.push(currentPage);
                    previousNoteEvent = null;
                }
                else {
                    throw new Error('Page size too small to handle gaps between notes.');
                }
            }

            currentPage.midiEvents.push(noteEvent);
            currentNoteIndex++;
            previousNoteEvent = noteEvent;
        }

        // Finish last page
        if (previousNoteEvent) {
            currentPage.endTimeInSeconds = previousNoteEvent.absoluteTimeInSeconds;
        } else {
            throw new Error('No supported MIDI notes!');
        }

        // If there's room, add upto 0.5 seconds of padding
        const secsRemainingOnLastPage = pageLengthInSeconds -
            (currentPage.endTimeInSeconds - currentPage.startTimeInSeconds);

        if (secsRemainingOnLastPage > 0.5 || pageLengthInSeconds === Infinity) {
            currentPage.endTimeInSeconds += 0.5;
        } else if (secsRemainingOnLastPage > 0) {
            currentPage.endTimeInSeconds += secsRemainingOnLastPage;
        }

        return pages;
    }

    private filterNotes(supportedNoteSet: Set<MidiNote>, supportedEvents: NoteMidiEvent[], unsupportedEvents: NoteMidiEvent[]) {
        const midiHeader = this.props.midiFile.getHeader();
        const midiTracks = this.props.midiFile.getTracks();
        const musicTrack: MidiTrack = midiHeader.fileFormat === MidiFileFormat.multiTrack
            ? midiTracks[1] // First track is tempor track for type 1 MIDI files
            : midiTracks[0];
        const noteOnEvents: NoteMidiEvent[] = musicTrack.events.filter(e => e instanceof NoteMidiEvent &&
            (e as NoteMidiEvent).channelMessageType === ChannelMessageType.NoteOn) as NoteMidiEvent[];
        let lastAbsoluteTime: number = 0;
        noteOnEvents.forEach(e => {
            if (supportedNoteSet.has((e.note))) {
                supportedEvents.push(e);
                if (e.absoluteTimeInSeconds > lastAbsoluteTime) {
                    lastAbsoluteTime = e.absoluteTimeInSeconds;
                }
            }
            else {
                unsupportedEvents.push(e);
            }
        });
    }
}

function createCircle(
    key: string,
    midiEvent: NoteMidiEvent,
    noteIndices: Map<MidiNote, number>,
    noteGap: number,
    startTimeInSeconds: number,
    noteOffsetY: number,
    musicBoxProfile: IMusicBoxProfile): JSX.Element {

    const noteIndex = noteIndices.get(midiEvent.note) || 0;

    return <circle key={key}
        cx={(midiEvent.absoluteTimeInSeconds - startTimeInSeconds) * musicBoxProfile.millimetersPerSecond + "mm"}
        cy={noteOffsetY + noteIndex * noteGap + "mm"}
        r={musicBoxProfile.holeDiameterMm / 2 + "mm"}
        fill={'none'}
        stroke={'black'}
    />;
}