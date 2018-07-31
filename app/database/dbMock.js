const generator = require('./../Utilities/generators');
const gameTable = [];

const userTable = [];

class game {
    constructor(gameBoard, playerArray)
    {
        this.id = new generator.uuid();
        this.gameBoard;
        this.playerArray;
    }
}

function getGB() {
    return gameTable[0];
}

module.exports = {
    //Mock DB logic here
    getGameboard: getGB,
}