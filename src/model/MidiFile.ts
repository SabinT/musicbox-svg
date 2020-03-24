/**
 * A valid MIDI file will contain a single Header chunk followed by one or more Track chunks.
 * Each chunk has an 8 byte header that identifies which type it is, and gives the size of its associated data :
 * bytes 0 - 3 : identifier (either 'MThd' or 'MTrk')
 * bytes 4 - 7 : chunklen (the number of bytes comprising the following data)
 * Chunks with unrecognized identifier should be skipped (anything other than 'MThd' or 'MTrk').
 *
 * All data is big-endian.
 */
export interface IMidiChunk {
    id: string;
    length: number;
    rawData: ArrayBuffer;
}

export enum MidiFileFormat {
    /**
     * The MIDI file contains just a single MTrk chunk, that can potentially contain multi-channel
     * MIDI data.
     */
    SingleTrack = 0,

    /**
     * The file contains two or more MTrk chunks (as specified by the following parameter, ntracks)
     * that are to be played simultaneously, i.e. analogous to a mulitrack tape recorder. The first
     * track is a tempo track that should only contain tempo related Meta events (i.e. no actual
     * MIDI data). This is the most commonly used format, as the various instrumental parts within a
     * composition can be stored in separate tracks, allowing for easier editing. It is possible to
     * store multi-channel data in a track, though it is more usual to keep data relevant to a
     * single MIDI channel in each track.
     */
    MultiTrack = 1,

    /**
     * Not very popular, don't care.
     */
    Type2 = 2,
}

export enum MidiTimingScheme {
    Metrical = 0,
    TimeCode = 1,
}

/**
 * The Header chunk (identifier = MThd) has a fixed length and contains a few global properties
 * pertaining to the file as a whole. It should be the first chunk in the file, and this should be
 * the only occurrence. Although the Header chunk currently always contains 6 bytes of data
 * (i.e., chunklen = 6), this should not be assumed (i.e., the chunklen value should always be read
 * and acted upon, to allow for possible future extension to the standard).
 */
export interface IMidiHeaderChunk extends IMidiChunk {
    /** Format of the MIDI file (type 0, 1, 2). Corresponds to first 16 bits of the header data. */
    format: MidiFileFormat;

    /**
     * The number of MTrk chunks following this MThd chunk.
     * For a format 0 MIDI file, ntracks can only be '1'.
     * Second 16-bits of the header data.
     */
    numTracks: number;

    /**
     * Specifies the timing interval to be used, and whether timecode (Hrs.Mins.Secs.Frames) or
     * metrical (Bar.Beat) timing is to be used. With metrical timing, the timing interval is tempo
     * related, whereas with timecode the timing interval is in absolute time, and hence not related
     * to tempo. This is the third 16 bytes of the header data.
     */
    rawtickdiv: number;

    /** Parsed from bit 15 of rawtickdiv, 0 = Metrical, 1 = timecode. @see rawtickdiv */
    timingScheme: MidiTimingScheme;

    /**
     * If @see timingScheme is @see MidiTimingScheme.Metrical, bits 0 - 14 of @see rawtickdiv are a
     * 15-bit number indicating the number of sub-divisions of a quarter note (a.k.a. pulses per
     * quarter note, ppqn). A common value is 96, which would be represented in hex as `00 60`.
     * You will notice that 96 is a nice number for dividing by 2 or 3 (with further repeated
     * halving), so using this value for tickdiv allows triplets and dotted notes right down to
     * hemi-demi-semiquavers to be represented.
     */
    pulsesPerQuarterNote?: number;

    /**
     * If @see timingScheme is @see MidiTimingScheme.TimeCode, bits 8 - 15 of @see rawtickdiv (i.e.,
     * the first byte) specify the number of frames per second (fps), and will be one of the four
     * SMPTE standards: 24, 25, 29 or 30, though expressed as a negative value using 2's complement
     * notation. (e.g, 24 is represented as `E8`)
     */
    framesPerSecond?: number;

    /**
     * If @see timingScheme is @see MidiTimingScheme.TimeCode, bits 0 - 7 of @see rawtickdiv (the
     * second byte) specify the sub-frame resolution (i.e., the number of sub-divisions of a frame).
     * Typical values are 4 (corresponding to MIDI Time Code), 8, 10, 80(corresponding to SMPTE bit
     * resolution), or 100. A timing resolution of 1 ms can be achieved by specifying 25 fps and 40
     * sub-frames, which would be encoded in hex as `E7 28`.
     */
    subFrameResolution?: number;
}

/**
 * Basic MIDI file parser based on http://www.somascape.org/midi/tech/mfile.html
 */
export default class MidiFile {
    private chunks: IMidiChunk[];

    constructor(buffer: ArrayBuffer) {
        this.chunks = [];

        let currentPos: number = 0;
        let dataView = new DataView(buffer);

        while (currentPos < buffer.byteLength) {
            // Read chunk type (4 bytes);
            const chunkType = getStringFromBuffer(buffer, currentPos, currentPos + 4);
            currentPos += 4;

            // Read length of chunk (4 bytes, big-endian)
            const chunkLength = dataView.getUint32(currentPos, /* littleEndian: */ false);
            currentPos += 4;

            const rawData = buffer.slice(currentPos, currentPos + chunkLength);

            const headerStart = currentPos;
            switch (chunkType) {
                case 'MThd':
                    // First 16 bits
                    const format: MidiFileFormat =
                        dataView.getUint16(headerStart, /* littleEndian: */ false) as MidiFileFormat;

                    // Second 16 bits
                    const numTracks: number =
                        dataView.getUint16(headerStart + 2,  /* littleEndian: */ false);

                    // Third 16 bits
                    const rawTickDiv = dataView.getUint16(headerStart + 4, /* littleEndian: */ false);

                    // Bit 15 = tickdiv
                    const timingScheme = rawTickDiv & 0x8000 as MidiTimingScheme;

                    const headerChunk: IMidiHeaderChunk = {
                        /* Generic chunk properties */
                        id: chunkType,
                        length: chunkLength,
                        rawData: rawData,
                        /* Header specific properties */
                        format: format,
                        rawtickdiv: rawTickDiv,
                        numTracks: numTracks,
                        timingScheme: timingScheme
                    }

                    if (timingScheme == MidiTimingScheme.Metrical) {
                        // Bits 0-14
                        headerChunk.pulsesPerQuarterNote = 0x7FFF & rawTickDiv;
                    } else {
                        // Timing scheme is timecode.
                        // Bits 8 - 15, note: number is stored as 2's complement
                        headerChunk.framesPerSecond = ~(0xFF00 & rawTickDiv) + 1;

                        // Bits 0 - 7
                        headerChunk.subFrameResolution = 0x00FF & rawTickDiv;
                    }

                    this.chunks.push(headerChunk);

                    break;
                case 'MTrk':
                    // This is a track
                    this.chunks.push({ id: chunkType, length: chunkLength, rawData: rawData });

                    break;
                default:
                    // Unrecognized chunk, skip
                    break;
            }
            currentPos += chunkLength;
        }
    }

    public PrettyPrint() {
        return JSON.stringify(this.chunks, prettyPrintReplacer, 4);
    }
}

function prettyPrintReplacer(key: string, value: any) {
    switch (key) {
        case 'rawTickDiv':
            return undefined;

        case 'raw':
            return undefined;

        default:
            return value;
    }
}

function getStringFromBuffer(buffer: ArrayBuffer, start: number, end: number): string {
    const slice = buffer.slice(start, end);
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(slice)));
}