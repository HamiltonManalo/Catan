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
        let gb = db.getGameboard();
        if(data.buildingType === 'settlement') {
            placementResult = validator.validateBuilding(gb, buildingNodeId, playerId);
        } else if(data.buildingType === 'road') {
            placementResult = true 
        } else if(data.buildingType === 'city') {
            //do other stuff
        }

        if(placementResult && turnResult) {
            socket.emit('placeActionResult', {'results': true, 'data': data})
        }
        else
            socket.emit('placeActionResult', false)
            console.log('cant build ' + data.buildingType)
      })

      // New events above this line \\
    })
  }
}
