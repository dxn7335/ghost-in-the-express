'use strict';

var scripts = require('./scripts.js');
var _ = require('lodash');

function Scene() {
  this.participants = [];
  this.script = Object.assign({}, scripts);
  this.mode = "normal";
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

module.exports = Scene;