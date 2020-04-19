import React from 'react';
import './App.css';
import MidiFilePicker from './components/MidiFilePicker';
import MidiFile from './model/MidiFile';
import MidiJsonConverter from './utilities/MidiJsonConverter';
import MusicBoxSvg from './components/MusicBoxSvg';
import { IMusicBoxSvgFormatOptions } from "./model/IMusicBoxSvgFormatOptions";
import { BuiltInProfiles, IMusicBoxProfile } from './model/IMusicBoxProfile';
import { MusicBoxProfileEditor } from './components/MusicBoxProfileEditor';

import { Card, Collapse, Pre, Button, Divider } from '@blueprintjs/core';
import { MusicBoxSvgFormatEditor } from './components/MusicBoxSvgFormatEditor';

const CREDITS = [
  { asset: 'Midi Icon', by: 'Midi Synthesizer by Iconic from the Noun Project' }
]

interface IAppState {
  midiJson: string;
  midiDataAvailable: boolean;
  musicBoxProfile: IMusicBoxProfile;
  musicBoxSvgFormatOptions: IMusicBoxSvgFormatOptions;
  showMidiJson: boolean;
}

export default class App extends React.Component<{}, IAppState> {
  private midiFile?: MidiFile;

  private musicBoxSvgRef: MusicBoxSvg | null;
  private midiFilePickerRef: MidiFilePicker | null;

  constructor(props: {}) {
    super(props);

    this.state = {
      midiJson: '',
      midiDataAvailable: false,
      musicBoxProfile: BuiltInProfiles['fifteenNote'],
      musicBoxSvgFormatOptions: {
        pageWidthMm: 0,
        renderBorder: true,
        omitPageBoundaries: true
      },
      showMidiJson: false
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
              onFileLoaded={(x) => this.onMidiDataLoaded(x)}
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
            <div className='mb-paperSettings-container'>
              <MusicBoxSvgFormatEditor
                options={this.state.musicBoxSvgFormatOptions}
                onChange={(options) => this.setState({ ...this.state, musicBoxSvgFormatOptions: options })} />
            </div>
            <div className='mb-musicBox-preview'>
              <MusicBoxSvg
                ref={(el) => { this.musicBoxSvgRef = el; }}
                musicBoxProfile={this.state.musicBoxProfile}
                formatting={this.state.musicBoxSvgFormatOptions}
                midiFile={this.midiFile}
                elementId={'mb-musicBoxSvg'} />
              <Button
                icon={'download'}
                text={'Download SVG(s)'}
                className={'mb-svg-downloadButton'}
                onClick={() => { this.downloadSvgs() }}
              />
            </div>
          </>
        }
        <div className='mb-debugMessage-Container'>
          {
            this.state.midiDataAvailable &&
            <>
              <Button onClick={() => this.toggleDebugMessage()}>
                {this.state.showMidiJson ? "Hide" : "Show"} MIDI contents
              </Button>
              <Button icon={'export'} onClick={() => this.copyMidiJson()}>
                Copy MIDI Json
              </Button>
              <Collapse isOpen={this.state.showMidiJson}>
                <Pre className='mb-debugMessage'>{this.state.midiJson}</Pre>
              </Collapse>
              <Divider />
            </>
          }
          <Card>
            Credits<br />
            {credits}
          </Card>
        </div>
      </div>
    );
  }

  private onMidiDataLoaded(midiFile: MidiFile) {
    this.midiFile = midiFile;

    this.setState({
      midiJson: MidiJsonConverter.GetJson(this.midiFile),
      midiDataAvailable: true
    });
  }

  private downloadSvgs() {
    if (this.musicBoxSvgRef) {
      const numPages = this.musicBoxSvgRef.getNumPages();

      for (let i = 0; i < numPages; i++) {
        const svgData = this.musicBoxSvgRef.getSvg(i);
        if (svgData) {
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const svgUrl = URL.createObjectURL(svgBlob);
          const downloadLink = document.createElement('a');
          downloadLink.href = svgUrl;

          const midiFileName = this.midiFilePickerRef
            ? this.midiFilePickerRef.getCurrentFilename()
            : 'musicBox';

          downloadLink.download = `${midiFileName}_page_${i}.svg`;

          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      }
    }
  }

  private copyMidiJson(): void {
    navigator.clipboard.writeText(this.state.midiJson);
  }

  private toggleDebugMessage(): void {
    this.setState({ ...this.state, showMidiJson: !this.state.showMidiJson });
  }
}
