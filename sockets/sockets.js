// export function for listening to the socket
module.exports = function (socket) {
  
  const name = Math.random();
  console.log(name, 'joined');
  // send the new user their name and a list of users
  socket.emit('init', function(socket) {
    console.log(name, 'joined');
    return {
      name: name,
    };
  });

  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    name: name
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (msg) {
    socket.broadcast.emit('message:new', {
      user: name,
      text: msg
    });
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    console.log(name, 'left');
    socket.broadcast.emit('user:left', {
      name: name
    });
  });
};