const express = require("express");
const app = express();
const paths = require('path');
const gameBoard = require("../../game-logic/gameboard.js");
// serves game page								//

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

app.get('/generateBoard', function(req, res){
    
    
    var board = gameBoard();
    console.log("ITS BEEN CALLED");
    console.log(board);
    res.status(200);
    res.json(board);
});

module.exports = app;