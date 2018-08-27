class EventService {
    constructor(DB, socket, playerService, gbService) {
        this.DB = DB;
        this.socket = socket;
        this.playerService = playerService;
        this.gameObject = this.DB.getGameObject(); 
        this.gbService = gbService;
    }
    //First event that starts the robber sequence
    StartRobberEvent(playerId) {
        
        let event = {
            eventOwnerId: playerId,
            active: true,
            phase: 1
        }
        this.gameObject.robberEvent = event;
        //Triggers popup on players screen where they choose where to place robber
        //Need to add onclick events to each tile to receive input
        this.socket.emit('robberEvent', event)
        this.DB.saveGameObject(this.gameObject);
    }
    
    RobberPlacedEvent(tileNodeId) {
        let adjacentBuildings = this.gameObject.board.tiles[tileNodeId].buildings
        let buildings = this.gameObject.board.buildings;
        let playerId = this.gameObject.robberEvent.playerId;
        let playersToRob = [];
        let buildingsOwned = adjacentBuildings.filter(buildingId => {
            if(buildings[buildingId].owner && buildings[buildingId].owner != playerId)
                return true;
        })//initiates the UI sequence to steal from another player
        //If no buildings are owner, end robber event. 
        if(!buildingsOwned[0]) {
            this.gameObject.robberEvent = {
                phase: null,
                eventOwnerId: null,
                active: false,
                targets: null,
                hand: null
            };
            return null
        }

        //Get list of players to rob based off of the building ids. Return
        //the number of cards in their hand so they can be displayed on 
        //the selection screen
        let owners = [];
        buildingsOwned.forEach(building => {
            if(!playerIdsToRos.includes(building.owner))
                owners.push(building.owner)
        })
        //If there is only 1 person to rob, do not perform multi-option logic
        //Also, add in an edge case for if that player has nothing to rob
        if(owners.length === 1) {
            let sumOfCards = this.CountHand(owners[0]);
            playersToRob.push( { id: owners[0].id, numberOfCards: sumOfCards } )
        } else {
        owners.forEach(player => {
            let sumOfCards = this.CountHand(player.resources);
               
            if(sumOfCards > 0)
                playersToRob.push( { id: player.id, numberOfCards: sumOfCards } )
            })
        }
        /*data should look like
        [{
            id: 1,
            numberOfCards: 3
        }]
        */
        this.gameObject.robberEvent.phase = 2;
        this.gameObject.robberEvent.targets = playersToRob;
        this.DB.saveGameObject(this.gameObject);
        socket.emit('robberEventSteal', playersToRob)
        return playersToRob;
    }

    CountHand(resourceHand) {
        let sumOfCards
        for(let property in resourceHand) {
            sumOfCards += resourceHand[property];
        }
        return sumOfCards;
    }
    StealFromHand(playerStealingId, playerToStealFromId) {
        let resourcesInHand = this.gameObject.players.find(player => player.id === playerToStealFromId).resources;
        
        let dataObject = {
            playerStealing: playerStealingId,
            hand: []
        }//Creates a mock hand from only valid data. Filtering here so
         //It can be returned directly from route 
         let cardNumber = 0;
        for(let propName in resourcesInHand) {
            if(resourcesInHand[propName] > 0){

                let card = {
                    type: propName,
                    cardId: `card${cardNumber}`
                }
                dataObject.hand.push(card);
                cardNumber++;
            }
        }
        this.gameObject.robberEvent.phase = 3;
        this.gameObject.robberEvent.hand = dataObject.hand;
        this.DB.saveGameObject(this.gameObject);
        
        return dataObject; 
    }
//card represent the resource card in players hand. type is the resource type 
//represented by that card. Cards are handled by cardId client side to
//avoid snooping for values

    RobCard(playerStealing, playerStolenFrom, cardId) {
        let card = this.gameObject.robberEvent.hand.find(card => card.cardId === cardId);
        this.playerService.addResource(card.type, playerStealing);
        this.playerService.removeResource(card.type, playerStolenFrom);
        this.gameObject.robberEvent = {
            phase: null,
            eventOwnerId: null,
            active: false,
            targets: null,
            hand: null
        };
        this.DB.saveGameObject(this.gameObject);
    }
}

module.exports = EventService; 