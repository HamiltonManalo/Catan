class turnService {
    constructor(DBFunc, playerService){
        this.DBFunc = DBFunc;
        this.playerService = playerService;
        this.game = this.DBFunc.getGameObject();;
    } 
        //DB Call to request gameObject
     //Holds gameObject
     CheckIfPlayerCompletedPlacementTurn(playerId) {
        
        let playerObject = this.game.players.find(x => x.id === playerId);
        let placementCount = playerObject.settlements.length + playerObject.roads.length;
        return (placementCount === 2 || placementCount === 4)
    }

   
    nextTurn() { 
        
        let placementComplete = this.game.completedPlacement
        let playerArray = this.game.players;
        let lastPlayer = playerArray.length -1;
        let arrayLen = playerArray.length;
        //theoretically should never get hit because other validation will prevent it. 
        if(!placementComplete && this.CheckIfPlayerCompletedPlacementTurn(this.game.currentPlayersTurn)) 
            return true;
        
        if(placementComplete) {
     
            //If last player, its weird
            if( playerArray[lastPlayer].activePlayer == true) {
                playerArray[0].activePlayer = true;
                this.game.currentPlayersTurn = playerArray[0].activePlayer.id
                playerArray[lastPlayer] = false; 
                return true; //set gameObject avice player to new active player
            }  
            for(let i = 0; i < arrayLen; i++) {
                
                if( playerArray[i].activePlayer == true ) {
                    playerArray[i].activePlayer = false;
                    playerArray[i+1].activePlayer = true; 
                    this.game.currentPlayersTurn = playerArray[i+1].activePlayer.id
                    return true;
                }
            }
        } else {

            if(this.game.round === 1) {
                for(let i = 0; i < playerArray.length; i++) {
                    
                    if( playerArray[i].activePlayer == true ) {
                        playerArray[i].activePlayer = false;
                        playerArray[i+1].activePlayer = true; 
                        game.activePlayer = playerArray[i+1].activePlayer.id
                        return true;
                    }
                }
            } else if(this.game.round === 2){
                for(let i = (arrayLen-1); i > 0; i--) {
                    if( playerArray[i].activePlayer == true ) {
                        playerArray[i].activePlayer = false;
                        playerArray[i-1].activePlayer = true; 
                        game.activePlayer = playerArray[i-1].activePlayer.id
                        return true;
                }

            }
        }
    }
    }
    awardResources(diceResult, TilesOwned) {
        
        for(let tileOwned in TilesOwned) {
            if(diceResult === tileOwned.chit.value) {

                let resource = tileOwned.resourceType;

                tileOwned.payTo.map(x => this.playerService.AddResource(x.resource, x.playerId))
            }
        }
    }
    //this as well
    validatePlacementComplete() {
        let players = this.game.players;
        const placementRound1 = players.length * 2;
        const placementRound2 = placementRound1 * 2;
        let placementCount = players.map(x => x.settlements.length + x.roads.length);
        //get count of objects placed
        placementCount = placementCount.reduce((total, value) => total + value);
        return (placementCount % 2 === 0 && (placementCount == placementRound1 || placementCount ===placementRound2))
       
    }//May need to go in validation module. Probably.
    



    Save() {
        this.DBFunc.saveGameObject(this.game);
        let response = {
            'nextActivePlayer': this.game.currentPlayersTurn,
            'result': true
        }
        return response;
    }
/*
Private Methods below
*/
   
}

module.exports = turnService;