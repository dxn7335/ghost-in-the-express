'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
//var socket = require('./sockets/sockets.js');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

/* Configuration */
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('port', 3000);

/**  ------------------
 *  SCENE SETUP
 */
var Scene = require('./sockets/scene.js');
var $scene = new Scene();

/* 
 *  Socket.io Communication 
 */
io.sockets.on('connection', function (socket) {

  $scene.addParticipant(socket);

  if ( $scene.participants.length === 1 ) {
    io.to(socket.id).emit('command:set', {command: true});
  }

  if ( $scene.participants.length > 2 ) {
    let participant = $scene.participants[0].socket;
    io.to(participant).emit('script:ready', {ready: true});
  }

  socket.on('script:start', function(socket) {
    // start conversation
    let line = $scene.getScriptLine();
    let participant = $scene.participants[line.id].socket;
    console.log(line.text, participant);
    // send line to correct person
    io.to(participant).emit('script:say', {text:line.text});
  });

  /**
   *  finish line
   */
  socket.on('script:finishsay', function(socket) {
    console.log("next line");
    // start conversation
    let line = $scene.getScriptLine();
    let participant = $scene.participants[line.id].socket;
    console.log(line.text, participant);
    if (line.playvideo) {
      io.to(participant).emit('video:play', {video: true});
    }
    // send line to correct person
    io.to(participant).emit('script:say', {text:line.text});
  });

  socket.on('mode:kids', function(flag) {
    $scene.switchMode('kids');
    socket.broadcast.emit('mode:switch', {flag: true});
  })

  socket.on('mode:normal', function(flag) {
    $scene.switchMode('normal');
    socket.broadcast.emit('mode:switch', {flag: false});
  })

  /**
   *  disconnect
   */
  socket.on('disconnect', function (socket) {
    $scene.removeParticipant(socket);

    if ($scene.participants.length < 3) {
      io.to(participant).emit('script:ready', {ready: false});
    }
  });

}); 


/**  ------------------
 *  start server
 */
server.listen(app.get('port'), function (){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;