'use strict';

var Scripts = require('./scripts.js');
var _ = require('lodash');

function Scene() {
  this.participants = [];
  this.scripts = Object.assign({}, Scripts);
  this.mode = "normal";
  this.scenario = this.setScenario();
}

var s = Scene.prototype;

s.addParticipant = function(socket) {
  this.participants.push(
    {
      socket: socket.id
    }
  );
};

s.getParticipant = function(socket) {
  const p = _.find(this.participants, {socket: socket.id});
  return p;
};

s.removeParticipant = function(socket) {
  const p = this.participants;
  for ( let i=0; i<p.length; i++ ) {
    if (p.socket === socket.id) {
      p.splice(i, 1);
    }
  }
  console.log('removed', p);
}

s.setScenario = function() {
  const mode = this.mode;

  let index = Math.floor(Math.random()* (this.scripts[mode].length));

  if ( this.scenario ) {
    while ( this.scenario.scriptIndex === index ) {
      index = Math.floor(Math.random()* (this.scripts[mode].length));
    }
  }

  return {
    scriptIndex: index,
    line: null
  };
}

s.endOfScript = function() {
  var line = this.scenario.line,
      scriptIndex = this.scenario.scriptIndex,
      mode = this.mode;

  return ((line + 1) === this.scripts[ mode ][ scriptIndex ].length);
}

s.getScriptLine =  function() {

  if ( this.endOfScript() ) {
    console.log('end');
    this.scenario = this.setScenario();
  }

  var line = this.scenario.line,
      scriptIndex = this.scenario.scriptIndex,
      mode = this.mode;

  line = (line === null) ? 0 : (line + 1);
  
  this.scenario.line = line;
  console.log('current line', this.scenario.line);
  return (this.scripts[ mode ][ scriptIndex ][line]);
}

module.exports = Scene;