import React, { Component, PropTypes } from 'react';

class Visuals extends Component {

  render() {
    const playClass = (this.props.playing) ? "playing" : "";
    return ( 
      <div className={"visual"}>
        <div class={"glyph", playClass}>
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
      </div>
    );
  }
}

export default Visuals;
