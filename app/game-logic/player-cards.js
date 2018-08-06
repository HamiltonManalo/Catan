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
  // Sets second building state which will create payout for turn0
  this.secondBuilding = null;
  // Player resource hand
  this.resources = {
      sheep: 0,
      wheat: 0,
      wood: 0,
      ore: 0,
      brick: 0,      
  };

};

module.exports = Player;