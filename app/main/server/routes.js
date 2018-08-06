const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const paths = require('path');
const generator = require('./../../Utilities/generators');
const db = require('../../database/dbMock');
const io = require('./../../main/index');

///////////////////////////////////////////////////////////////////////////
//                         serves game page								 //
///////////////////////////////////////////////////////////////////////////
app.use(express.static(paths.join(__dirname, '../../../public/')));

app.get('/game', function(req, res){ 
    res.sendFile(paths.join(__dirname, '../../../public/', 'index.html'));
});

app.get('/',function(req, res){
    res.sendFile(paths.join(__dirname, '../../../public/', 'login.html'));
});

app.get('/newUser', function(req, res){
    res.sendFile(paths.join(__dirname, '../../../public/', 'newUser.html'));
});


let counter = 0;
function count() {
    if(counter > 3) {
        counter = 0; 
        return 4
    } else {
        return counter++;
    }
}
app.get('/getUser', function(req, res){ 
    let user;
    let user2;
    user = generator.player(0)
    user1 = generator.player(1)
    
    db.savePlayers([user, user1]) //send as array because you're only producing 1 player right now
    res.status(200);
    res.json(user);
});

app.get('/generateBoard', function(req, res){

    var board = generator.generateBoard();

    db.saveGameboard(board)
    res.status(200);
    res.json(board);
});
/********************************************
**The date will look like                  **
** {'buildingType: 'road',                 **
**  'confirmation: True}                   **
*********************************************/
let jsonParser = bodyParser.json()
app.post('/confirmBuild', jsonParser, function(req, res) {
   
    let service = generator.gameboardService(db)
    let data = req.body;
    let result;
    if(data.buildingType === 'settlement') {
        
        result = service.setSettlementOwner(data.nodeId, data.playerId)
        console.log('settlement confirmation to build')
    } else if(data.buildingType === 'road' ) {
        console.log('road confirmation to build')
        result = service.setRoadOwner(data.nodeId, data.playerId)
    } else if(data.buildingType === 'city') {
        console.log('city confirmation to build')
    }
    
    if(result){
        
        res.status(200);
        res.json(true)
    } else {
        res.status(400)
        res.json(false)
    }
})

app.post('/endTurn', jsonParser, function(req, res) {
    
    var game = db.getGameObject();
    var playerService = generator.playerService(db);
    var turnService = generator.turnService(db, playerService);
    if(game.currentPlayersTurn === req.body.playerId) {
        let turnSuccess = turnService.nextTurn();
        if(turnSuccess) {
            let response = turnService.Save();
            io.socket.emit('nextTurn', {'nextActivePlayer': response.nextActivePlayer})
            console.log('current active player id ' + (db.getGameObject()).currentPlayersTurn)
        }
        res.status(200);
    } else {
        res.status(400);
    }
})

module.exports = app;