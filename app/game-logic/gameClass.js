class Game {
    constructor(uuid) {
        
        this.id = uuid;
        this.board;
        this.players;
        // this.currentPlayersTurn = null;
        this.completedPlacement = false;
        this.turn = 0;
        this.currentPlayersTurn = 0;
        this.buildingsOwned = [];
    }
            get round() {
                return Math.ceil(this.turn/this.players.length)
            }
           
   
}

module.exports = Game; 