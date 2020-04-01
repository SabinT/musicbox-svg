import { MidiNote } from "./MidiConstants";

export enum MidiEventType {
    /**
     * First byte of Midi event being `0x8n - 0xEn` indicates this type (4-bit n = channel number)
     * This type includes "music" events that includes note on/off and controller change.
     */
    Channel = 1,
    /**
     * Indicated by first byte of Midi event being `0xF0` (single byte status) or `0xF7` (multi byte
     * SysEx message - used to send escape sequences).
     */
    SysEx = 2,
    /**
     * Indicated by first byte of Midi event being `0xFF`.
     * These contain additional information which would not be in the MIDI data stream itself.
     * (e.g., TimeSig, KeySig, Tempo, TrackName, Text, Marker, Special, End of Track, etc.)
     */
    Meta = 3
}

/**
 * Represents a timed event in a track, comprising of a variable-length `deltaTime`, and variable-
 * length event data.
 *
 * The first byte of Midi event data after `deltaTime` (also referred to as the event's status byte,
 * and identifiable by bit 7 being set) identifies the event type.
 *
 * If status byte is less than 128 (hex 80), this implies that running status is in
 * effect, and that this byte is actually the first data byte (the status carrying over from the
 * previous MIDI event). This can only be the case if the immediately previous event was also a
 * MIDI event, i.e. SysEx and Meta events interrupt (clear) running status.
 */
export interface IMidiEvent {
    /**
     * A variable length quantity, (1 to 4 bytes) denoting the time since the previous event.
     * Unit depends on timing scheme used by the MIDI file.
     *
     * Only the bottom 7 bits of each of these bytes contributes towards the delta-time, the top bit
     * being used to indicate (when it is set) that another byte follows, i.e. bit 7 of each byte is
     * used to indicate continuation or end of the delta-time data. Consequently the last byte of
     * any delta-time value will have its top bit clear.
     * E.g., the hex number `4000` is represented by three bytes as `81 80 00`
     */
    deltaTime: number;

    getMidiEventType(): MidiEventType;

    /**
     * Not a part of the MIDI format, but included here for convenience
     */
    absoluteTimeInSeconds: number;
}

export abstract class BaseMidiEvent implements IMidiEvent {
    public deltaTime: number;
    public absoluteTimeInSeconds: number = 0;

    constructor(deltaTime: number) {
        this.deltaTime = deltaTime;
    }

    abstract getMidiEventType(): MidiEventType;
}

/**
 * Different types of Channel messages. See below for reference:
 * https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
 * 
 * All channel messages have a status byte of the format xxxxnnnn, where xxxx identifies message
 * type, and nnnn identifies the channel.
 * 
 * The value of the enum corresponds to the top nibble of message type (xxxx).
 */
export enum ChannelMessageType {
    /** Do not use, used to indicate unassigned.*/
    None = 0,

    /**
     * This message is sent when a note is released (ended).
     * Data bytes: `0kkkkkkk, 0vvvvvvv`, where `kkkkkkk` = key/note number, `vvvvvvv` = velocity.
     */
    NoteOff = 0b1000,

    /**
     * This message is sent when a note is depressed (start).
     * Data bytes: `0kkkkkkk, 0vvvvvvv`, where `kkkkkkk` = key/note number, `vvvvvvv` = velocity.
     */
    NoteOn = 0b1001,

    /**
     * This message is most often sent by pressing down on the key after it "bottoms out".
     * Data: `0kkkkkkk 0vvvvvvv`
     * `kkkkkkk` is the key (note) number. `vvvvvvv` is the pressure value.
     */
    PolyphonicPressure = 0b1010,

    /**
     * This message is sent when a controller value changes.
     * Controllers include devices such as pedals and levers.
     * Controller numbers 120-127 are reserved as "Channel Mode Messages".
     * Data: `0ccccccc 0vvvvvvv`
     * `ccccccc` is the controller number (0-119). `vvvvvvv` is the controller value (0-127).
     */
    Controller = 0b1011,

    /**
     * This message sent when the patch number changes.
     * Data byte: `0ppppppp` 7-bit program number.
     */
    ProgramChange = 0b1100,

    /**
     * This message is most often sent by pressing down on the key after it "bottoms out".
     * This message is different from polyphonic after-touch. Use this message to send the single
     * greatest pressure value (of all the current depressed keys).
     * Data: (0vvvvvvv) is the pressure value.
     */
    ChannelPressure = 0b1101,

    /**
     * This message is sent to indicate a change in the pitch bender (wheel or lever, typically).
     * The pitch bender is measured by a fourteen bit value.
     * Center (no pitch change) is 2000H. Sensitivity is a function of the receiver, but may be set
     * using RPN 0.
     * Data bytes: `0lllllll 0mmmmmmm`
     * `lllllll` are the least significant 7 bits. `mmmmmmm` are the most significant 7 bits.
     */
    PitchBend = 0b1110
}

export class ChannelMidiEvent extends BaseMidiEvent {
    public channelMessageType: ChannelMessageType = ChannelMessageType.None;

    public channel: number = 0;

    public getMidiEventType() {
        return MidiEventType.Channel;
    }
}

export class NoteMidiEvent extends ChannelMidiEvent {
    public note: MidiNote = 0;
    public velocity: number = 0;
}

export class ControllerMidiEvent extends ChannelMidiEvent {
    public controller: number = 0;
    public value: number = 0;
}

export class ProgramChangeMidiEvent extends ChannelMidiEvent {
    public program: number = 0;
}

export class ChannelPressureMidiEvent extends ChannelMidiEvent {
    public velocity: number = 0;
}

export class PitchBendMidiEvent extends ChannelMidiEvent {
    public value: number = 0;
}

export class MetaMidiEvent extends BaseMidiEvent {
    public metaMessageType: number = 0;

    public getMidiEventType() {
        return MidiEventType.Meta;
    }
}