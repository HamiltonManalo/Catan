const generator = require('./../Utilities/generators');
class Game {
    constructor() {
        this.id = generator.uuid;
        this.board;
        this.players;
        this.completedPlacement = false;
    }
   
}

module.exports = Game; 