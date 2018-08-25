const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const paths = require('path');
const generator = require('./../../Utilities/generators');
const db = require('../../database/dbMock');
const state = require('../../../gbstate.json');
const validator = require('./../../game-logic/validators');
const sockets = require('../index')
const debug = require('./../../Utilities/debug');
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

app.get('/getUser', function(req, res){ 
    let existingUsers = db.getPlayers();
    if(!existingUsers[0]) {

        let user;
        let user1;
        
        user = generator.player(0);
        user1 = generator.player(1);
        user.activePlayer = true;
        db.savePlayers([user, user1]);//send as array because you're only producing 1 player right now
        res.status(200);
        res.json([user, user1]);
    } else {
        res.status(200);
        res.json(existingUsers);
    }
    });

app.get('/generateBoard', function(req, res){
   
    // var board = generator.generateBoard();
    // db.saveGameboard(board);
    // res.status(200);
    // res.json(db.getGameObject());
    let gameState = debug.makeState(state);
    db.saveGameObject(gameState);
    res.status(200);
    res.json(gameState);
});
/********************************************
**The data will look like                  **
** {'buildingType: 'road',                 **
**  'confirmation: True}                   **
*********************************************/
let jsonParser = bodyParser.json();
app.post('/confirmBuild', jsonParser, function(req, res) {
   
    let service = generator.gameboardService();
    let data = req.body;
    let result;
    //Needs build validation here too so players cant just call API end points to avoid validation in sockets
    if(data.buildingType === 'settlement') {
        
        result = service.setSettlementOwner(data.nodeId, data.playerId);
        console.log('settlement confirmation to build');
    } else if(data.buildingType === 'road' ) {
        console.log('road confirmation to build');
        result = service.setRoadOwner(data.nodeId, data.playerId);
    } else if(data.buildingType === 'city') {
        console.log('city confirmation to build');
        result = service.upgradeSettlement(data.nodeId, data.playerId);
    } else if(data.buildingType === 'devCard') {
        console.log('dev cards dont exist yet');
    }

    //Need to send out socket emit to update rest of players with new data after successful action
    let updatedGameObject = db.getGameObject();
    if(result){
        res.status(200);
        res.json(updatedGameObject);
        
    } else {
        res.status(400);
        res.json(false);
    }
});

app.post('/endTurn', jsonParser, function(req, res) {
    let game = db.getGameObject();
    if(game == null || game.players.length == 0)
        return;

    let turnService = generator.turnService();
    if(game.currentPlayersTurn === req.body.playerId) {
        let turnResult = turnService.endTurn();
        if(!turnResult.result) {
            res.sendStatus(400);
            return
        }
        game = db.getGameObject();
        turnResult = game;
        delete turnResult.result;
        res.send(turnResult);
        turnService.beginTurn();
    }
});

app.get('/roll', jsonParser, function(req, res) { 

})

module.exports = app;