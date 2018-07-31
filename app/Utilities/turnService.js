class turnService {
    constructor(DBFunc, playerService){
        this.DBFunc = DBFunc
    } 
        //DB Call to request gameObject
    game; //Holds gameObject
    
    
    nextTurn() { 
        for(let i = 0; i < playerArray.length; i++) {
            let lastPlayer = playerArray.length -1;
            //If last player, its weird
            if(playerArray[lastPlayer].activePlayer == true) {
                playerArray[0].activePlayer = true;
                playerArray[lastPlayer] = false; 
                break;

            } else if( playerArray[i].activePlayer == true) {
                playerArray[i].activePlayer = false;
                playerArray[i+1].activePlayer = true; 
                break;
            }
        }
    }

    awardResources(diceResult, TilesOwned) {
        for(let tileOwned in TilesOwned) {
            if(diceResult === tileOwned.chit.value) {

                let resource = tileOwned.resourceType;

                tileOwned.payTo.map(x => playerService.AddResource(x.resource, x.playerId))
            }
        }
    }

    CompleteTurn() {
        //Save to DB
    }
/*
Private Methods below
*/
   
}