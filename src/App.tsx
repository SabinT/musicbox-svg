import React from 'react';
import './App.css';
import MidiFilePicker from './components/MidiFilePicker';
import MidiFile from './model/MidiFile';
import MidiJsonConverter from './utilities/MidiJsonConverter';
import MusicBoxSvg from './components/MusicBoxSvg';
import { BuiltInProfiles, IMusicBoxProfile } from './model/MusicBox';
import { MusicBoxProfileEditor } from './components/MusicBoxProfileEditor';

import { Card, Collapse, Pre, Button, Divider } from '@blueprintjs/core';

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

  private musicBoxSvgRef: MusicBoxSvg | null;
  private midiFilePickerRef: MidiFilePicker | null;

  constructor(props: {}) {
    super(props);

    this.state = {
      debugMessage: '',
      midiDataAvailable: false,
      musicBoxProfile: BuiltInProfiles['fifteenNote'],
      showDebugMessage: false
    };

    this.musicBoxSvgRef = null;
    this.midiFilePickerRef = null;
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
              onFileLoaded={(buffer) => this.onMidiDataLoaded(buffer)}
              ref={(x) => { this.midiFilePickerRef = x; }} />
          </div>
          <div className='mb-paperSettings-container'>
            <MusicBoxProfileEditor
              profile={this.state.musicBoxProfile}
              onChange={(profile) => this.setState({ ...this.state, musicBoxProfile: profile })} />
          </div>
        </div>
        <Divider />
        {
          this.state.midiDataAvailable && this.midiFile &&
          <>
            <div className='mb-musicBox-preview'>
              <MusicBoxSvg
                ref={(el) => { this.musicBoxSvgRef = el; }}
                musicBoxProfile={this.state.musicBoxProfile}
                midiFile={this.midiFile}
                elementId={'mb-musicBoxSvg'} />
              <Button
                icon={'download'}
                text={'Download'}
                className={'mb-svg-downloadButton'}
                onClick={() => { this.downloadSvg() }}
              />
            </div>
          </>
        }
        <div className='mb-debugMessage-Container'>
          <Button onClick={() => this.toggleDebugMessage()}>
            {this.state.showDebugMessage ? "Hide" : "Show"} MIDI contents
          </Button>
          <Collapse isOpen={this.state.showDebugMessage}>
            <Pre className='mb-debugMessage'>{this.state.debugMessage}</Pre>
          </Collapse>
          <Divider />
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

  private downloadSvg() {
    if (this.musicBoxSvgRef) {
      const svgData = this.musicBoxSvgRef.getSvgData();

      if (svgData) {
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;

        const midiFileName = this.midiFilePickerRef
          ? this.midiFilePickerRef.getCurrentFilename()
          : 'musicBox';

        downloadLink.download = midiFileName + '.svg';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
  }

  private toggleDebugMessage(): void {
    this.setState({ ...this.state, showDebugMessage: !this.state.showDebugMessage });
  }
}
