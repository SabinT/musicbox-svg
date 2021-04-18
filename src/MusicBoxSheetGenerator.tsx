import React from 'react';
import './MusicBoxSheetGenerator.css';
import MidiFilePicker from './components/MidiFilePicker';
import MidiFile from './model/MidiFile';
import MidiJsonConverter from './utilities/MidiJsonConverter';
import MusicBoxSvg from './components/MusicBoxSvg';
import { IMusicBoxSvgFormatOptions } from "./model/IMusicBoxSvgFormatOptions";
import { BuiltInProfiles, IMusicBoxProfile } from './model/IMusicBoxProfile';
import { MusicBoxProfileEditor } from './components/MusicBoxProfileEditor';

import { Card, Collapse, Pre, Button, Divider, NonIdealState, ButtonGroup } from '@blueprintjs/core';
import { MusicBoxSvgFormatEditor } from './components/MusicBoxSvgFormatEditor';
import { Tab, Tabs } from "@blueprintjs/core";

const CREDITS = [
  { asset: 'Midi Icon', by: 'Midi Synthesizer by Iconic from the Noun Project' }
]

interface IAppState {
  midiJson: string;
  fileName?: string;
  midiFile?: MidiFile;
  midiDataAvailable: boolean;
  musicBoxProfile: IMusicBoxProfile;
  musicBoxSvgFormatOptions: IMusicBoxSvgFormatOptions;
  showMidiJson: boolean;
}

export default class MusicBoxSheetGenerator extends React.Component<{}, IAppState> {
  private musicBoxSvgRef: MusicBoxSvg | null;

  constructor(props: {}) {
    super(props);

    this.state = {
      midiJson: '',
      midiDataAvailable: false,
      musicBoxProfile: BuiltInProfiles['fifteenNote'],
      musicBoxSvgFormatOptions: {
        pageWidthMm: 200,
        startPaddingMm: 10,
        renderBorder: true,
        omitPageBoundaries: false,
        optimizePageBoundaries: true,
        loopMode: false
      },
      showMidiJson: false
    };

    this.musicBoxSvgRef = null;
  }

  render() {
    const credits = CREDITS.map((x, i) => {
      return (
        <div key={i}>
          <span>{x.asset}: </span><span>{x.by}</span>
        </div>
      );
    })

    let filePicker: JSX.Element =
      <div className='mb-settingsTab-container'>
        <MidiFilePicker
          fileName={this.state.fileName}
          midiFile={this.state.midiFile}
          onFileLoaded={(filename, midiFile) => this.onMidiDataLoaded(filename, midiFile)}
        />
      </div>;

    let paperSettings: JSX.Element =
      <div className='mb-settingsTab-container'>
        <MusicBoxProfileEditor
          profile={this.state.musicBoxProfile}
          onChange={(profile) => this.setState({ ...this.state, musicBoxProfile: profile })} />
      </div>;

    let formatSettings: JSX.Element = <></>;
    if (this.state.midiDataAvailable && this.state.midiFile) {
      formatSettings =
        <div className='mb-settingsTab-container'>
          <MusicBoxSvgFormatEditor
            options={this.state.musicBoxSvgFormatOptions}
            onChange={(options) => this.setState({ ...this.state, musicBoxSvgFormatOptions: options })} />
        </div>
    } else {
      formatSettings =
        <div className='mb-settingsTab-container'>
          <Card>
            <NonIdealState
              icon={"error"}
              title="No file loaded"
              description={"Load a MIDI file to generate layout"}
              action={undefined}
            />
          </Card>
        </div>;
    }

    return (
      <div className='mb-appRoot'>
        <div className='mb-settingsArea'>

          <Tabs
            animate={true}
            id="settings-tabs"
            key={"settings-tabs"}
            renderActiveTabPanelOnly={true}
            vertical={true}
          >
            <Tab id="file-picker-tab" title="MIDI File" panel={filePicker} />
            <Tab id="paper-settings-tab" title="Paper/Music Box Settings" panel={paperSettings} />
            <Tab id="format-settings-tab" title="Layout/Pagination" panel={formatSettings} />
            <Tabs.Expander />
          </Tabs>

        </div>
        <Divider />
        {
          this.state.midiDataAvailable && this.state.midiFile &&
          <Card className='mb-musicBox-preview'>
            <MusicBoxSvg
              ref={(el) => { this.musicBoxSvgRef = el; }}
              musicBoxProfile={this.state.musicBoxProfile}
              formatting={this.state.musicBoxSvgFormatOptions}
              midiFile={this.state.midiFile}
              elementId={'mb-musicBoxSvg'} />
          </Card>
        }
        <div className='mb-debugMessage-Container'>
          {
            this.state.midiDataAvailable &&
            <>
              <ButtonGroup style={{ minWidth: 200 }}>
                <Button
                  icon={'download'}
                  text={'Download SVG(s)'}
                  onClick={() => { this.downloadSvgs() }}
                />
                <Button onClick={() => this.toggleDebugMessage()}>
                  {this.state.showMidiJson ? "Hide" : "Show"} MIDI JSON
                </Button>
                <Button icon={'export'} onClick={() => this.copyMidiJson()}>
                  Copy MIDI Json
                </Button>
              </ButtonGroup>
              <Collapse isOpen={this.state.showMidiJson}>
                <Pre className='mb-debugMessage'>{this.state.midiJson}</Pre>
              </Collapse>
              <Divider />
            </>
          }
          <Card>
            Code is available in <a href="https://github.com/SabinT/musicbox-svg">github</a><br />
            Credits<br />
            {credits}
          </Card>
        </div>
      </div>
    );
  }

  private onMidiDataLoaded(fileName: string, midiFile: MidiFile) {
    this.setState({
      midiFile: midiFile,
      fileName: fileName,
      midiJson: MidiJsonConverter.GetJson(midiFile),
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

          const midiFileName = this.state.fileName ?? 'musicBox';

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
