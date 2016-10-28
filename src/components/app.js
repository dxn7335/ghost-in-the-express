import React, { Component, PropTypes } from 'react';
import '../styles/body.scss';
const socket = io.connect();

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      command: false,
      speech: this.setSpeech(),
      ready: false,
      kids: false,
      startvideo: false
    };
  }

  componentDidMount() {
    socket.on('command:set', this.setCommand.bind(this));
    socket.on('script:say', this.handleRecieveLine.bind(this));
    socket.on('script:ready', this.handleOnReady.bind(this));
    socket.on('mode:switch', this.handleModeSwitch.bind(this));
    socket.on('video:play', this.handleVideoPlay.bind(this));
  }

  handleRecieveLine(line) {
    console.log("new line", line);
    this.speak(line.text);
  }

  handleSendMessage(message) {
    socket.emit('send:message', message);
  }

  handleOnReady() {
    this.setState({ready: true});
  }

  handleModeSwitch(mode) {
    var kidsFlag = mode.flag;
    if (kidsFlag) {
      this.setState({ kids: true });
    } else {
      this.setState({ kids: false, startvideo: false });
    }
  }

  handleVideoPlay(mode) {
    this.setState({startvideo: true});
  }

  switchMode(mode) {
    if (mode === "kids") {
      socket.emit('mode:kids', {mode: mode});
    } else {
      socket.emit('mode:normal', {mode: mode});
    }
  }

  setCommand() {
    this.setState({command: true});
  }

  setSpeech() {
    var voices = window.speechSynthesis.getVoices();
    var msg = {
      voice: voices[Math.floor(Math.random() * (10 - 5 + 1) + 5)], // Note: some voices don't support altering params
      voiceURI: 'native',
      volume: 1, // 0 to 1
      rate: 1.2, // 0.1 to 10
      pitch: Math.random() * (1.6 + 0), //0 to 2
      lang: 'en-US'
    };

    return msg;
  }

  startConversation() {
    socket.emit('script:start', {start: 'true'});
  }

  speak(message) {
    var speechSpec = this.state.speech;
    var msg = new SpeechSynthesisUtterance();
    msg = Object.assign( msg, 
      {
        text: message,
        rate: speechSpec.rate,
        pitch: speechSpec.pitch,
        voice: speechSpec.voice
      }
    );

    msg.onend = function(e) {
      setTimeout( function() {
        console.log('finish', socket);
        socket.emit('script:finishsay', {finish: true})
      }, 700);
    };

    window.speechSynthesis.speak(msg);
  }

  /**
   * RENDER
   */

  renderContent(command) {
    if (this.state.command) {
      return (
        <div>
          <button disabled={!this.state.ready} onClick={() => this.startConversation()}>Start</button>
          <button disabled={!this.state.ready} onClick={() => this.switchMode('kids')}>Kids</button>
          <button disabled={!this.state.ready} onClick={() => this.switchMode('normal')}>Normal</button>
        </div>
      )
    } else {
      console.log(this.state.kids);
      const kids = (this.state.kids) ? "kids" : "normal";
      return (
        <div className={kids}>
          {this.renderVideo(this.state.startvideo)}
        </div>
      )
    }
  }

  renderVideo(playvideo) {
    if(playvideo) {
      return (
        <div className="video">
          <iframe width="854" height="480" src="https://www.youtube.com/embed/d9TpRfDdyU0?autoplay=1" frameborder="0" allowfullscreen></iframe>
        </div>
      )
    }

    return ('');
  }

  // main
  render() {
    const red = Math.floor(Math.random() * 255);
    const gre = Math.floor(Math.random() * 255);
    const blu = Math.floor(Math.random() * 255);
    return ( 
      <div className="app">
        { this.renderContent(this.state.command) }
      </div>
    );
  }
}
