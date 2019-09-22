import React from 'react';
import { ReactMic } from 'react-mic';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import BufferLoader from './buffer';
import Fab from '@material-ui/core/Fab';
import MusicNote from '@material-ui/icons/MusicNote.js';
import Stop from '@material-ui/icons/Stop';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import Logo from "./accompami.png";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      recordings: [],
      context: '',
      bufferLoader: '',
      visible: false,
      loaded: false
    }

  }

  componentDidMount() {
    try {
      // Fix up for prefixing
      window.AudioContext = window.AudioContext||window.webkitAudioContext;
      this.setState({
        context: new AudioContext()
      });
    }
    catch(e) {
      alert('Web Audio API is not supported in this browser');
    }
  }



  startRecording = () => {
    this.setState({
      record: true,
      visible: true
    });
  }

  stopRecording = () => {
    this.setState({
      record: false
    });
  }

  onData = recordedBlob => {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop = recordedBlob => {
    console.log('recordedBlob is: ', recordedBlob);
  //  let { context } = this.state;
    let recordings = [...this.state.recordings, recordedBlob];
    // let bufferLoader = new BufferLoader(
    //   context,
    //   recordings,
    //   this.finishedLoading
    // );
    // bufferLoader.load();
    this.setState({
      recordings: recordings,
      visible: false
      //bufferLoader: bufferLoader
    });

  }

  deleteTrack = (i) => {
    let recordings = [...this.state.recordings]; // make a separate copy of the array
    //let i = recordings.indexOf(e.target.value);
    if (i !== -1) {
      recordings.splice(i, 1);
    }
    this.setState({
      recordings: recordings
    });
  }

  getFile = (e) => {
    let sound = document.getElementById('sound');
    sound.src = URL.createObjectURL(e.target.files[0]);
    sound.style.visibility = 'visible';
  }

  share = () => {
    // to do
  }

  // finishedLoading(bufferList) {
  //   // Create two sources and play them both together.
  //   let { context } = this.state;
  //
  //   this.state.recordings.map(recording => {
  //     return context.createBufferSource();
  //   }).map((recording, i) => recording.buffer = bufferList[i]).map(recording => {
  //     return recording.connect(context.destination)
  //   }).map(recording => recording.start(0));
  //
  // }




  render() {
    let { record, recordings } = this.state;
    let button = record == false ? (<Fab onClick={this.startRecording} style={{width:200, height:
    200, margin: 20}} color="primary" >
          <MusicNote style={{width:150, height:150}}/>
    </Fab>) ://<Button onClick={this.startRecording} color="primary">Start</Button> :
      //<Button onClick={this.stopRecording} color="secondary">Stop</Button>;
      (<Fab color="secondary" onClick={this.stopRecording} style={{width:200, height:
      200, margin: 20}}>
            <Stop style={{width:150, height:150}}/>
      </Fab>);
    let tracks = recordings.map((recording, i) => {
      return <div style={{verticalAlign: 'middle', display: 'flex', justifyContent: 'center', marginBottom: 10}}><audio ref={React.createRef()} src={recording.blobURL} controls autoPlay loop/>
        <IconButton color="secondary" onClick={() => this.deleteTrack(i)} >
          <Close />
        </IconButton>
      </div>;
    });


    return (
      <div>
        <img src={require('./cover_trans.png')} style={{height:100}}/>
        <div>
        {this.state.visible && <ReactMic
          record={this.state.record}
          className="mic"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#FF4081" />}
        </div>
        <div>{button}</div>
        <div className="scroll" style={{overflowY: 'auto', width: 'fit-content', height: 200, marginLeft: 'auto', marginRight: 'auto'}}>{tracks}</div>
        <Button color="primary" variant="contained" style={{position: 'absolute', bottom: 0, left: 0}} onClick={(e) => this.myInput.click()}>Load</Button>
        <audio id="sound" controls style={{visibility: 'hidden', position: 'absolute', bottom: 0, left: 80, height: 36}}/>
        <Button color="primary" variant="contained" style={{position: 'absolute', bottom: 0, right: 0}} onClick={this.share}>Share</Button>
        <input id="myInput" type="file" ref={(ref) => this.myInput = ref} style={{ display: 'none' }} onChange={this.getFile}/>
      </div>
    );
  }
}

export default Main;
