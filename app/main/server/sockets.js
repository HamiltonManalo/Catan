const validator = require('./../../Utilities/validators.js');
const db = require('../../database/dbMock')
// const io = require('../index').socket;
const generator = require('../../Utilities/generators');

module.exports = { start: function(io) {
    io.on('connection', function(socket){
    
    socket.emit('news',  true );

    socket.on('validateTurn', function(data){
        let Player = JSON.parse(data);
        if(Player.id === 0)
            socket.emit('validateTurnResponse',true);
            else 
            socket.emit('validateTurnResponse',false);
    }) 
    socket.on('canBuildBuilding', function(buildingId){
        let result = validator.validateBuilding(db.getGameboard(), buildingId);
        if(result) {
            socket.emit('canBuildBuildingResult', true)
        } else {
            socket.emit('canBuildBuildingResult', false)
        }
    })

    socket.on('canBuildRoad', function(roadId, playerId) {
        let result = validator.validateRoad(db.getGameboard(), roadId, playerId);
        if(result) {
            socket.emit('canBuildRoadResult', true)
        } else {
            socket.emit('canBuildRoadResult', false)
        }
    })
   socket.on('confirmBuilding', function(response) {
       if(response) {
           socket.emit('serverConfirm', true)
       }
   })
    
        //New events above this line \\
    });
}
}