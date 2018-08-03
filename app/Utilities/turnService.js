

class turnService {
    constructor(DBFunc){
        this.DBFunc = DB;
        this.game;
    } 
        //DB Call to request gameObject
     //Holds gameObject
    
    getBoard() {
        this.game = DBFunc.getGB();
    }
    nextTurn() { 
        let lastPlayer = playerArray.length -1;
        //If last player, its weird
        if(playerArray[lastPlayer].activePlayer == true) {
            playerArray[0].activePlayer = true;
            playerArray[lastPlayer] = false; 
            return;
        }  
        for(let i = 0; i < playerArray.length; i++) {
           
            if( playerArray[i].activePlayer == true ) {
                playerArray[i].activePlayer = false;
                playerArray[i+1].activePlayer = true; 
                break;
            }
        }
    }

    awardResources(diceResult, TilesOwned) {
        let serviceInstance = new playerService(DB);
        for(let tileOwned in TilesOwned) {
            if(diceResult === tileOwned.chit.value) {

                let resource = tileOwned.resourceType;

                tileOwned.payTo.map(x => serviceInstance.AddResource(x.resource, x.playerId))
            }
        }
    }

    CompleteTurn() {
        DBFunc.saveGB(game);
    }
/*
Private Methods below
*/
   
}
