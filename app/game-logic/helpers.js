var gameBoard = require('./gameboard.js');
exports.r = function rp(id) {
  let path = gameBoard.roads['road' + id]
  return path;
  // console.log('rp called')
}

exports.b = function bp(id) { 
  let path = gameBoard.buildings['b' + id];
  return path
}

exports.t = function tp(id) { 
    let path = gameBoard.tiles['tile' + id];
    return path;
  };