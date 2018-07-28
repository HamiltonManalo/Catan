const express = require("express");
const app = express();
const paths = require('path');
const gameBoard = require("../../game-logic/gameboard.js");
const Player = require('../../game-logic/player-cards.js');
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
    let user = new Player(1);
    console.log(user);
    res.status(200);
    res.json(user);
});

app.get('/generateBoard', function(req, res){

    var board = gameBoard();
    res.status(200);
    res.json(board);
});

module.exports = app;