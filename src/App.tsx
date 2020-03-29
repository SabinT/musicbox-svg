import React from 'react';
import './App.css';
import MidiFilePicker from './components/MidiFilePicker';
import MidiFile from './model/MidiFile';
import MidiJsonConverter from './utilities/MidiJsonConverter';
import { Box, Typography } from '@material-ui/core';

const CREDITS = [
  { asset: 'Midi Icon', by: 'Midi Synthesizer by Iconic from the Noun Project' }
]

interface IAppState {
  debugMessage: string;
}

export default class App extends React.Component<{}, IAppState> {
  private midiFile?: MidiFile;

  constructor(props: {}) {
    super(props);

    this.state = {
      debugMessage: ''
    }
  }

  render() {
    const credits = CREDITS.map((x, i) => {
      return (
        <div key={i}>
          <span>{x.asset}: </span><span>{x.by}</span>
        </div>
      );
    })

    return (
      <div className="App">
        <header className="App-header">
          <p>
            Upload a MIDI file.
          </p>
        </header>
        <MidiFilePicker
          onFileLoaded={(buffer) => this.onMidiDataLoaded(buffer)} />
        <Box className='App-debug-message-box' id='App-debug-message-box-id'>
          <Typography align={'left'}>
            {this.state.debugMessage}
          </Typography>
        </Box>
        {credits}
      </div>
    );
  }

  private onMidiDataLoaded(buffer: ArrayBuffer) {
    this.midiFile = new MidiFile();
    this.midiFile.loadFromBuffer(buffer);

    this.setState({ debugMessage: MidiJsonConverter.GetJson(this.midiFile) });
  }
}
