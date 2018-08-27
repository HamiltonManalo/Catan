var generator = require('./../Utilities/generators');
/*
    PLAYER Constructor
    ------------------------------------------------------
*/
function Player(playerID, uuid) {
  this.guid = uuid;
  this.id = playerID;
  this.isTurn = false;
  this.score = 0;
  this.placementOrder = null;
  this.settlements = [];
  this.roads = [];
  this.cities = [];
  // Player resource hand
  this.resources = {
      sheep: 1,
      wheat: 1,
      wood: 1,
      ore: 1,
      brick: 1,      
  };

};

module.exports = Player;