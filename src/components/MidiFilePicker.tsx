import './MidiFilePicker.css';
import * as React from 'react';
import { Card, FileInput, NonIdealState, H4, Callout } from "@blueprintjs/core";
import MidiFile from '../model/MidiFile';
import { MidiNote } from '../model/MidiConstants';
import MidiNoteHistogram from './MidiNoteHistogram';

export interface IMidiFilePickerProps {
    onFileLoaded?(midiFile: MidiFile): void;
}

export interface IMidiFilePickerState {
    fileName?: string;
}

export default class MidiFilePicker extends React.Component<IMidiFilePickerProps, IMidiFilePickerState>{
    private midiFile?: MidiFile;

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    public getCurrentFilename(): string | undefined {
        return this.state.fileName;
    }

    private dropHandler(ev: React.DragEvent) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    let file = ev.dataTransfer.items[i].getAsFile();
                    if (file) {
                        this.openFile(file);
                        break;
                    }
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.files.length; i++) {
                const file = ev.dataTransfer.files[i];
                if (file) {
                    this.openFile(ev.dataTransfer.files[i]);
                    break;
                }
            }
        }
    }

    private handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        const target = event.currentTarget;
        if (target.files && target.files.length > 0 && target.files[0]) {
            this.openFile(target.files[0]);
        }
    }

    private openFile(file: File) {
        this.setState({ fileName: file.name });

        var reader = new FileReader();
        reader.onload = () => {
            if (this.props.onFileLoaded && reader.result instanceof ArrayBuffer) {
                this.midiFile = new MidiFile();
                this.midiFile.loadFromBuffer(reader.result);

                this.props.onFileLoaded(this.midiFile);
            }
        }

        reader.readAsArrayBuffer(file);
    }

    private dragOverHandler(ev: React.DragEvent) {
        // Prevent default behavior (Prevent file from being opened)
        ev.stopPropagation();
        ev.preventDefault();
    }

    render() {
        const action = !!this.midiFile
            ? <FileInput text={this.state.fileName} buttonText={'Replace'} onInputChange={(ev) => this.handleInputChange(ev)} />
            : <FileInput text={'Select a MIDI file'} onInputChange={(ev) => this.handleInputChange(ev)} />;

        let content: JSX.Element;

        if (this.midiFile) {
            const stats = this.midiFile.midiStats;

            const tempoInfo = 'Tempo: ' +
                stats.tempos.map(x => parseFloat(x.toFixed(2))).join(', ') + ' bpm';

            content =
                <>
                    <H4>{this.state.fileName}</H4>
                    {action}
                    <Callout>
                        <p>{tempoInfo}, {stats.lastNoteOnEventInSeconds} seconds </p>
                        <p>High Note: {MidiNote[stats.highNote]}, Low Note: {MidiNote[stats.lowNote]} </p>
                    </Callout>
                    <MidiNoteHistogram width={320} height={80} midiStats={stats} />
                </>;
        } else {
            content = <NonIdealState
                icon={'import'}
                title='No file loaded'
                description={'Drag and drop or select a file below...'}
                action={action}
            />
        }

        return (
            <Card id={'drop_zone'}
                onDrop={(ev) => this.dropHandler(ev)}
                onDragOver={(ev) => this.dragOverHandler(ev)}
                className={'mb-midiFilePicker'}
            >
                {content}
            </Card>
        )
    }
}
