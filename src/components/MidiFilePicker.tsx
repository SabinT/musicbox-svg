import './MidiFilePicker.css';
import * as React from 'react';
import Box from '@material-ui/core/Box/Box';

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
                this.openFile(ev.dataTransfer.files[i]);
                break;
            }
        }
    }

    private handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        const target = event.currentTarget;
        if (target.files) {
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
        const message: JSX.Element = this.state.fileName
            ? <p>{this.state.fileName} loaded. Drag another file to replace.</p>
            : <p>No file loaded, drag and drop a file here.</p>;

        return (
            <Box id={'drop_zone'}
                onDrop={(ev) => this.dropHandler(ev)}
                onDragOver={(ev) => this.dragOverHandler(ev)}
            >
                {message}
                <div>
                    Or <input type="file" id="myfile" name="myfile" onChange={(ev) => this.handleInputChange(ev)} />
                </div>
            </Box>
        )
    }
}
