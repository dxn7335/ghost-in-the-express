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

if (process.env.NODE_ENV === 'development') {
  var webpack = require('webpack');
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var config = require('./webpack.config');
  var compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(__dirname + 'webpack-dev-middleware/client?dynamicPublicPath=true'));
}

app.use(express.static(__dirname + '/public'));
app.set('port', 3000);

/*
 *  SCENE SETUP
 */
var Scene = require('./sockets/scene.js');
var $scene = new Scene();

/* 
 *  Socket.io Communication 
 */
io.sockets.on('connection', function (socket) {

  $scene.addParticipant(socket);
  console.log($scene.participants.length);
  if ( $scene.participants.length < 2 ) {
    io.to(socket.id).emit('command:set', {command: true});
  }
  else {
    socket.broadcast.emit('conversation:start', {script: "lines"});
  }

  // broadcast a user's message to other users
  socket.on('send:message', function (msg) {
    socket.broadcast.emit('message:new', {
      user: socket.id,
      text: msg
    });
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function (socket) {
    $scene.removeParticipant(socket);
  });

});


// start
server.listen(app.get('port'), function (){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;