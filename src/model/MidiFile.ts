import { IMidiEvent, ChannelMessageType, NoteMidiEvent, ControllerMidiEvent as ControllerChangeMidiEvent, ProgramChangeMidiEvent, ChannelPressureMidiEvent, PitchBendMidiEvent, MetaMidiEvent } from "./MidiEvents";
import { stat } from "fs";
import { MIDIMetaMessageType } from "./MidiConstants";

/**
 * A valid MIDI file will contain a single Header chunk followed by one or more Track chunks.
 * Each chunk has an 8 byte header that identifies which type it is, and gives the size of its associated data :
 * bytes 0 - 3 : identifier (either 'MThd' or 'MTrk')
 * bytes 4 - 7 : chunklen (the number of bytes comprising the following data)
 * Chunks with unrecognized identifier should be skipped (anything other than 'MThd' or 'MTrk').
 *
 * All multi-byte data is big-endian.
 */
export interface IMidiChunk {
    /**
     * Parses out the chunk from a raw MIDI buffer given the start offset and length in bytes.
     * @param dataView The raw MIDI data buffer
     * @param dataStartOffset The byte position within `dataView`, where the chunk data (after the
     *      8-byte header) starts.
     */
    parseFromRawData(dataView: DataView, dataStartOffset: number, chunkLength: number): void;
}

export enum MidiFileFormat {
    /**
     * The MIDI file contains just a single MTrk chunk, that can potentially contain multi-channel
     * MIDI data.
     */
    singleTrack = 0,

    /**
     * The file contains two or more MTrk chunks (as specified by the following parameter, ntracks)
     * that are to be played simultaneously, i.e. analogous to a mulitrack tape recorder. The first
     * track is a tempo track that should only contain tempo related Meta events (i.e. no actual
     * MIDI data). This is the most commonly used format, as the various instrumental parts within a
     * composition can be stored in separate tracks, allowing for easier editing. It is possible to
     * store multi-channel data in a track, though it is more usual to keep data relevant to a
     * single MIDI channel in each track.
     */
    multiTrack = 1,

    /**
     * Not very popular, don't care.
     */
    Type2 = 2,
}

export enum MidiTimingScheme {
    /** Timing of events is determined by beats per minute/pulses per quarter note, etc. */
    metrical = 0,

    /** Absolute time is used in Midi events. */
    timecode = 1,
}

/**
 * The Header chunk (identifier = MThd) has a fixed length and contains a few global properties
 * pertaining to the file as a whole. It should be the first chunk in the file, and this should be
 * the only occurrence. Although the Header chunk currently always contains 6 bytes of data
 * (i.e., chunklen = 6), this should not be assumed (i.e., the chunklen value should always be read
 * and acted upon, to allow for possible future extension to the standard).
 */
export class MidiHeader implements IMidiChunk {
    /** Format of the MIDI file (type 0, 1, 2). Corresponds to first 16 bits of the header data. */
    public fileFormat: MidiFileFormat = MidiFileFormat.multiTrack;

    /**
     * The number of MTrk chunks following this MThd chunk.
     * For a format 0 MIDI file, ntracks can only be '1'.
     * Second 16-bits of the header data.
     */
    public numTracks: number = 0;

    /**
     * Specifies the timing interval to be used, and whether timecode (Hrs.Mins.Secs.Frames) or
     * metrical (Bar.Beat) timing is to be used. With metrical timing, the timing interval is tempo
     * related, whereas with timecode the timing interval is in absolute time, and hence not related
     * to tempo. This is the third 16 bytes of the header data.
     */
    public rawTimingData: number = 0;

    /** Parsed from bit 15 of rawTimingDivision, 0 = Metrical, 1 = timecode. @see rawTimingDivision */
    public timingScheme: MidiTimingScheme = MidiTimingScheme.metrical;

    /**
     * If @see timingScheme is @see MidiTimingScheme.Metrical, bits 0-14 of @see rawTimingDivision
     * are a 15-bit number indicating the number of sub-divisions of a quarter note (a.k.a. pulses
     * per quarter note, ppqn). A common value is 96, which would be represented in hex as `00 60`.
     * You will notice that 96 is a nice number for dividing by 2 or 3 (with further repeated
     * halving), so using this value for tickdiv allows triplets and dotted notes right down to
     * hemi-demi-semiquavers to be represented.
     */
    public pulsesPerQuarterNote?: number;

    /**
     * If @see timingScheme is @see MidiTimingScheme.TimeCode, bits 8-15 of @see rawTimingDivision
     * (i.e., the first byte) specify the number of frames per second (fps), and will be one of the
     * four SMPTE standards: 24, 25, 29 or 30, though expressed as a negative value using 2's
     * complement notation. (e.g, 24 is represented as `E8`)
     */
    public framesPerSecond?: number;

