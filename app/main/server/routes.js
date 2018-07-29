const express = require("express");
const app = express();
const paths = require('path');
const gameBoard = require("../../game-logic/gameboard.js");
const Player = require('../../game-logic/player-cards.js');
const generator = require('./../../Utilities/generators');
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
    if(generator.returnPlayerArray.length < 5) {
        user = generator.player(count());
    } else {
        user = generator.returnPlayerArray[count()]
    }
    res.status(200);
    res.json(user);
});

app.get('/generateBoard', function(req, res){

    var board = gameBoard();
    res.status(200);
    res.json(board);
});

module.exports = app;