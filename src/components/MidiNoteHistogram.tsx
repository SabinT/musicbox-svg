import * as React from 'react';
import { IMidiStats } from '../model/MidiFile';
import { MidiNote } from '../model/MidiConstants';

export interface IMidiNoteHistogramProps {
    midiStats: IMidiStats;
    width: number;
    height: number;
}

export default function MidiNoteHistogram(props: IMidiNoteHistogramProps) {
    const stats = props.midiStats;
    const noteRange = stats.highNote - stats.lowNote + 1;
    if (noteRange <= 0) {
        return null;
    }

    const noteWidth = props.width / noteRange;

    let bars: JSX.Element[] = [];
    let noteAxis: JSX.Element[] = [];

    // This will help scale the bars
    let maxNoteCount = 0;

    let sparseAxis = noteRange > 30;

    for (let note = stats.lowNote; note <= stats.highNote; note++) {
        const xPosition = (note - stats.lowNote) * noteWidth;

        const noteCount = stats.noteHistogram.get(note);
        if (noteCount) {
            bars.push(
                <rect x={xPosition} width={noteWidth} y={0} height={noteCount} />
            );

            if (noteCount > maxNoteCount) { maxNoteCount = noteCount; }
        }

        if (sparseAxis && shouldSkipNoteInAxis(note, stats)) {
            continue;
        } else {
            const textX = xPosition + noteWidth;
            noteAxis.push(
                <text
                    transform={`rotate(-90,${textX},0)`}
                    x={textX}
                    y={0}
                    fontSize='10'>
                    {
                        MidiNote[note].replace('s', '#')
                    }
                </text>
            );
        }
    }

    // 20 px reserved for axis
    const yScale = (props.height - 20) / maxNoteCount;

    return (
        <svg width={props.width} height={props.height} >
            <g transform={'translate(0 20) scale(1 ' + yScale + ')'}>
                {bars}
            </g>
            <g transform={'translate(0 20)'}>
                {noteAxis}
            </g>
        </svg>
    );
}

function shouldSkipNoteInAxis(note: MidiNote, stats: IMidiStats) {
    if (note > stats.lowNote && note < stats.highNote) {
        // Low and high not always visible in axis
        // If in sparse axis mode, skip every other note, and skip the ones
        // next to the end labels.
        if (note === stats.lowNote + 1 || note === stats.highNote - 1) {
            return true;
        }

        // Skip every second axis laber otherwise
        return (note - stats.lowNote) % 2 == 0;
    }
}