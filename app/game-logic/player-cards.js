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
  this.settlements = null;
  this.roads = null;
  this.cities = null;
  this.longestRoad = false;
  this.largestArmy = false;
  this.activePlayer = false;
  // Sets second building state which will create payout for turn0
  this.secondBuilding = null;
  // Player resource hand
  this.resources = {
      sheep: 3,
      wheat: 3,
      wood: 3,
      ore: 3,
      brick: 3,      
  };
};

module.exports = Player;