const validator = require('./../../Utilities/validators.js')
const db = require('../../database/dbMock')
// const io = require('../index').socket;
const generator = require('../../Utilities/generators')

module.exports = {
  start: function (io) {
    io.on('connection', function (socket) {
      
      socket.on('validatePlaceAction', function (data) {

        let turnResult
        let canPlaceResult
        
        

        if (data.playerId === 0) //needs player validation logic
            turnResult = true
        else 
            turnResult = false
        let gb = db.getGameObject();
        if(data.buildingType === 'settlement') {
            canPlaceResult = validator.validateBuilding(gb, data.nodeId, data.playerId);
        } else if(data.buildingType === 'road') {
            canPlaceResult = true 
        } else if(data.buildingType === 'city') {
            //do other stuff
        }

        if(canPlaceResult && turnResult) {
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
