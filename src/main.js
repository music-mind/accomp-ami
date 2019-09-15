import React from 'react';
import { ReactMic } from 'react-mic';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import BufferLoader from './buffer';
import Fab from '@material-ui/core/Fab';
import MusicNote from '@material-ui/icons/MusicNote.js';
import Stop from '@material-ui/icons/Stop';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      recordings: [],
      context: '',
      bufferLoader: ''
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
      record: true
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
      //bufferLoader: bufferLoader
    });

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
    let button = record == false ? (<Fab onClick={this.startRecording} color="primary" >
          <MusicNote />
    </Fab>) ://<Button onClick={this.startRecording} color="primary">Start</Button> :
      //<Button onClick={this.stopRecording} color="secondary">Stop</Button>;
      (<Fab color="secondary" onClick={this.stopRecording}>
            <Stop />
      </Fab>);
    let tracks = recordings.map(recording => {
      return <div><audio ref={React.createRef()} src={recording.blobURL} controls autoPlay loop/></div>;
    });


    return (
      <div>
        <Typography variant="h3" gutterBottom>
          Accomp-ami
        </Typography>
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#FF4081" />
        <div>{button}</div>
        {tracks}
      </div>
    );
  }
}

export default Main;
