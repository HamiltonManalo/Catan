/* Exports may no longer work because of modules.export assignment*/
var Coordinates = require('./coordinates');
var config = require('./config.js');
module.exports = {
  newPlayer: function(playerID) {
    var newPlayer = {};
    newPlayer.placementOrder = null;
    newPlayer.ID = playerID;
    newPlayer.isTurn = false;
    newPlayer.score = 0;
    newPlayer.placementOrder = null;
    newPlayer.settlements = null;
    newPlayer.roads = null;
    newPlayer.cities = null;
    newPlayer.longestRoad = false;
    newPlayer.largestArmy = false; 
    newPlayer.builtSecond = null;
    // Player resource hand
    newPlayer.resources = {
        sheep: 0,
        wheat: 0,
        wood: 0,
        ore: 0,
        brick: 0,      
    };
    // Method for adding a resource to player's hand
    newPlayer.addResource = function(resource) {
      if (!newPlayer.resources[resource]) {
        console.error("That resource type does not exist");
      }
      newPlayer.resources[resource] ++;
    };
    // Method for removing a resource to player's hand
    newPlayer.removeResource = function(resource) {
      if (!newPlayer.resources[resource]) {
        console.error("That resource type does not exist");
      }
      newPlayer.resources[resource] --;
    };
    // Method for calculating player's score
    newPlayer.calculateScore = function() {
      var totalScore = 0
      if (newPlayer.longestRoad == true) {
        totalScore += 2;
      }
      if (newPlayer.largestArmy == true) {
        totalScore += 2;
      }
      totalScore += newPlayer.settlements + (newPlayer.cities * 2)
      newPlayer.score = totalScore
    };
    // Log what happened
    //  console.log("Player "+newPlayer.ID+" created!");
    // console.log(newPlayer);
    return newPlayer;
  },
  newTile: function(tileId) {
    //var gameBoard = {};
    //var tiles = {};
    var that = this;
    that.id = tileId;
    that.adjacent = [];
    that.buildings = [];
    that.roads = [];
    that.display = {};
    if (tileId === 0) {
    // tile0 is always at the center
      that.display = new Coordinates(0,0);
    } else {
    // Use X & Y of previous Tile to position this one
    // var prevY = tiles["tile"+(tileId - 1)].display.y;
    // var prevX = tiles["tile"+(tileId - 1)].display.x;
    // var transformAngle = gameBoard.config.spiral()[tileId];
    // // Calculate new X & Y
    // var newXY = calcXYFromPrev(prevX,prevY,transformAngle);
    // that.display = new config.Coordinates(newXY[0],newXY[1]);
  }
    // Only use resource tiles if maxResources hasn't been hit yet
    // if (gameBoard.numTiles >= gameBoard.config.maxResources) {
    //   that.resourceType = "ocean";
    // } else {
    //   that.resourceType = gameBoard.config.resourceTypes[tileId];
    // }
    // Keep track of whether the desert has been placed or not
    // if (that.resourceType === "desert") {
    //   gameBoard.robber = new Robber(that);
    //   gameBoard.robber.createDOMNode();
    //   gameBoard.config.desertHasBeenPlaced = true;
    // }
    // Only assign chit value if the resource is not ocean or desert
    // if (that.resourceType === "ocean") {
    //   that.chit = null;
    // } else if (that.resourceType != "desert" && gameBoard.config.desertHasBeenPlaced === false) {
    //   that.chit = new Chit(that.id);
    // } else if (that.resourceType != "desert" && gameBoard.config.desertHasBeenPlaced === true) {
    //   that.chit = new Chit((that.id - 1));
    // }
    // function that returns corresponding dom node
    // Add to gameBoard
    // gameBoard.tiles["tile"+that.id] = that;
    // // Set that to most recent
    // gameBoard.mostRecentTile = that;
    // gameBoard.numTiles++;
    return that;
  },
  newRoad: function(tileA, tileB) {


// Handy utility
    var getRoadAngle = function(tileA,tileB) {
      var x1 = tileA.display.x;
      var y1 = tileA.display.y;
      var x2 = tileB.display.x;
      var y2 = tileB.display.y;

      if (x2 < x1 && y2 > y1) { return "120deg"; }
      if (x2 > x1 && y2 > y1) { return "60deg"; }
      if (x2 < x1 && y2 === y1) { return "0deg"; }
      if (x2 > x1 && y2 === y1) { return "0deg"; }
      if (x2 < x1 && y2 < y1) { return "60deg"; }
      if (x2 > x1 && y2 < y1) { return "120deg"; }
    };
    var gameboard = {
      numRoads: 0,
    };

    var that = this;
    that.id = gameboard.numRoads;
    that.tiles = [tileA, tileB];
    that.buildings = [];
    that.adjacent = [];
    that.owner = null;
    // Display Logic
    // Calculate X & Y using connected tiles
    var roadX = (tileA.display.x + tileB.display.x)/2;
    var roadY = (tileA.display.y + tileB.display.y)/2;
    // // Calculate angle using connected tiles
    var roadAngle = getRoadAngle(tileA,tileB);
    // // Assign display values
    that.display = new Coordinates(roadX,roadY,roadAngle);
    // Push into roads key for each tile
    tileA.roads.push(that);
    tileB.roads.push(that);
    // function that returns corresponding dom node
    // that.getElement = function() {
    //   return $('.road[data-road-id="'+that.id+'"]');
    // function to change owner of building
  that.newOwner = function(newOwner) {
   // $element = that.getElement();

    if (newOwner === null) {
      that.owner = null;
      // $element.attr('data-owner','');
    } else {
      that.owner = newOwner;
      // $element.attr('data-owner',newOwner.id);
    }
  };

  // Looks at all adjacent roads, at least 1 needs to be the same owner as active player, else return false
  that.checkAdjacent = function() {
    for (i = 0; i < that.adjacent.length; i ++) {
      if (that.adjacent[i].owner == currentPlayerID && that.owner == null) {
        //Returns true if player owns adjacent road
        console.log(that.adjacent[i].owner)
        return true;
        // break;
      }
      for (j = 0; j < that.buildings.length; j++) {
        if (that.buildings[j].owner == currentPlayerID ) {
          return true;
        }
      }
      console.log("Check returned false");
      return false; 
    }
  };

  // Uses check adjacent to actually build a road
  that.build = function(player) {
    if (player.roads >= 15) {
      console.log("You are out of roads")
      return false;
    }
    if (that.checkAdjacent()) {
      console.log("A road  has been built on " + that.ID +  " for player " + player)
      that.newOwner(player);
      that.owner.roads ++;
      return true;
    } else {
      console.log("No Adjacent Roads");
      return false;
    }
  };

  // Increment total
  gameboard.numRoads++;
},

}