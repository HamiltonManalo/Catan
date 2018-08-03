const express = require("express");
const app = express();
const paths = require('path');
const gb = require("../../game-logic/gameboard.js");
const Player = require('../../game-logic/player-cards.js');
const generator = require('./../../Utilities/generators');
const DB = require('../../database/dbMock');
const bodyParser = require('body-parser')
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
   
        user = generator.player(0)
   
    DB.savePlayers([user]) //send as array because you're only producing 1 player right now
    res.status(200);
    res.json(user);
});

app.get('/generateBoard', function(req, res){

    var board = gb.generateBoard();

    gb.board = board;
    DB.saveGB(board)
    res.status(200);
    res.json(board);
});
/********************************************
**The date will look like                  **
** {'buildingType: 'road',                 **
**  'confirmation: True}                   **
*********************************************/
app.post('/confirmBuild', function(req, res) {
   
        console.log('called');
   
    res.status(200);
    res.send('I hear u')
})

module.exports = app;