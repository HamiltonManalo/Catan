const Player = require('./../game-logic/player-cards')
const playerService = require('./playerService');
const gameboardService = require('./gameBoardService');
const DB = require('../database/dbMock');
const turnServer = require('../Utilities/turnService');
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

//Generating Yeets all over the server
exports.uuid = uuid; 
exports.player = player
exports.gameboardService = gbService(DB);
