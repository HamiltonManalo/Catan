const socket = require('./../main/server/sockets');
let io = socket.io;
io.emit('test');

io.on('debug', function(socket){
    console.log('test')
})