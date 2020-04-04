import React from 'react';
import './App.css';
import MidiFilePicker from './components/MidiFilePicker';
import MidiFile from './model/MidiFile';
import MidiJsonConverter from './utilities/MidiJsonConverter';
import { Box, Typography, CssBaseline, Container, Grid, Paper } from '@material-ui/core';
import { MusicBoxSvg } from './components/MusicBoxSvg';
import { BuiltInProfiles, IMusicBoxProfile } from './model/MusicBox';
import { MusicBoxProfileEditor } from './components/MusicBoxProfileEditor';


const CREDITS = [
  { asset: 'Midi Icon', by: 'Midi Synthesizer by Iconic from the Noun Project' }
]

interface IAppState {
  debugMessage: string;
  midiDataAvailable: boolean;
  musicBoxProfile: IMusicBoxProfile;
}

export default class App extends React.Component<{}, IAppState> {
  private midiFile?: MidiFile;

  constructor(props: {}) {
    super(props);

    this.state = {
      debugMessage: '',
      midiDataAvailable: false,
      musicBoxProfile: BuiltInProfiles['fifteenNote']
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
      <>
        <CssBaseline />
        <Container maxWidth="lg">
          <div className="App">
            <header className="App-header">
              <p>
                Upload a MIDI file.
              </p>
            </header>
            <Grid container spacing={2}>
              <Grid item md>
                <MidiFilePicker
                  onFileLoaded={(buffer) => this.onMidiDataLoaded(buffer)} />
              </Grid>
              <Grid item md>
                <MusicBoxProfileEditor
                  profile={this.state.musicBoxProfile}
                  onChange={(profile) => this.setState({ ...this.state, musicBoxProfile: profile })} />
              </Grid>
            </Grid>
            {
              this.state.midiDataAvailable && this.midiFile &&
              <MusicBoxSvg
                musicBoxProfile={this.state.musicBoxProfile}
                midiFile={this.midiFile} />
            }
            <Box className='App-debug-message-box' id='App-debug-message-box-id'>
              <Typography align={'left'}>
                {this.state.debugMessage}
              </Typography>
            </Box>
            {credits}
          </div>
        </Container>
      </>
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
}
