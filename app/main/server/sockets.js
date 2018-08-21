const validator = require('./../../Utilities/validators.js');
const db = require('../../database/dbMock');
// const io = require('../index').socket;
const generator = require('../../Utilities/generators');

module.exports = {
  start: function (io) {
    io.on('connection', function (socket) {
      this.io = socket;
      socket.emit('test', {true: true});
      socket.on('validatePlaceAction', function (data) {

        let turnResult;
        let canPlaceResult;
        let gameObject = db.getGameObject();
        if(gameObject == null || gameObject.players.length == 0)
            return
        gameObject.socketId = socket.id;
        db.saveGameObject(gameObject);
        if (data.playerId === gameObject.currentPlayersTurn) //needs player validation logic
            turnResult = true;
        else 
            turnResult = false;
        
        if(data.buildingType === 'settlement') {
            canPlaceResult = validator.validateBuilding(gameObject, data.nodeId, data.playerId);
        } else if(data.buildingType === 'road') {
            canPlaceResult = validator.validateRoad(gameObject, data.nodeId, data.playerId);
        } else if(data.buildingType === 'city') {
            //do other stuff
        }

        if(canPlaceResult && turnResult) {
            socket.emit('placeActionResult', {'results': true, 'data': data});
        }
        else {
            socket.emit('placeActionResult', false);
            console.log('cant build ' + data.buildingType);
        }
      });

        
      // New events above this line \\
    }.bind(this));
},
io: null
};
