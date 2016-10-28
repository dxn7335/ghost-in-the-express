import React, { Component, PropTypes } from 'react';
import Messages from './messages';
import Input from './input';

const socket = io.connect();

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      command: false,
      speech: this.setSpeech()
    };
  }

  componentDidMount() {
    socket.on('message:new', this.handleRecieveMessage.bind(this));
    socket.on('command:set', this.setCommand.bind(this));

    this.speak("I'm ready, bitch");
  }

  handleRecieveMessage(message) {
    const { messages } = this.state;
    messages.push(message);
    this.setState(messages);
  }

  handleSendMessage(message) {
    socket.emit('send:message', message);
  }

  setCommand() {
    this.setState({command: true});
  }

  setSpeech() {
    var voices = window.speechSynthesis.getVoices();
    var msg = {
      voice: voices[10], // Note: some voices don't support altering params
      voiceURI: 'native',
      volume: 1, // 0 to 1
      rate: 1.3, // 0.1 to 10
      pitch: Math.random() * (2 + 0), //0 to 2
      lang: 'en-US'
    };

    return msg;
  }

  speak(message) {
    var speechSpec = this.state.speech;
    var msg = new SpeechSynthesisUtterance();
    msg = Object.assign( msg, 
      {
        text: message,
        rate: speechSpec.rate,
        pitch: speechSpec.pitch
      }
    );

    msg.onend = function(e) {
      console.log('Finished in ' + event.elapsedTime + ' seconds.');
    };

    console.log(msg);
    window.speechSynthesis.speak(msg);
  }

  render() {

    return ( 
      <div className="app">
        <Input onSubmit={(msg) => this.handleSendMessage(msg)} />
        <Messages messages={this.state.messages}/>
      </div>
    );
  }
}
