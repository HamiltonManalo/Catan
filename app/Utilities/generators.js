const Player = require('./../game-logic/player-cards')
const playerService = require('./playerService');
const gb = require('./../game-logic/gameboard');
const DB = require('../database/dbMock');
const gameboardService = require('./gameBoardService');
const turnService = require('./turnService');
// This file will contain the logic that generates new things, IE Players and gameboards. 


function uuid(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function player(newId) {
  return new Player(newId, uuid());
}

function gbService(DbFunc) {
  return new gameboardService(DbFunc);
}

function returnTurnService(Db, PlayerService) {
  return new turnService(Db, PlayerService);
}

function returnPlayerService(Db) {
  return new playerService(Db);
}
// function validator()
function generateBoard() { 
  return gb.generateBoard();
}
//Generating Yeets all over the server
module.exports.uuid = uuid; 
module.exports.player = player
module.exports.gameboardService = gbService;
module.exports.turnService = returnTurnService;
module.exports.generateBoard = generateBoard;
module.exports.playerService = returnPlayerService;