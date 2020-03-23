/**
 * Basic MIDI file parser based on http://www.somascape.org/midi/tech/mfile.html
 */
export default class MidiFile {
    constructor(buffer: ArrayBuffer) {
        // A valid MIDI file will contain a single Header chunk followed by one or more Track chunks.
        // Each chunk has an 8 byte header that identifies which type it is, and gives the size of its associated data :
        // bytes 0 - 3 : identifier (either 'MThd' or 'MTrk')
        // bytes 4 - 7 : chunklen (the number of bytes comprising the following data)
        // Chunks with unrecognized identifier should be skipped (anything other than 'MThd' or 'MTrk').

        let dataView = new DataView(buffer);

        let currentPos: number = 0;
        while (currentPos < buffer.byteLength) {
            // Read chunk type (4 bytes);
            const chunkType = getStringFromBuffer(buffer, currentPos, currentPos + 4);
            currentPos += 4;

            // Read length of chunk (4 bytes, big-endian)
            const chunkLength = dataView.getUint32(currentPos, /* littleEndian: */ false);
            currentPos += 4;

            switch(chunkType) {
                case 'MThd':
                    // This is a header
                    break;
                case 'MTrk':
                    // This is a track
                    break;
                default:
                    // Unrecognized chunk, skip
                    break;
            }
            currentPos += chunkLength;
        }
    }
}

function getStringFromBuffer(buffer: ArrayBuffer, start: number, end: number): string {
    const slice = buffer.slice(start, end);
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(slice)));
}