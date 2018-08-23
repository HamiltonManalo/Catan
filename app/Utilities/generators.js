const Player = require('./../game-logic/player-cards')
const playerService = require('./playerService');
const gb = require('./../game-logic/gameboard');
const DB = require('../database/dbMock');
const gameboardService = require('./gameBoardService');
const turnService = require('./turnService');
const fs = require('fs');
const diceRoller = require('./../game-logic/diceRolling');
const socket = require('./../main/server/sockets');
const deckBuilder = require('../game-logic/devCards');
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

function returnGameboardService() {
  let playerService = returnPlayerService(DB);
  return new gameboardService(DB, playerService);
}


function returnTurnService() {
  let tempPs = returnPlayerService();
  let tempGbs = returnGameboardService();
  return new turnService(DB, tempPs, tempGbs, socket, fs, diceRoller);
}

function returnPlayerService() {
  return new playerService(DB);
}
// function validator()
function generateBoard() { 
  return gb.generateBoard();
}

function returnDevCardDeck() {
  let config = deckBuilder.config;
  return new deckBuilder.deck(config);
  
}

//Generating Yeets all over the server
module.exports.uuid = uuid; 
module.exports.player = player
/**
 * returns new gameboard service instance 
 */
module.exports.gameboardService = returnGameboardService;
/**
 * returns new turn service instance
 */
module.exports.turnService = returnTurnService;
module.exports.generateBoard = generateBoard;
/**
 * returns new player service instance
 */
module.exports.playerService = returnPlayerService;

module.exports.deck = returnDevCardDeck;