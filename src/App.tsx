import React from 'react';
import './App.css';
import MidiFilePicker from './components/MidiFilePicker';
import MidiFile from './model/MidiFile';
import MidiJsonConverter from './utilities/MidiJsonConverter';
import { MusicBoxSvg } from './components/MusicBoxSvg';
import { BuiltInProfiles, IMusicBoxProfile } from './model/MusicBox';
import { MusicBoxProfileEditor } from './components/MusicBoxProfileEditor';

import { Card, Collapse, Pre, Button } from '@blueprintjs/core';

const CREDITS = [
  { asset: 'Midi Icon', by: 'Midi Synthesizer by Iconic from the Noun Project' }
]

interface IAppState {
  debugMessage: string;
  midiDataAvailable: boolean;
  musicBoxProfile: IMusicBoxProfile;
  showDebugMessage: boolean;
}

export default class App extends React.Component<{}, IAppState> {
  private midiFile?: MidiFile;

  constructor(props: {}) {
    super(props);

    this.state = {
      debugMessage: '',
      midiDataAvailable: false,
      musicBoxProfile: BuiltInProfiles['fifteenNote'],
      showDebugMessage: false
    };
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
      <div className='mb-appRoot'>
        <div className='mb-settingsArea'>
          <div className='mb-filePicker-container'>
            <MidiFilePicker
              onFileLoaded={(buffer) => this.onMidiDataLoaded(buffer)} />
          </div>
          <div className='mb-paperSettings-container'>
            <MusicBoxProfileEditor
              profile={this.state.musicBoxProfile}
              onChange={(profile) => this.setState({ ...this.state, musicBoxProfile: profile })} />
          </div>
        </div>
        {
          this.state.midiDataAvailable && this.midiFile &&
          <div className='mb-musicBox-preview'>
            <MusicBoxSvg
              musicBoxProfile={this.state.musicBoxProfile}
              midiFile={this.midiFile} />
          </div>
        }
        <div className='mb-debugMessage-Container'>
          <Button onClick={() => this.toggleDebugMessage()}>
            {this.state.showDebugMessage ? "Hide" : "Show"} MIDI contents
          </Button>
          <Collapse isOpen={this.state.showDebugMessage}>
            <Pre className='mb-debugMessage'>{this.state.debugMessage}</Pre>
          </Collapse>
          <Card>
            Credits<br />
            {credits}
          </Card>
        </div>
      </div>
    );
  }

  private onMidiDataLoaded(buffer: ArrayBuffer) {
    this.midiFile = new MidiFile();
    this.midiFile.loadFromBuffer(buffer);

    this.setState({
      debugMessage: MidiJsonConverter.GetJson(this.midiFile),
      midiDataAvailable: true
    });
  }

  private toggleDebugMessage(): void {
    this.setState({ ...this.state, showDebugMessage: !this.state.showDebugMessage });
  }
}
