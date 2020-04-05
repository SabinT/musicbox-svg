import './MidiFilePicker.css';
import * as React from 'react';
import { Button, Card, Elevation, FileInput, Label } from "@blueprintjs/core";

export interface IMidiFilePickerProps {
    onFileLoaded?(buffer: ArrayBuffer): void;
}

export interface IMidiFilePickerState {
    fileName?: string;
}

export default class MidiFilePicker extends React.Component<IMidiFilePickerProps, IMidiFilePickerState>{
    constructor(props: any) {
        super(props);
        this.state = {};
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
        reader.onload = (e) => {
            if (this.props.onFileLoaded && reader.result instanceof ArrayBuffer) {
                this.props.onFileLoaded(reader.result);
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
        return (
            <Card id={'drop_zone'}
                onDrop={(ev) => this.dropHandler(ev)}
                onDragOver={(ev) => this.dragOverHandler(ev)}
            >
                <div>
                    <Label>
                        Drag and drop, or pick a file...
                        <FileInput text={this.state.fileName || 'No file loaded...'} onInputChange={(ev) => this.handleInputChange(ev)} />
                    </Label>
                </div>
            </Card>
        )
    }
}
