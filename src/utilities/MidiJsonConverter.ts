import MidiFile, { MidiTimingScheme, MidiFileFormat } from '../model/MidiFile';
import { ChannelMessageType } from '../model/MidiEvents';
import { MidiNote } from '../model/MidiConstants';

export default class MidiJsonConverter {
    public static GetJson(midiFile: MidiFile): string {
        return JSON.stringify(midiFile, prettyPrintReplacer, 4);
    }
}

/**
 * Used to hide some properties, and to make others more readable (e.g., enums as strings)
 */
function prettyPrintReplacer(key: string, value: any) {
    switch (key) {
        // Timing data is exposed as parsed properties, no need to output raw ArrayBuffer
        case 'rawTimingData':
            return undefined;

        // Avoid serializing header references for now. More interested in tracks
        case 'header':
            return undefined;

        case 'chunks':
            return undefined;

        case 'timingScheme':
            return MidiTimingScheme[value];

        case 'fileFormat':
            return MidiFileFormat[value];

        case 'channelMessageType':
            return ChannelMessageType[value];

        case 'note':
            return MidiNote[value];

        default:
            return value;
    }
}