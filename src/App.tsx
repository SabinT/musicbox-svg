import React from 'react';
import './App.css';
import MidiFilePicker from './components/MidiFilePicker';
import MidiFile from './model/MidiFile';

const CREDITS = [
  {asset: 'Midi Icon', by: 'Midi Synthesizer by Iconic from the Noun Project'}
]

export default class App extends React.Component {
  private midiFile?: MidiFile;

  render() {
    const credits = CREDITS.map((x, i) => {
      return (
        <div key={ i }>
          <span>{ x.asset }: </span><span>{ x.by }</span>
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
          onFileLoaded={ (buffer) => this.onMidiDataLoaded(buffer) }/>
          { credits }
      </div>
    );
  }

  private onMidiDataLoaded(buffer: ArrayBuffer) {
    this.midiFile = new MidiFile(buffer);
  }
}
