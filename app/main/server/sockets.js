// const io = require('./../index.js');
const socketio = require('socket.io');

module.exports.listen = function(app) {
    io = socketio.listen(app);

    io.on('connection', function(socket){
        socket.emit('news',  true );

        socket.on('validateTurn', function(data){
            let Player = JSON.parse(data);
            if(Player.id === 1)
                socket.emit('validateTurnResponse',true);
                else 
                socket.emit('validateTurnResponse',false);
    
        }) 

    });
    
   
}