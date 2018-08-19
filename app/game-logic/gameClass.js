class Game {
    constructor(uuid) {
        
        this.id = uuid;
        this.board = {};
        this.players = [];
        this.completedPlacement = false;
        this.turn = 1;
        this._currentPlayersTurn = 0;
        this.buildingsOwned = [];
        this.socketId = '';
    }
        get round() {
            return Math.ceil(this.turn/this.players.length)
        }
        set currentPlayersTurn(val) {
            this._currentPlayersTurn = val;
            
        }
        get currentPlayersTurn() {
            return this._currentPlayersTurn;
        }
}

module.exports = Game; 