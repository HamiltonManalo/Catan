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
  // Method for adding a resource to player's hand
  this.addResource = function(resource) {
    this.resources[resource] ++;
    console.log("Player"+this.id + " gets a " + resource);
  };
  // Method for removing a resource to player's hand
  this.removeResource = function(resource) {
    this.resources[resource] --;
  };
  // Method for calculating player's score
  this.calculateScore = function() {
    let totalScore = 0
    if (this.longestRoad == true) {
      totalScore += 2;
    }
    if (this.largestArmy == true) {
      totalScore += 2;
    }
    totalScore += this.settlements + (this.cities * 2)
    this.score = totalScore
  };
  // Pay resources from second placed building
  this.payTurnZero = function() {
    var resourcesToPay = this.secondBuilding.resources;
    for (i = 0; i < resourcesToPay.length; i++) {
      // Only pay if not an ocean
      if (resourcesToPay[i].resourceType !== "ocean") {
        this.addResource(resourcesToPay[i].resourceType);
      }
    }
  };
};

module.exports = Player;