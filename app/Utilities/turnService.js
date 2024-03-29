class turnService {
    constructor(DBFunc, playerService, gameboardService, socket, fs, diceRoller, eventService){
        this.DBFunc = DBFunc;
        this.playerService = playerService;
        this.gbService = gameboardService;
        this.fs = fs;
        this.diceRoller = diceRoller;
        this.socket = socket;
        this.eventService = eventService;
    } 

    beginTurn() {
        let game = this.DBFunc.getGameObject();
        
        if(!game.completedPlacement)
            return console.log('no dice, complete placement first');
            
        let diceRoll = this.diceRoller();
        let dataUpdate = {
            roll1: diceRoll[0],
            roll2: diceRoll[1],
            nextActivePlayer: game.currentPlayersTurn
        }
        let rollTotal = diceRoll[0] + diceRoll[1];
        let tiles = [];
        if(rollTotal === 7) {
            //Need to implement 1/2 card (rounded down) discard. 
            onRolled7();
        } else {

            game.board.tiles.forEach(tile => {
                if (tile.chit != null && tile.chit.value === rollTotal && game.board.robber.location != tile.id)
                tiles.push(tile);
            })
            
            tiles.forEach(tile => {
                let buildingIds = tile.buildings; 
                
                buildingIds.forEach(buildingNodeId => {
                    let building = game.board.buildings[buildingNodeId];
                    if(building.owner != null) {
                        
                        this.playerService.addResource(tile.resourceType, building.owner);
                        
                        if(building.isCity)
                        this.playerService.addResource(tile.resourceType, building.owner);
                    }
                })
            })
        }
        
        this.SaveState(game)
        game = this.DBFunc.getGameObject();
        dataUpdate.players = game.players;
        this.socket.emit('nextTurn', dataUpdate);
    }

    /**
     * Returns a boolean on other it was able to move to the next players turn. 
     * Boolean is generally used for placement round checking or if an error completing turn is thrown
     */   
    endTurn() { 
        let game = this.DBFunc.getGameObject();
        let placementComplete = game.completedPlacement;
        let playerArray = game.players;
        let lastPlayer = playerArray.length -1;
        let arrayLen = playerArray.length;
        let player = game.currentPlayersTurn;
        
        
        if(placementComplete) {
     
            //If last player, its weird
            if( playerArray[lastPlayer].activePlayer == true) {
                playerArray[0].activePlayer = true;
                playerArray[lastPlayer].activePlayer = false; 
                game.currentPlayersTurn = playerArray[lastPlayer - 1].id;
                game.turn ++;
                
                return this.Save(game); //set gameObject avice player to new active player
            }  
            for(let i = 0; i < arrayLen; i++) {
                
                if( playerArray[i].activePlayer == true ) {
                    playerArray[i].activePlayer = false;
                    playerArray[i+1].activePlayer = true; 
                    game.currentPlayersTurn = playerArray[i+1].id;
                    game.turn ++;
                    
                    return this.Save(game);
                }
            }
        } else {
            let completedTurnPlacement = this.CheckIfPlayerCompletedPlacementTurn(player);
            if(!completedTurnPlacement)
                return false;
            if(game.round === 1) {
                let lastPlayer = playerArray[playerArray.length-1]

                for(let i = 0; i < playerArray.length; i++) {

                    if( playerArray[i].activePlayer == true ) {
                        if(!playerArray[i+1]) {
                           game.turn ++;
                            
                            return this.Save(game);
                        }
                        playerArray[i].activePlayer = false;
                        playerArray[i+1].activePlayer = true; 
                        game.currentPlayersTurn = playerArray[i+1].id;
                        game.turn ++;
                        
                        return this.Save(game);
                    }
                }
            } else if(game.round === 2){
                

                for(let i = (arrayLen-1); i >= 0; i--) {
                    if( playerArray[i].activePlayer == true ) {
                        if(!playerArray[i-1]){
                            this.SaveState()
                            game.completedPlacement = true;
                            game.turn ++;
                            this.AwardStartingResources(game);
                            return this.Save(game);
                        }

                        playerArray[i].activePlayer = false;
                        playerArray[i-1].activePlayer = true; 
                        game.currentPlayersTurn = playerArray[i-1].id;
                        game.turn ++;
                        return this.Save(game);
                    }
                }
            }
        }
        return { 'result': false };
    }
/* Data looks like
    
        [0, 1, 3]
    
    as the Ids of players who must discard
    */
    onRolled7() {
        let idsMustDiscard = [];
        let players = DBFunc.getPlayers();
        let discardLots = [];
        let dataObject = [];
        players.forEach(player => {
            let cardsHeld = eventService.CountHand(player.resources);
            if(cardsHeld > 7)
            idsMustDiscard.push(player.id);
        })
        let playersThatMustdiscard = players.filter(player => idsMustDiscard.includes(player.id));
        playersThatMustdiscard.forEach(player => {

            let resourcesInHand = player.resources;
            let numToDiscard = Math.floor(eventService.countHand(resourcesInHand)/2);
            let discardObject = {
                playerStealing: player.id,
                hand: []
            }//Creates a mock hand from only valid data. Filtering here so
             //It can be returned directly from route 
             let cardNumber = 0;
            for(let propName in resourcesInHand) {
                if(resourcesInHand[propName] > 0){
    
                    let card = {
                        type: propName,
                        cardId: `card${cardNumber}`,
                        numberToDiscard: this.numberToDiscard
                    }
                    dataObject.push(card);
                    cardNumber++;
                }
            }
        })
        this.socket.io.emit('moveRobberEvent', dataObject)
        game.robberEvent.active = true;
        game.robberEvent.playerId = game.currentPlayersTurn;
    }

    SaveState(game) {
        let gf =  JSON.stringify(game) != null ? JSON.stringify(game) : '{}';
        if(gf.length < 10) 
            return
        this.fs.writeFileSync('gbstate.json',gf, {'flag': 'w+'}, function(err) {
            if(err) {
                console.log('error')
            } else  {
                console.log('file written')
            }})
    }
    /**
     * This may need to be reworked to accept an array of settlements and iterate over them to pay the owning player.
     * @param {number} diceResult 
     * @param {arrayOfOwnedTiles} TilesOwned 
     */
    AwardStartingResources(game) { 
        game.players.forEach(player => {
            let tiles = [];
            let building =  this.gbService.getBuildingNode(player.settlements[1])
            building.resources.map(rId => tiles.push(this.gbService.getTileNode(rId)))
            tiles.map(tile => this.playerService.addResource(tile.resourceType, player.id))
        });
    }

    CheckIfPlayerCompletedPlacementTurn(playerId) {
        let game = this.DBFunc.getGameObject();
        let playerObject = game.players.find(x => x.id === playerId);
        let placementCount = playerObject.settlements.length + playerObject.roads.length;
        return ((placementCount === 2 && game.round === 1) || (placementCount === 4 && game.round === 2))
    }

    /**
     * saves current state of the game. Only for use within the turnService class
     */
    Save(game) {
        this.DBFunc.saveGameObject(game);
        let response = {
            'nextActivePlayer': game.players.find(player => player.id === game.currentPlayersTurn),
            'result': true
        };
        return response;
    }

  

/*
*Private Methods below
*/
   
}

module.exports = turnService;