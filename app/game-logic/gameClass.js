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
        this.developmentCardDeck = [];
        this.robberEvent = {
            phase: 1,
            eventOwnerId: 0,
            active: true,
            targets: null,
            //Stores state about the hand being passed for validation.
            hand:  [ 
                {type: 'wood', id: 'card0'},
                {type: 'ore', id: 'card1'}
              ]
        }
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