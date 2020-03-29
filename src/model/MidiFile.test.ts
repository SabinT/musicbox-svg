import MidiFile, { MidiHeader, MidiFileFormat } from './MidiFile';
import fs from 'fs';
import path from 'path';

describe('Multitrack (type 1) MIDI file', () => {
    it('parses metrically timed file correctly', () => {
        // This file contains 8 notes: C4, D4, E4, ..., C5
        const b: Buffer = fs.readFileSync(path.resolve(__dirname, '../../samples/c4-octave.mid'));

        const binaryData: ArrayBuffer = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);

        const midiFile = new MidiFile();
        midiFile.loadFromBuffer(binaryData);

        // One header, one tempo track, one music track
        expect(midiFile.chunks.length).toBe(3);

        const header = midiFile.chunks[0] as MidiHeader;
        expect(header.fileFormat).toBe(MidiFileFormat.multiTrack);
        expect(header.numTracks).toBe(2);
    });

})
