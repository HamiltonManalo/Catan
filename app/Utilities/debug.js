const gameClass = require('../game-logic/gameClass')
const socket = require('./../main/server/sockets')



function consumeJsonState(Json) {
    let io = socket.io;

    io.emit('consuming', 'consuming json')
    let state;
    let gameState;
    try{

        state = JSON.parse(Json);
    } catch (Exception) {
        state = Json;
    }
    gameState = new gameClass('holderUuid');
    gameState = _flatten(state, gameState);
    return gameState;
}

function _flatten(nestedObject, newState) {
    for(let value in nestedObject) {
        
            newState[value] = nestedObject[value];
       
    }
    return newState;
}

exports.makeState = consumeJsonState;