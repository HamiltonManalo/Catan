var _ = require('lodash');
module.exports = {
  calcTilesPerRing: function(ringID) {
    if (ringID === 0) { return 1; }
    else {
      ringID--;
      return (6 + (6 * ringID));
    }
  },
  newConfiguration: function(numRings) {
    var newConfiguration = {};
    // Rings defined as circular layers not including ocean
    // Ring 0 is the center of the board
    // Minimum 3 rings required to play
    if (numRings < 3) { newConfiguration.rings = 3; } else { newConfiguration.rings = numRings; }
    // Ensures hexagonal layout
    newConfiguration.maxAdjacent = 6;
    // Calculate maximum number of tiles (including oceans)
    newConfiguration.maxTiles = 0;
    // numRings+1 because oceans
    for (var i = 0; i < (numRings + 1); i++) {
      newConfiguration.maxTiles += this.calcTilesPerRing(i);
    }
    // maxResources will be 1 less ring than gameBoard.config.maxTiles
    newConfiguration.maxResources = newConfiguration.maxTiles - this.calcTilesPerRing(numRings);
    // Hard coding resources for now


      /* 
        Bad idea on dynamically generating resources
       */

    // newConfiguration.resourceControlls = function(desert 1 =, ore = 3, brick = 3, wood = 4, sheep = 4) {

    //   newConfiguration.resourceArray = []

    //   let resources = {
    //     newConfiguration.numDesert = desert;
    //     newConfiguration.numOre = ore;
    //     newConfiguration.numBrick = brick;
    //     newConfiguration.numWood = wood
    //     newConfiguration.numSheep = sheep
    //   }
    //   for(type in resources){
    //         newConfiguration.resourceArray.push(type)
    //   }
    //   return _.shuffle(newConfiguration.resourceArray)
    // }

    newConfiguration.resourceTypes = _.shuffle(["desert","ore","ore","ore","brick","brick","brick","wood","wood","wood","wood","wheat","wheat","wheat","wheat","sheep","sheep","sheep","sheep"]);
    // Hard coding chits for now
    newConfiguration.chits = [
      {value: 11, alpha: "R", probability: "●●"},
      {value: 3, alpha: "Q", probability: "●●"},
      {value: 6, alpha: "P", probability: "●●●●●"},
      {value: 5, alpha: "O", probability: "●●●●"},
      {value: 4, alpha: "N", probability: "●●●"},
      {value: 9, alpha: "M", probability: "●●●●"},
      {value: 10, alpha: "L", probability: "●●●"},
      {value: 8, alpha: "K", probability: "●●●●●"},
      {value: 4, alpha: "J", probability: "●●●"},
      {value: 11, alpha: "I", probability: "●●"},
      {value: 12, alpha: "H", probability: "●"},
      {value: 9, alpha: "G", probability: "●●●●"},
      {value: 10, alpha: "F", probability: "●●●"},
      {value: 8, alpha: "E", probability: "●●●●●"},
      {value: 3, alpha: "D", probability: "●●"},
      {value: 6, alpha: "C", probability: "●●●●●"},
      {value: 2, alpha: "B", probability: "●"},
      {value: 5, alpha: "A", probability: "●●●●"},
      {value: "", alpha: "", probability: ""}
    ];
    // Keeping track of desert placement
    // Works because there is only 1 desert
    newConfiguration.desertHasBeenPlaced = false;
    // Generate angles for tile positioning
    newConfiguration.spiral = function() {
      var angles = ['center'];
      // For each ring, generate angles and add to array
      for (var j = 0; j < numRings; j++) {
        // push 60 1 time
        angles.push(60);
        // push 0 j times
        for (var a = 0; a < j; a++) { angles.push(0); }
        // push 300 j+1 times
        for (var b = 0; b < j + 1; b++) { angles.push(300); }
        // push 240 j+1 times
        for (var c = 0; c < j + 1; c++) { angles.push(240); }
        // push 180 j+1 times
        for (var d = 0; d < j + 1; d++) { angles.push(180); }
        // push 120 j+1 times
        for (var e = 0; e < j + 1; e++) { angles.push(120); }
        // push 60 j+1 times
        for (var f = 0; f < j + 1; f++) { angles.push(60); }
      }
      return angles;
    };
    newConfiguration.tileHeight = 102;
    newConfiguration.tileWidth = 88;
    newConfiguration.tileBevel = 26;

    return newConfiguration;
  }, 
  Coordinates: function(xPos,yPos,angle) {
    var that = this;
    that.x = xPos;
    that.y = yPos;
    if (angle) { that.angle = angle; }
  },
};
