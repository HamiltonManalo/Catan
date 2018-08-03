const validator = require('./../../Utilities/validators.js')
const db = require('../../database/dbMock')
// const io = require('../index').socket;
const generator = require('../../Utilities/generators')

module.exports = {
  start: function (io) {
    io.on('connection', function (socket) {
      
      socket.on('validatePlaceAction', function (data) {
        let turnResult
        let placementResult
        

        if (data.playerId === 0) //needs player validation logic
            turnResult = true
        else 
            turnResult = false

        if(data.buildingType === 'settlement') {
            placementResult = true //canPlaceSettlement(db.getGameboard(), data.nodeId, data.playerId )
        } else if(data.buildingType === 'road') {
            //do stuff
        } else if(data.buildingType === 'city') {
            //do other stuff
        }

        if(placementResult && turnResult) 
            socket.emit('placeActionResult', true)
        else
            socket.emit('placeActionResult', false)
      })

      // New events above this line \\
    })
  }
}

function canPlaceSettlement(playerId, buildingNodeId, playerId) {
    return validator.validateBuilding(db.getGameboard(), buildingNodeId, playerId);
}