    /**
     * If @see timingScheme is @see MidiTimingScheme.TimeCode, bits 0 - 7 of @see rawTimingDivision
     * (second byte) specify the sub-frame resolution (i.e.,  number of sub-divisions of a frame).
     * Typical values are 4 (corresponding to MIDI Time Code), 8, 10, 80(corresponding to SMPTE bit
     * resolution), or 100. A timing resolution of 1 ms can be achieved by specifying 25 fps and 40
     * sub-frames, which would be encoded in hex as `E7 28`.
     */
    public subFrameResolution?: number;

    constructor(dataView: DataView, startOffset: number, chunkLength: number) {
        this.parseFromRawData(dataView, startOffset, chunkLength);
    }

    public parseFromRawData(dataView: DataView, startOffset: number, chunkLength: number) {
        // First 16 bits
        const format: MidiFileFormat =
            dataView.getUint16(startOffset, /* littleEndian: */ false) as MidiFileFormat;

        // Second 16 bits
        const numTracks: number =
            dataView.getUint16(startOffset + 2,  /* littleEndian: */ false);

        // Third 16 bits
        const rawTimingData = dataView.getUint16(startOffset + 4, /* littleEndian: */ false);

        // Bit 15 = tickdiv
        const timingScheme = rawTimingData & 0x8000 as MidiTimingScheme;

        this.fileFormat = format;
        this.rawTimingData = rawTimingData;
        this.numTracks = numTracks;
        this.timingScheme = timingScheme;

        if (timingScheme === MidiTimingScheme.metrical) {
            // Bits 0-14
            this.pulsesPerQuarterNote = 0x7FFF & rawTimingData;
        } else {
            // Timing scheme is timecode.
            // Bits 8 - 15, note: number is stored as 2's complement
            this.framesPerSecond = ~(0xFF00 & rawTimingData) + 1;

            // Bits 0 - 7
            this.subFrameResolution = 0x00FF & rawTimingData;
        }
    }
}

/**
 * Track chunks (identifier = MTrk) contain a sequence of time-ordered events (MIDI and/or sequencer
 * specific data), each of which has a delta time value associated with it - i.e. the amount of time
 * (specified in tickdiv units) since the previous event.
 * i.e., a track is sequence of 'delta-time / event' pairs
 * 
 * Single track files (type 0) only have one track.
 * Multi-track files (type 1) contain multiple tracks, where the first track is a global tempo track
 * and subsequent tracks contain the actual note data but not timing events. All trasks are played
 * together and they all follow the tempo track.
 * Type 2 midi files allow timing events in any track.
 */
export class MidiTrack implements IMidiChunk {
    public events: IMidiEvent[] = [];

    // Used to calculate absolute timing data while parsing tracks
    private header: MidiHeader;

    constructor(header: MidiHeader, dataView: DataView, dataStartOffset: number, chunkLength: number) {
        this.header = header;
        this.parseFromRawData(dataView, dataStartOffset, chunkLength);
    }

