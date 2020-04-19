import { IMusicBoxProfile } from "../model/IMusicBoxProfile";
import MidiFile, { MidiTrack, MidiFileFormat } from "../model/MidiFile";
import * as React from 'react';
import { NoteMidiEvent, ChannelMessageType } from "../model/MidiEvents";
import { MidiNote } from "../model/MidiConstants";
import { Callout } from "@blueprintjs/core";
import { IMusicBoxSvgFormatOptions } from "../model/IMusicBoxSvgFormatOptions";

export interface IMusicBoxSvgProps {
    midiFile: MidiFile;

    /**
     * Profile of the music box for which to generate SVG.
     */
    musicBoxProfile: IMusicBoxProfile;

    formatting?: IMusicBoxSvgFormatOptions;

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
                    {<p>Total paper length: {totalPaperLength} mm, width: {mbProfile.paperWidthMm} mm</p>}
                </Callout>
                {pages.map((page) => { return this.generateSvgForPage(pages, page, noteIndices, noteGap, noteOffsetY) })}
            </>
        );
    }

    private generateSvgForPage(pages: IMidiEventPage[], page: IMidiEventPage, noteIndices: Map<MidiNote, number>, noteGap: number, noteOffsetY: number) {
        const xLen = (page.endTimeInSeconds - page.startTimeInSeconds) * this.props.musicBoxProfile.millimetersPerSecond;
        const yLen = this.props.musicBoxProfile.paperWidthMm;

        // While paginating, the center of holes at the end of page align with page end
        const svgXLength = xLen + this.props.musicBoxProfile.holeDiameterMm;

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
                            {/* Top border */}
                            <line x1='0mm' y1='0mm' x2={xLen + 'mm'} y2='0mm' stroke='black' />
                            {/* Bottom border */}
                            <line x1='0mm' y1={yLen + 'mm'} x2={xLen + 'mm'} y2={yLen + 'mm'} stroke='black' />
                            {
                                drawLeadingBorder &&
                                <line x1='0mm' y1='0mm' x2='0mm' y2={yLen + 'mm'} stroke='black' />
                            }
                            {
                                drawTrailingBorder &&
                                <line x1={xLen + 'mm'} y1='0mm' x2={xLen + 'mm'} y2={yLen + 'mm'} stroke='black' />
                            }
                        </>
                    }
                    {page.midiEvents.map((noteOnEvent, i) =>
                        createCircle(
                            /* key: */`${page.pageNum}_${i}`,
                            noteOnEvent,
                            noteIndices,
                            noteGap,
                            page.startTimeInSeconds,
                            noteOffsetY,
                            this.props.musicBoxProfile))}
                </g>
            </svg>;

        return pageSvg;
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

        if (!this.props.midiFile.getTracks()) {
            this.error = 'No tracks found!';
        }

        // Filter notes bases on what'supported by the music box
        this.filterNotes(supportedNoteSet, supportedEvents, unsupportedEvents);
        if (unsupportedEvents.length > 0) {
            this.error += `Unsupported notes found: ${unsupportedEvents.length} total. Inspect MIDI file or music box profile`;
        }

        let pageLengthInSeconds = Infinity;
        if (this.props.formatting && this.props.formatting.pageWidthMm > 0) {
            pageLengthInSeconds = this.props.formatting.pageWidthMm / this.props.musicBoxProfile.millimetersPerSecond;
        }

        let currentPage: IMidiEventPage = {
            startTimeInSeconds: -0.5, //0.5 seconds of padding on first page
            endTimeInSeconds: 0,
            midiEvents: [],
            pageNum: 0,
        };

        pages.push(currentPage);

        let currentNoteIndex = 0;
        let previousNoteEvent: NoteMidiEvent | null = null;
        while (currentNoteIndex < supportedEvents.length) {
            const noteEvent = supportedEvents[currentNoteIndex];
            if (noteEvent.absoluteTimeInSeconds > currentPage.startTimeInSeconds + pageLengthInSeconds) {
                // Doesn't fit in current page
                if (previousNoteEvent) {
                    // Finish current page
                    currentPage.endTimeInSeconds = previousNoteEvent.absoluteTimeInSeconds;

                    // Start a new page
                    currentPage = {
                        startTimeInSeconds: previousNoteEvent.absoluteTimeInSeconds,
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