/*
    PLAYER Constructor
    ------------------------------------------------------
*/
function Player(playerID) {
  this.id = playerID;
  this.isTurn = false;
  this.score = 0;
  this.placementOrder = null;
  this.settlements = null;
  this.roads = null;
  this.cities = null;
  this.longestRoad = false;
  this.largestArmy = false;
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
  this.payT0 = function() {
    var resourcesToPay = this.secondBuilding.resources;
    for (i = 0; i < resourcesToPay.length; i++) {
      // Only pay if not an ocean
      if (resourcesToPay[i].resourceType !== "ocean") {
        this.addResource(resourcesToPay[i].resourceType);
      }
    }
  };
  // Log what happened
  console.log("Player"+this.id+" created!");
};



// Creates player objects for the specified number of players
var initializePlayers = function(numPlayers) {
  // Must be at least 2 players, and no more than 4
  if (numPlayers > 4 || numPlayers < 2) {
    alert("You have won a prize! Check the console!");
    console.log("Stupid Cunt, eh");
    return;
  }
  console.log("There are " + numPlayers + " players in the game");
  // Generate player object for each player
  for (var i = 0; i < numPlayers; i++) {
    players[i] = new Player(i);
  }
  console.log(players);
  // Set active player to first in array
  currentPlayerID = players[0];
  console.log("Current player is Player" + players[0].id);
};

module.exports = Player;