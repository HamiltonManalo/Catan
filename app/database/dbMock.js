const gameClass = require('../game-logic/gameClass');

const userTable = [];

var gameTable = [new gameClass()];

function getGB() {
    return gameTable[0].board;
}

function saveGB(gb) {
    

    gameTable[0].board = gb;
}

function getPlayers() {
    return gameTable[0].players
}

function savePlayers(playerArray) {
    gameTable[0].players = playerArray;
}
module.exports.getGameboard = getGB
module.exports.saveGB = saveGB
module.exports.getPlayers = getPlayers
module.exports.savePlayers = savePlayers
