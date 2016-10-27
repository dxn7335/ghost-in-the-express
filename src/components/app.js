import React, { Component, PropTypes } from 'react';
import Messages from './messages';

const socket = io.connect();

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }

  componentDidMount() {

  }

  render() {
    return ( 
      <div className="app">
        <Messages messages={this.state.messages}/>
      </div>
    );
  }
}
