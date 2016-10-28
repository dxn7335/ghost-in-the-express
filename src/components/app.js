import React, { Component, PropTypes } from 'react';

const socket = io.connect();

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      command: false,
      speech: this.setSpeech(),
      ready: false,
    };
  }

  componentDidMount() {
    socket.on('command:set', this.setCommand.bind(this));
    socket.on('script:say', this.handleRecieveLine.bind(this));
    socket.on('script:ready', this.handleOnReady.bind(this));
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

  setCommand() {
    this.setState({command: true});
  }

  setSpeech() {
    var voices = window.speechSynthesis.getVoices();
    var msg = {
      voice: voices[Math.floor(Math.random() * (10 - 8 + 1) + 8)], // Note: some voices don't support altering params
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
      }, 600);
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
        </div>
      )
    } 

    return (
      <div>
      ...
      </div>
    )
  }

  render() {

    return ( 
      <div className="app">
        { this.renderContent(this.state.command) }
      </div>
    );
  }
}
