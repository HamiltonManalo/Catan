const gameClass = require('../game-logic/gameClass');


const userTable = [];

function uuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
var gameTable = [new gameClass(uuid())];

/* 
*
*GAMEBOARD
*
*/

function getGameboard() {
    return gameTable[0].board;
}

function saveGameboard(gb) {
    

    gameTable[0].board = gb;
}
/* 
*
*PLAYER
*
*/
function getPlayers() {
    return gameTable[0].players
}

function savePlayers(playerArray) {
    gameTable[0].players = playerArray;
}

/* 
*
*GAME OBJECT
*
*/

function getGameObject() {
    return gameTable[0];
}

function saveGameObject(game) {
    gameTable[0] = game;
}
module.exports.getGameboard = getGameboard
module.exports.saveGameboard = saveGameboard
module.exports.getPlayers = getPlayers
module.exports.savePlayers = savePlayers
module.exports.saveGameObject = saveGameObject
module.exports.getGameObject = getGameObject
