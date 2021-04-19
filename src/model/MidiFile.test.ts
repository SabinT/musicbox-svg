import MidiFile, { MidiHeader, MidiFileFormat, MidiTimingScheme, MidiTrack } from './MidiFile';
import fs from 'fs';
import path from 'path';
import { IMidiEvent, MetaMidiEvent, NoteMidiEvent } from './MidiEvents';
import { MIDIMetaMessageType, MidiNote } from './MidiConstants';

describe('Multitrack (type 1) MIDI file', () => {
    it('parses metrically timed file correctly', () => {
        // This file contains 8 notes: C4, D4, E4, ..., C5
        const b: Buffer = fs.readFileSync(path.resolve(__dirname, '../../samples/c4-octave.mid'));

        const binaryData: ArrayBuffer = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);

        const midiFile = new MidiFile();
        midiFile.loadFromBuffer(binaryData);

        // One header, one tempo track, one music track
        expect(midiFile.chunks.length).toBe(3);

        // Test header properties
        const header = midiFile.chunks[0] as MidiHeader;
        expect(header.fileFormat).toBe(MidiFileFormat.multiTrack);
        expect(header.numTracks).toBe(2);
        expect(header.timingScheme).toBe(MidiTimingScheme.metrical);
        expect(header.pulsesPerQuarterNote).toBe(192);

        // Test timing track properties (second chunk/first track)
        const timingTrack = midiFile.chunks[1] as MidiTrack;

        // Find tempo change event
        const setTempoEvent =
            GetMetaEventsByType(timingTrack, MIDIMetaMessageType.SetTempo)[0] as MetaMidiEvent;

        // Tempo is implicitly tested using "absolute time in seconds" of note events.
        expect(setTempoEvent.deltaTime).toBe(0);

        const temptTrackEndOfTrack =
            GetMetaEventsByType(timingTrack, MIDIMetaMessageType.EndOfTrack)[0] as MetaMidiEvent;

        // The length of track is 20 seconds.
        expect(temptTrackEndOfTrack.deltaTime).toBe(7680);
        expect(temptTrackEndOfTrack.absTimeSeconds).toBe(20);

        // Test music track properties (third chunk/second track)
        // This file contains notes 8 notes, C4, D4, E4, ... C5, arranged 0.5 seconds apart,
        // without gaps.
        const musicTrack = midiFile.chunks[2] as MidiTrack;
        const noteEvents = musicTrack.events.filter(x => x instanceof NoteMidiEvent);

        const expectedNotes = [
            MidiNote.C4, MidiNote.D4, MidiNote.E4, MidiNote.F4,
            MidiNote.G4, MidiNote.A4, MidiNote.B4, MidiNote.C5,
        ]

        for (let i = 0; i < expectedNotes.length; i++) {
            const expectedNote = expectedNotes[i];
            const expectedNoteStartTimeSeconds = 0.5 * i;

            const noteOnEvent = noteEvents[i * 2] as NoteMidiEvent;
            const noteOffEvent = noteEvents[i * 2 + 1] as NoteMidiEvent;

            expect(noteOnEvent.note).toBe(expectedNote);
            expect(noteOffEvent.note).toBe(expectedNote);

            expect(noteOnEvent.deltaTime).toBe(0);
            expect(noteOffEvent.deltaTime).toBe(192);

            expect(noteOnEvent.absTimeSeconds).toBe(expectedNoteStartTimeSeconds);
            expect(noteOffEvent.absTimeSeconds).toBe(expectedNoteStartTimeSeconds + 0.5);
        }

        const musicTrackEndOfTrack =
            GetMetaEventsByType(musicTrack, MIDIMetaMessageType.EndOfTrack)[0] as MetaMidiEvent;

        // Though the music is 4 seconds long, the track is 20 seconds long.
        expect(musicTrackEndOfTrack.deltaTime).toBe(6144);
        expect(musicTrackEndOfTrack.absTimeSeconds).toBe(20);
    });

})

function GetMetaEventsByType(timingTrack: MidiTrack, metaMessageType: MIDIMetaMessageType): IMidiEvent[] {
    return timingTrack.events
        .filter(x => {
            const metaEvent = x as MetaMidiEvent;
            return metaEvent ? metaEvent.metaMessageType === metaMessageType : false
        });
}

