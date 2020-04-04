import { IMusicBoxProfile } from "../model/MusicBox";
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
}

export function MusicBoxSvg(props: IMusicBoxSvgProps) {
    const supportedNotes = props.musicBoxProfile.supportedNotes;
    const supportedNoteSet: Set<MidiNote> = new Set(supportedNotes);
    const noteHeight: number =
        props.musicBoxProfile.contentWidthMm /
        props.musicBoxProfile.supportedNotes.length;
    const noteOffsetY: number =
        (props.musicBoxProfile.paperWidthMm - props.musicBoxProfile.contentWidthMm) / 2;

    // An index of the note's position from the bottom of the music box sheet.
    const noteIndices: Map<MidiNote, number> = new Map<MidiNote, number>();
    [...supportedNotes].sort().forEach((note, i) => {
        noteIndices.set(note, supportedNotes.length - i);
    });

    // Find the first actionable MIDI track.
    const midiHeader = props.midiFile.getHeader();
    const midiTracks = props.midiFile.getTracks();
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
    const noteOffsetX = 40;

    const totalWidth = lastAbsoluteTime * props.musicBoxProfile.millimetersPerSecond + endPaddingMm + "mm";
    const totalHeight = props.musicBoxProfile.paperWidthMm + "mm";
    return (
        <svg width={totalWidth} height={totalHeight}>
            <g>
                <rect width={totalWidth}
                    height={totalHeight}
                    fill={'none'}
                    stroke={'black'} />
                {noteOnEvents.map((noteOnEvent, i) => createCircle(
                    i,
                    noteOnEvent,
                    noteIndices,
                    noteHeight,
                    noteOffsetX,
                    noteOffsetY,
                    props.musicBoxProfile))}
            </g>
        </svg>
    );
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
        cx={noteOffsetX + noteOnEvent.absoluteTimeInSeconds * musicBoxProfile.millimetersPerSecond}
        cy={noteOffsetY + noteIndex * noteHeight + "mm"}
        r={musicBoxProfile.holeDiameterMm / 2 + "mm"}
        fill={'none'}
        stroke={'black'}
    />;
}