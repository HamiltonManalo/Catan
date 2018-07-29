const Player = require('./../game-logic/player-cards')
// This file will contain the logic that generates new things, IE Players and gameboards. 

const State = {
  players: [],
  gameBoards: [],
  currentCount: 0
}
let uuid = function(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function player(newId) {
  let player = new Player(newId, uuid());
  State.players.push(player);
  return player;
}
exports.player = player
//Generating Yeets all over the server
exports.uuid = uuid 
      
exports.returnPlayerArray = () => State.players;