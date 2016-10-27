import React, { Component, PropTypes } from 'react';

class Messages extends Component {

  render() {
    const { messages } = this.props;
    return ( 
      <div className="messages">
        {
          messages.map( (message, i) => {
            return ( <p key={i}>{message}</p> );
          })
        }
      </div>
    );
  }
}

Messages.PropTypes = {
  messages: PropTypes.array
};

export default Messages;
