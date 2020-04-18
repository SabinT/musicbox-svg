import { IMusicBoxProfile } from "../model/MusicBoxProfiles";
import MidiFile, { MidiTrack, MidiFileFormat } from "../model/MidiFile";
import * as React from 'react';
import { NoteMidiEvent, ChannelMessageType } from "../model/MidiEvents";
import { MidiNote } from "../model/MidiConstants";

/**
 * Any non-functional formatting (e.g., styling, pagination, etc) to apply to the generate svg.
 */
export interface IMusicBoxSvgFormatting {

}

export interface IMusicBoxSvgProps {
    midiFile: MidiFile;

    /**
     * Profile of the music box for which to generate SVG.
     */
    musicBoxProfile: IMusicBoxProfile;

    formatting?: IMusicBoxSvgFormatting;

    /** The HTML element id for the <svg> element. */
    elementId: string;
}

export default class MusicBoxSvg extends React.Component<IMusicBoxSvgProps, {}> {
    private svgRef: SVGElement | null = null;

    public render() {
        const supportedNotes = this.props.musicBoxProfile.supportedNotes;
        const supportedNoteSet: Set<MidiNote> = new Set(supportedNotes);

        // Distance between two note lines
        const noteGap: number =
            this.props.musicBoxProfile.contentWidthMm /
            (this.props.musicBoxProfile.supportedNotes.length - 1);

        const noteOffsetY: number =
            (this.props.musicBoxProfile.paperWidthMm - this.props.musicBoxProfile.contentWidthMm) / 2;

        // An index of the note's position from the top of the music box sheet.
        const noteIndices: Map<MidiNote, number> = new Map<MidiNote, number>();
        [...supportedNotes].sort().forEach((note, i) => {
            noteIndices.set(note, supportedNotes.length - i - 1);
        });

        // Find the first actionable MIDI track.
        const midiHeader = this.props.midiFile.getHeader();
        const midiTracks = this.props.midiFile.getTracks();
        if (!midiTracks) {
            return <div>No tracks found!</div>;
        }

        const musicTrack: MidiTrack = midiHeader.fileFormat === MidiFileFormat.multiTrack
            ? midiTracks[1] // First track is tempor track for type 1 MIDI files
            : midiTracks[0];

        const noteOnEvents: NoteMidiEvent[] = musicTrack.events.filter(
            e => e instanceof NoteMidiEvent &&
                (e as NoteMidiEvent).channelMessageType === ChannelMessageType.NoteOn) as NoteMidiEvent[];

        const supportedEvents: NoteMidiEvent[] = [];
        const unsupportedEvents: NoteMidiEvent[] = [];
        let lastAbsoluteTime: number = 0;
        noteOnEvents.forEach(e => {
            if (supportedNoteSet.has((e.note))) {
                supportedEvents.push(e);
                if (e.absoluteTimeInSeconds > lastAbsoluteTime) {
                    lastAbsoluteTime = e.absoluteTimeInSeconds;
                }
            } else {
                unsupportedEvents.push(e);
            }
        });

        const endPaddingMm = 10;
        const startPaddingMm = 10;

        const totalWidth = startPaddingMm + endPaddingMm + lastAbsoluteTime * this.props.musicBoxProfile.millimetersPerSecond + endPaddingMm + "mm";
        const totalHeight = this.props.musicBoxProfile.paperWidthMm + "mm";
        return (
            <svg width={totalWidth}
                height={totalHeight}
                ref={(el) => { this.svgRef = el; }}
                // Namespace required to tell browsers to render downloaded files instead of displaying xml.
                xmlns={'http://www.w3.org/2000/svg'}>

                <g>
                    <rect width={totalWidth}
                        height={totalHeight}
                        fill={'none'}
                        stroke={'black'} />
                    {noteOnEvents.map((noteOnEvent, i) => createCircle(
                        i,
                        noteOnEvent,
                        noteIndices,
                        noteGap,
                        startPaddingMm,
                        noteOffsetY,
                        this.props.musicBoxProfile))}
                </g>
            </svg>
        );
    }

    public getSvgData(): string | null {
        if (this.svgRef) {
            return this.svgRef.outerHTML;
        }

        return null;
    }
}

function createCircle(
    key: number,
    noteOnEvent: NoteMidiEvent,
    noteIndices: Map<MidiNote, number>,
    noteHeight: number,
    noteOffsetX: number,
    noteOffsetY: number,
    musicBoxProfile: IMusicBoxProfile): JSX.Element {

    const noteIndex = noteIndices.get(noteOnEvent.note) || 0;

    return <circle key={key}
        cx={noteOffsetX + noteOnEvent.absoluteTimeInSeconds * musicBoxProfile.millimetersPerSecond + "mm"}
        cy={noteOffsetY + noteIndex * noteHeight + "mm"}
        r={musicBoxProfile.holeDiameterMm / 2 + "mm"}
        fill={'none'}
        stroke={'black'}
    />;
}