    public parseFromRawData(dataView: DataView, dataStartOffset: number, chunkLength: number): void {
        let currentOffset = dataStartOffset;
        let done: boolean = false;

        let cumulativeSeconds = 0;
        let secondsPerTick = 0;
        const usesMetricalTiming = this.header.timingScheme === MidiTimingScheme.metrical;
        if (usesMetricalTiming && this.header.pulsesPerQuarterNote) {
            // Default tempo of 120 bpm if no tempo change event is present.
            secondsPerTick = 60 / (120 * this.header.pulsesPerQuarterNote);
        }

        let previousStatusByte: number = 0;
        while (!done && currentOffset < dataStartOffset + chunkLength) {
            // Read delta time (big-endian sequence of 7-bit numbers)
            // Top bit being set indicates another byte will follow.
            let deltaTimeCurrentByte = dataView.getUint8(currentOffset++);

            let deltaTime = deltaTimeCurrentByte & 0b01111111;
            while (deltaTimeCurrentByte & 0b10000000) {
                deltaTimeCurrentByte = dataView.getUint8(currentOffset++);
                deltaTime = (deltaTime << 7) + (deltaTimeCurrentByte & 0b01111111);
            }

            if (usesMetricalTiming) {
                cumulativeSeconds += secondsPerTick * deltaTime;
            }

            // Read status byte to find event type
            let statusByte = dataView.getUint8(currentOffset++);

            if (statusByte < 0x80) {
                statusByte = previousStatusByte;
            } else {
                previousStatusByte = statusByte;
            }

            const messageType = (statusByte & 0b11110000) >> 4;

            if (messageType >= ChannelMessageType.NoteOff
                && messageType <= ChannelMessageType.PitchBend) {

                // This is a channel message
                let midiEvent;
                switch (messageType) {
                    case ChannelMessageType.NoteOff:
                    case ChannelMessageType.NoteOn:
                    case ChannelMessageType.PolyphonicPressure:
                        midiEvent = new NoteMidiEvent(deltaTime);
                        midiEvent.note = dataView.getUint8(currentOffset++);
                        midiEvent.velocity = dataView.getUint8(currentOffset++);
                        break;

                    case ChannelMessageType.Controller:
                        midiEvent = new ControllerChangeMidiEvent(deltaTime);
                        midiEvent.controller = dataView.getUint8(currentOffset++);
                        midiEvent.value = dataView.getUint8(currentOffset++);
                        break;

                    case ChannelMessageType.ProgramChange:
                        midiEvent = new ProgramChangeMidiEvent(deltaTime);
                        midiEvent.program = dataView.getUint8(currentOffset++);
                        break;

                    case ChannelMessageType.ChannelPressure:
                        midiEvent = new ChannelPressureMidiEvent(deltaTime);
                        midiEvent.velocity = dataView.getUint8(currentOffset++);
                        break;

                    case ChannelMessageType.PitchBend:
                        midiEvent = new PitchBendMidiEvent(deltaTime);
                        midiEvent.value = dataView.getUint8(currentOffset++);
                        break;

                    default:
                        throw new Error("Unrecognized status byte: " + statusByte);
                }

                if (usesMetricalTiming) {
                    midiEvent.absoluteTimeInSeconds = cumulativeSeconds;
                }

                midiEvent.channelMessageType = messageType;
                this.events.push(midiEvent);
            } else if (statusByte >= 0b11110000 && statusByte <= 0b11110111) {
                // SysEx messages
                throw new Error('Not yet implemented');
            } else if (statusByte >= 0b11111000 && statusByte < 0b11111111) {
                // SysEx realtime messages
                // Note: 0b11111111 is used as the status byte for "System Reset" in real-time contexts.
                throw new Error('Not yet implemented');
            } else if (statusByte === 0b11111111) {
                // Meta messages: with the general format `FF type length data`
                let midiEvent = new MetaMidiEvent(deltaTime);
                midiEvent.metaMessageType = dataView.getUint8(currentOffset++);

                const length = dataView.getUint8(currentOffset++);
                if (midiEvent.metaMessageType === MIDIMetaMessageType.EndOfTrack && length === 0) {
                    // This is the end of track marker.
                    done = true;
                }

                if (midiEvent.metaMessageType === MIDIMetaMessageType.SetTempo
                    && length === 3
                    && usesMetricalTiming
                    && this.header.pulsesPerQuarterNote) {
                    // Tempo change
                    const microsecondsPerQuarterNote =
                        (dataView.getUint16(currentOffset) << 8) +
                        dataView.getUint8(currentOffset + 2);
                    secondsPerTick = microsecondsPerQuarterNote / (1000 * 1000 * this.header.pulsesPerQuarterNote);
                }

                if (usesMetricalTiming) {
                    midiEvent.absoluteTimeInSeconds = cumulativeSeconds;
                }

                this.events.push(midiEvent);

                currentOffset += length;
            }
        }
    }
}


/**
 * Basic MIDI file parser based on http://www.somascape.org/midi/tech/mfile.html
 */
export default class MidiFile {
    public chunks: IMidiChunk[] = [];

    public loadFromBuffer(buffer: ArrayBuffer) {
        this.chunks = [];

        let currentPos: number = 0;
        let dataView = new DataView(buffer);

        while (currentPos < buffer.byteLength) {
            // First 8 bytes of the chunk are chunk header
            // Read chunk type (4 bytes);
            const chunkType = getStringFromBuffer(buffer, currentPos, currentPos + 4);
            currentPos += 4;

            // Read length of chunk (4 bytes, big-endian)
            const chunkLength = dataView.getUint32(currentPos, /* littleEndian: */ false);
            currentPos += 4;

            const chunkDataStartOffset = currentPos;
            switch (chunkType) {
                case 'MThd':
                    this.chunks.push(new MidiHeader(dataView, chunkDataStartOffset, chunkLength));
                    break;

                case 'MTrk':
                    // This is a track
                    this.chunks.push(new MidiTrack(this.chunks[0] as MidiHeader, dataView, chunkDataStartOffset, chunkLength));
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