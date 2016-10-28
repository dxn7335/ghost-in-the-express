import React, { Component, PropTypes } from 'react';

class Input extends Component {

  handleSubmit(callback) {
    callback(this.refs.input.value);
    this.refs.input.value = "";
  }

  render() {
    const { onSubmit } = this.props;
    return ( 
      <div className="input">
        <input ref='input' type="text" maxLength="40" />
        <button onClick={() => this.handleSubmit(onSubmit)}>Submit</button>
      </div>
    );
  }
}

Input.PropTypes = {
  onSubmit: PropTypes.func
};

export default Input;
