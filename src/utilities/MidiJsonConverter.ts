import MidiFile, { MidiTimingScheme, MidiFileFormat } from '../model/MidiFile';

export default class MidiJsonConverter {
    public static GetJson(midiFile: MidiFile): string {
        return JSON.stringify(midiFile.chunks, prettyPrintReplacer, 4);
    }
}

function prettyPrintReplacer(key: string, value: any) {
    switch (key) {
        case 'rawTickDiv':
            return undefined;

        case 'raw':
            return undefined;

        case 'timingScheme':
            return MidiTimingScheme[value];

        case 'fileFormat':
            return MidiFileFormat[value];

        default:
            return value;
    }
}