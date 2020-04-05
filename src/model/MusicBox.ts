import { MidiNote } from "./MidiConstants";

/**
 * Properties pertaining to the paper tape's width and supported notes for music box.
 */
export interface IMusicBoxProfile {
    /** Friendly name for the profile (e.g., for display on the UI) */
    name: string;

    /** Total width of the music box's paper tape, in millimeters. */
    paperWidthMm: number;

    /**
     * Total width (mm) of the area within the paper where notes can be drawn/punched.
     * Basically the distance between the first and the last "note line" in the paper tape.
     * */
    contentWidthMm: number;

    /**
     * The list of notes supported by the music box.
     */
    supportedNotes: MidiNote[];

    /**
     * The optimal diameter of punched holes, in millimeters.
     */
    holeDiameterMm: number;

    /**
     * The ideal length in paper for one second of music.
     */
    millimetersPerSecond: number;
}

export const BuiltInProfiles: { [key: string]: IMusicBoxProfile } = {
    'fifteenNote': {
        name: 'Fifteen Note',
        paperWidthMm: 40.31,
        contentWidthMm: 28,
        supportedNotes: [
            MidiNote.C4, MidiNote.D4, MidiNote.E4, MidiNote.F4, MidiNote.G4, MidiNote.A4,
            MidiNote.B4, MidiNote.C5, MidiNote.D5, MidiNote.E5, MidiNote.F5, MidiNote.G5,
            MidiNote.A5, MidiNote.B5, MidiNote.C6
        ],
        holeDiameterMm: 1.8,
        millimetersPerSecond: 10
    }

    // TODO
    // 'thirtyNote': <IMusicBoxProfile>{
    //     name: 'Thirty Note',
    // }
}