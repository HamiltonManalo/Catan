// const io = require('./../index.js');
const socketio = require('socket.io');
const validator = require('./../../Utilities/validators.js');
const gb = require('./../../game-logic/gameboard.js');
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
        socket.on('canBuildBuilding', function(buildingId){
            let result = validator.validatePlayerCanPlaceBuilding(gb.board, buildingId);
            if(result) {
                socket.emit('canBuildBuildingResult', true)
            } else {
                socket.emit('canBuildBuildingResult', false)
            }
        })

        socket.on('canBuildRoad', function(roadId, playerId) {
            let result = validator.validatePlayerCanPlaceRoad(gb, roadId, playerId);
            if(result) {
                socket.emit('canBuildRoadResult', true)
            } else {
                socket.emit('canBuildRoadResult', false)
            }
        })
            //New events above this line \\
    });
}