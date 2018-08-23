const _ = require('lodash');
class Knight {
    constructor() {
        this.text = `At any point during your turn you may move the placement of the robber. If it is placed on a resource tile
        owned by other players you may choose which player to rob and take a resource card at random from them`;
        this.quantity = 14;
        this.type = 'knight';
    }
}

class Monopoly{
    constructor() {
        this.text = `Choose a resource type and each player must give you all of the resource cards of that type they posses`;
        this.quantity = 2;
        this.type = 'monopoly';
    }
}

class RoadBuilding {
    constructor() {
        this.text = `You may place two roads at any legal location at no cost during your turn`;
        this.quantity = 2;
        this.type = 'roadBuilding';
    }
}

class YearOfPlenty {
    constructor() {
        this.text = `When you play this card select any 2 resource cards and place them into your hand. You may use them to immediately build or trade with`;
        this.quantity = 2;
        this.type = 'yearOfPlenty';
    }
}

class VictoryPoint {
    constructor() {
        this.text = `This card gives you 1 victory point. Keep this card out of other players view and turn it face up when it would give you the last point(s) you need to win`
        this.quantity = 5;
        this.type = 'victoryPoint';
    }
}

let config = {
    'knights': 14,
    'progressCards': 2,
    'victoryPoints':5
}


function createDeck(config) {
    let deck = [];
    for(let i = 0; i < config.maxCard; i++) {
        if(i < config.knights) {
            deck.push(new Knight())
            
        }
        if(i < config.victoryPoints) {
            deck.push(new VictoryPoint())
        }
        if(i < config.progressCards) {
            deck.push(new Monopoly());
            deck.push(new RoadBuilding());
            deck.push(new YearOfPlenty());
        }
    }
    return _.shuffle(deck);
}
/**
 * Feed it an object specifying the number of knights, development cards and victory points and it returns a formed DevCard deck. 
 * @param {object} new configuration
 */
module.exports.deck = createDeck;

module.exports.config = config;