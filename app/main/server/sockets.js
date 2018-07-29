const io = require('./../index.js');

io.on('connection', function(socket){
    io.emit('news', { hello: 'world' });
});

module.exports = io;