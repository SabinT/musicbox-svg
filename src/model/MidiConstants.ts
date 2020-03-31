/**
 * MIDI numbers for various notes. A4 is the 440 Hz "tuning" note.
 * Letter 'n' in enum name indicates negative octave (e.g., `Cn1` = C, octave -1)
 * Letter 's' indicates 'sharp' (e.g., `Cs3` = C# 3)
 * 
 * Note: octave numbering might differ by one, depending on the program.
 */
export enum MidiNote {
    None = -1,
    // n1 = -1 octave
    Cn1 = 0,
    Csn1 = 1,
    Dn1 = 2,
    Dsn1 = 3,
    En1 = 4,
    Fn1 = 5,
    Fsn1 = 6,
    Gn1 = 7,
    Gsn1 = 8,
    An1 = 9,
    Asn1 = 10,
    Bn1 = 11,
    C0 = 12,
    Cs0 = 13,
    D0 = 14,
    Ds0 = 15,
    E0 = 16,
    F0 = 17,
    Fs0 = 18,
    G0 = 19,
    Gs0 = 20,
    A0 = 21,
    As0 = 22,
    B0 = 23,
    C1 = 24,
    Cs1 = 25,
    D1 = 26,
    Ds1 = 27,
    E1 = 28,
    F1 = 29,
    Fs1 = 30,
    G1 = 31,
    Gs1 = 32,
    A1 = 33,
    As1 = 34,
    B1 = 35,
    C2 = 36,
    Cs2 = 37,
    D2 = 38,
    Ds2 = 39,
    E2 = 40,
    F2 = 41,
    Fs2 = 42,
    G2 = 43,
    Gs2 = 44,
    A2 = 45,
    As2 = 46,
    B2 = 47,
    C3 = 48,
    Cs3 = 49,
    D3 = 50,
    Ds3 = 51,
    E3 = 52,
    F3 = 53,
    Fs3 = 54,
    G3 = 55,
    Gs3 = 56,
    A3 = 57,
    As3 = 58,
    B3 = 59,
    C4 = 60,
    Cs4 = 61,
    D4 = 62,
    Ds4 = 63,
    E4 = 64,
    F4 = 65,
    Fs4 = 66,
    G4 = 67,
    Gs4 = 68,
    A4 = 69,
    As4 = 70,
    B4 = 71,
    C5 = 72,
    Cs5 = 73,
    D5 = 74,
    Ds5 = 75,
    E5 = 76,
    F5 = 77,
    Fs5 = 78,
    G5 = 79,
    Gs5 = 80,
    A5 = 81,
    As5 = 82,
    B5 = 83,
    C6 = 84,
    Cs6 = 85,
    D6 = 86,
    Ds6 = 87,
    E6 = 88,
    F6 = 89,
    Fs6 = 90,
    G6 = 91,
    Gs6 = 92,
    A6 = 93,
    As6 = 94,
    B6 = 95,
    C7 = 96,
    Cs7 = 97,
    D7 = 98,
    Ds7 = 99,
    E7 = 100,
    F7 = 101,
    Fs7 = 102,
    G7 = 103,
    Gs7 = 104,
    A7 = 105,
    As7 = 106,
    B7 = 107,
    C8 = 108,
    Cs8 = 109,
    D8 = 110,
    Ds8 = 111,
    E8 = 112,
    F8 = 113,
    Fs8 = 114,
    G8 = 115,
    Gs8 = 116,
    A8 = 117,
    As8 = 118,
    B8 = 119,
    C9 = 120,
    Cs9 = 121,
    D9 = 122,
    Ds9 = 123,
    E9 = 124,
    F9 = 125,
    Fs9 = 126,
    G9 = 127
}

/** Message types for MIDI meta messages (status byte 0xFF) */
export enum MIDIMetaMessageType {
    /** 2 bytes length, The number of a sequence, occurs at delta time 0 */
    SequenceNumber = 0x00,

    /** variable length, Some text, occurs anywhere in the track */
    Text = 0x01,

    /** variable length, A copyright notice, occurs at delta time 0 in the first track */
    CopyrightNotice = 0x02,

    /** variable length, A track name, occurs at delta time 0 */
    TrackName = 0x03,

    /** variable length, The name of an instrument in the current track, occurs anywhere in the track */
    InstrumentName = 0x04,

    /** variable length, Lyrics, usually a syllable per quarter note, occurs anywhere in the track */
    Lyrics = 0x05,

    /** variable length, The text of a marker, occurs anywhere in the track */
    Marker = 0x06,

    /** variable length, The text of a cue, usually to prompt for some action from the user, occurs anywhere in the track */
    CuePoint = 0x07,

    /** 1 byte length, A channel number (following meta events will apply to this channel), occurs anywhere in the track */
    ChannelPrefix = 0x20,

    /** 0 byte length,   length, At the end of each track */
    EndOfTrack = 0x2F,

    /** 3 byte length, The number of microseconds per beat, occurs anywhere in the track, but usually in the first track */
    SetTempo = 0x51,

    /** 5 byte length, SMPTE time to denote playback offset from the beginning, occurs anywhere in the track */
    SmpteOffset = 0x54,

    /** 4 byte length, Time signature, metronome clicks, and size of a beat in 32nd notes, occurs anywhere in the track */
    TimeSignature = 0x58,

    /** 2 byte length, A key signature, occurs anywhere in the track */
    KeySignature = 0x59,

    /** variable length, Something specific to the MIDI device manufacturer, occurs anywhere in the track */
    SequencerSpecific = 0x7F
}