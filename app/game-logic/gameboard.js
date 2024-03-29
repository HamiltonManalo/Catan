var _ = require('lodash')
var generator = require('./../Utilities/generators.js')

/*
    +----------------------------------------------------+
    |   Settlers of Catan Gameboard                      |
    |   v.0                                              |
    |   ---------------------------                      |
    +----------------------------------------------------+
*/

/*
    Configuration
    ------------------------------------------------------
*/

var calcTilesPerRing = function (ringID) {
  if (ringID === 0) {
    return 1
  } else {
    ringID--
    return 6 + 6 * ringID
  }
}
function configuration (numRings) {
  // Rings defined as circular layers not including ocean
  // Ring 0 is the center of the board
  // Minimum 3 rings required to play
  if (numRings < 3) {
    this.rings = 3
  } else {
    this.rings = numRings
  }
  // Ensures hexagonal layout
  this.maxAdjacent = 6
  // Calculate maximum number of tiles (including oceans)
  this.maxTiles = 0
  // numRings+1 because oceans
  for (var i = 0; i < numRings + 1; i++) {
    this.maxTiles += calcTilesPerRing(i)
  }
  // maxResources will be 1 less ring than gameBoard.config.maxTiles
  this.maxResources = this.maxTiles - calcTilesPerRing(numRings)
  // Hard coding resources for now

  this.resourceTypes = _.shuffle([
    'desert',
    'ore',
    'ore',
    'ore',
    'brick',
    'brick',
    'brick',
    'wood',
    'wood',
    'wood',
    'wood',
    'wheat',
    'wheat',
    'wheat',
    'wheat',
    'sheep',
    'sheep',
    'sheep',
    'sheep'
  ])
  // Hard coding chits for now
  this.chits = [
    {value: 11, alpha: 'R', probability: '●●'   },
    {value: 3, alpha: 'Q', probability: '●●'    },
    {value: 6, alpha: 'P', probability: '●●●●●' },
    {value: 5, alpha: 'O', probability: '●●●●'  },
    {value: 4, alpha: 'N', probability: '●●●'   },
    {value: 9, alpha: 'M', probability: '●●●●'  },
    {value: 10, alpha: 'L', probability: '●●●'  },
    {value: 8, alpha: 'K', probability: '●●●●●' },
    {value: 4, alpha: 'J', probability: '●●●'   },
    {value: 11, alpha: 'I', probability: '●●'   },
    {value: 12, alpha: 'H', probability: '●'    },
    {value: 9, alpha: 'G', probability: '●●●●'  },
    {value: 10, alpha: 'F', probability: '●●●'  },
    {value: 8, alpha: 'E', probability: '●●●●●' },
    {value: 3, alpha: 'D', probability: '●●'    },
    {value: 6, alpha: 'C', probability: '●●●●●' },
    {value: 2, alpha: 'B', probability: '●'     },
    {value: 5, alpha: 'A', probability: '●●●●'  },
    {value: '', alpha: '', probability: ''      }
  ]
  // Keeping track of desert placement
  // Works because there is only 1 desert
  this.desertHasBeenPlaced = false
  // Generate angles for tile positioning
  this.spiral = function () {
    var angles = ['center']
    // For each ring, generate angles and add to array
    for (var j = 0; j < numRings; j++) {
      // push 60 1 time
      angles.push(60)
      // push 0 j times
      for (var a = 0; a < j; a++) {
        angles.push(0)
      }
      // push 300 j+1 times
      for (var b = 0; b < j + 1; b++) {
        angles.push(300)
      }
      // push 240 j+1 times
      for (var c = 0; c < j + 1; c++) {
        angles.push(240)
      }
      // push 180 j+1 times
      for (var d = 0; d < j + 1; d++) {
        angles.push(180)
      }
      // push 120 j+1 times
      for (var e = 0; e < j + 1; e++) {
        angles.push(120)
      }
      // push 60 j+1 times
      for (var f = 0; f < j + 1; f++) {
        angles.push(60)
      }
    }
    return angles
  }
  this.tileHeight = 102
  this.tileWidth = 88
  this.tileBevel = 26
}

function Coordinates (xPos, yPos, angle) {
  this.x = xPos
  this.y = yPos
  if (angle) {
    this.angle = angle
  }
  return this.x, this.y, this.angle
}

class boardMaker {
  constructor () {
    this.gameId = generator.uuid()
    // Specify size of board in rings (min 3)
    this.config = new configuration(3)
    // Board Objects
    this.tiles = [];
    this.roads = [];
    this.buildings = [];
    // Keeping track of counts
    this.numTiles = 0
    this.numRoads = 0
    this.numBuildings = 0
    // Keeping track of most recently created tiles
    this.mostRecentTile = {}

    // Keeping track of robber
    // Initially gets assigned during board creation
    // when the desert tile is hit. This way the robber
    // begins assigned to the desert
    this.robberTileLocationId;
  }
}


/*
    CHIT Prototype
    ------------------------------------------------------
*/
function Chit (chitId) {
  this.value = gameBoard.config.chits[chitId].value
  this.alpha = gameBoard.config.chits[chitId].alpha
  this.probability = gameBoard.config.chits[chitId].probability
}

/*
    TILE Prototype
    ------------------------------------------------------
*/
var calcXYFromPrev = function (prevX, prevY, transformAngle) {
  var newX
  var newY
  if (transformAngle === 0) {
    newX = prevX + gameBoard.config.tileWidth
    newY = prevY
  } else if (transformAngle === 60) {
    newX = prevX + gameBoard.config.tileWidth / 2
    newY = prevY + (gameBoard.config.tileHeight - gameBoard.config.tileBevel)
  } else if (transformAngle === 120) {
    newX = prevX - gameBoard.config.tileWidth / 2
    newY = prevY + (gameBoard.config.tileHeight - gameBoard.config.tileBevel)
  } else if (transformAngle === 180) {
    newX = prevX - gameBoard.config.tileWidth
    newY = prevY
  } else if (transformAngle === 240) {
    newX = prevX - gameBoard.config.tileWidth / 2
    newY = prevY - (gameBoard.config.tileHeight - gameBoard.config.tileBevel)
  } else if (transformAngle === 300) {
    newX = prevX + gameBoard.config.tileWidth / 2
    newY = prevY - (gameBoard.config.tileHeight - gameBoard.config.tileBevel)
  }
  return [newX, newY]
}
function Tile (tileId) {
  this.id = tileId
  this.adjacent = []
  this.buildings = []
  this.roads = []
  // Display Logic
  if (tileId === 0) {
    // tile0 is always at the center
    this.display = new Coordinates(0, 0)
  } else {
    // Use X & Y of previous Tile to position this one
    var prevX = gameBoard.tiles[tileId - 1].display.x
    var prevY = gameBoard.tiles[tileId - 1].display.y
    var transformAngle = gameBoard.config.spiral()[tileId]
    // Calculate new X & Y
    var newXY = calcXYFromPrev(prevX, prevY, transformAngle)
    this.display = new Coordinates(newXY[0], newXY[1])
  }
  // Only use resource tiles if maxResources hasn't been hit yet
  if (gameBoard.numTiles >= gameBoard.config.maxResources) {
    this.resourceType = 'ocean'
  } else {
    this.resourceType = gameBoard.config.resourceTypes[tileId]
  }
  // Keep track of whether the desert has been placed or not
  if (this.resourceType === 'desert') {
    gameBoard.robberTileLocationId = this.id
    // gameBoard.robber.createDOMNode();
    gameBoard.config.desertHasBeenPlaced = true
  }
  // Only assign chit value if the resource is not ocean or desert
  if (this.resourceType === 'ocean') {
    this.chit = null
  } else if (
    this.resourceType != 'desert' &&
    gameBoard.config.desertHasBeenPlaced === false
  ) {
    this.chit = new Chit(this.id)
  } else if (
    this.resourceType != 'desert' &&
    gameBoard.config.desertHasBeenPlaced === true
  ) {
    this.chit = new Chit(this.id - 1)
  }

  // Add to gameBoard
  // gameBoard.tiles.push(this);
  // Set this to most recent
  gameBoard.mostRecentTile = this
  gameBoard.numTiles++
}

/*
    ROAD Prototype
    ------------------------------------------------------
*/

function Road (tileA, tileB) {
  this.id = gameBoard.numRoads
  this.tiles = [tileA.id, tileB.id]
  this.buildings = []
  this.adjacent = []
  this.owner = null
  // Display Logic
  // Calculate X & Y using connected tiles
  var roadX = (tileA.display.x + tileB.display.x) / 2
  var roadY = (tileA.display.y + tileB.display.y) / 2
  // Calculate angle using connected tiles
  var roadAngle = getRoadAngle(tileA, tileB)
  // Assign display values
  this.display = new Coordinates(roadX, roadY, roadAngle)
  // Push into roads key for each tile
  tileA.roads.push(this.id)
  tileB.roads.push(this.id)


  // Increment total
  gameBoard.numRoads++
}
// Handy utility
var getRoadAngle = function (tileA, tileB) {
  var x1 = tileA.display.x
  var y1 = tileA.display.y
  var x2 = tileB.display.x
  var y2 = tileB.display.y

  if (x2 < x1 && y2 > y1) {
    return '120deg'
  }
  if (x2 > x1 && y2 > y1) {
    return '60deg'
  }
  if (x2 < x1 && y2 === y1) {
    return '0deg'
  }
  if (x2 > x1 && y2 === y1) {
    return '0deg'
  }
  if (x2 < x1 && y2 < y1) {
    return '60deg'
  }
  if (x2 > x1 && y2 < y1) {
    return '120deg'
  }
}

/*
    BUILDING Prototype
    ------------------------------------------------------
*/

//
// YOURE ON THE RIGHT PATH. YOU NEED TO FIGURE OUT WHY TILES BEING PASSED IN AND IF THATS AN ISSUE. GOOD JOB TONIGHT
//
function Building (tileA, tileB, tileC) {
  this.id = gameBoard.numBuildings
  this.owner = null
  this.adjacent = []
  this.isCity = false
  this.roads = []
  this.resources = [tileA.id, tileB.id, tileC.id]
  // Calculate X & Y using connected tiles
  var buildingX = (tileA.display.x + tileB.display.x + tileC.display.x) / 3
  var buildingY = (tileA.display.y + tileB.display.y + tileC.display.y) / 3
  this.display = new Coordinates(buildingX, buildingY)
  // Push new building into buildings key of each tile
  tileA.buildings.push(this.id)
  tileB.buildings.push(this.id)
  tileC.buildings.push(this.id)
  // increment total

  gameBoard.numBuildings++
}

// Tile Connector
var connectTiles = function (tileA, tileB) {
  tileA.adjacent.push(tileB.id)
  tileB.adjacent.push(tileA.id)

  if (tileA.resourceType === 'ocean' && tileB.resourceType === 'ocean') {
    // Do not create road if between two oceans
  } else {
    gameBoard.roads[gameBoard.numRoads] = new Road(tileA, tileB)
  }
}

// Adjacent Tile Builder
var buildAdjacentOf = function (originTile) {
  while (originTile.adjacent.length < gameBoard.config.maxAdjacent && gameBoard.numTiles < gameBoard.config.maxTiles) {
    // Create next tile
    gameBoard.tiles.push(new Tile(gameBoard.numTiles))
    // Connect gameBoard.mostRecentTile to gameBoard.mostRecentTile -1
    var prevTile = gameBoard.tiles[gameBoard.mostRecentTile.id - 1]
    connectTiles(gameBoard.mostRecentTile, prevTile)
    // Connect gameBoard.mostRecentTile to originTile
    connectTiles(gameBoard.mostRecentTile, originTile)
    // Create Building
    gameBoard.buildings[gameBoard.numBuildings] = new Building(gameBoard.mostRecentTile, prevTile, originTile)
  }
  // Create final connection
  var nextTile = gameBoard.tiles[originTile.id+1]
  connectTiles(gameBoard.mostRecentTile, nextTile)
  // Create building in closing triangle
  gameBoard.buildings[gameBoard.numBuildings] = new Building(gameBoard.mostRecentTile, nextTile, originTile)
}

// There are 3 initial Tiles, enough for 1 triangle
// Assumes gameBoard.numTiles = 0
var generateInitialTiles = function () {
  gameBoard.tiles.push( new Tile(0))
  gameBoard.tiles.push(new Tile(1))
  gameBoard.tiles.push(new Tile(2))
  connectTiles(gameBoard.tiles[0], gameBoard.tiles[1])
  connectTiles(gameBoard.tiles[0], gameBoard.tiles[2])
  connectTiles(gameBoard.tiles[1], gameBoard.tiles[2])
  // First building
  gameBoard.buildings[gameBoard.numBuildings] = new Building(
    gameBoard.tiles[0],
    gameBoard.tiles[1],
    gameBoard.tiles[2]
  )
}

// Recursive loop, builds tiles in a spiral until maxTiles is hit
// Assumes generateInitialtiles() has been run
var generateTilesLoop = function () {
  var i = 0
  while (gameBoard.numTiles < gameBoard.config.maxTiles) {
    var originTile = gameBoard.tiles[i]
    buildAdjacentOf(originTile)
    i++
  }
}

// Handy Utility
var getBuildingIdsFromResource = function (resourceId) {
  let resource = gameBoard.tiles[resourceId]
  var buildingIds = []
  for (var i = 0; i < resource.buildings.length; i++) {
    buildingIds.push(resource.buildings[i])
  }
  return buildingIds
}
// Accepts a building object, populates its adjacent key
var assignBuildingsToBuilding = function (building) {
  var resourceABuildingIds = getBuildingIdsFromResource(building.resources[0])
  var resourceBBuildingIds = getBuildingIdsFromResource(building.resources[1])
  var resourceCBuildingIds = getBuildingIdsFromResource(building.resources[2])
  // Remove this building's ID from each array
  resourceABuildingIds = _.pull(resourceABuildingIds, building.id)
  resourceBBuildingIds = _.pull(resourceBBuildingIds, building.id)
  resourceCBuildingIds = _.pull(resourceCBuildingIds, building.id)
  // Get building ID of each adjacent building
  var buildingAId = _.intersection(resourceABuildingIds, resourceBBuildingIds)[
    0
  ]
  var buildingBId = _.intersection(resourceABuildingIds, resourceCBuildingIds)[
    0
  ]
  var buildingCId = _.intersection(resourceBBuildingIds, resourceCBuildingIds)[
    0
  ]
 
  // Prevent undefined from being added to this building's adjacent key
  if (buildingAId) {
    building.adjacent.push(buildingAId)
  }
  if (buildingBId) {
    building.adjacent.push(buildingBId)
  }
  if (buildingCId) {
    building.adjacent.push(buildingCId)
  }
}

// Assigns adjacent buildings to each building on the board
var assignBuildingsToBuildings = function () {
  var b = 0 // iterator
  while (b < gameBoard.numBuildings) {
    var buildingObject = gameBoard.buildings[b]
    assignBuildingsToBuilding(buildingObject)
    b++
  }
}

function bp (id) {
  let path = gameBoard.buildings[id]
  return path
}

function tp (id) {
  let path = gameBoard.tiles[id]
  return path
}

function rp (id) {
  let path = gameBoard.roads[id]
  return path
}

// Assign 2 connected buildings to each road
var assignBuildingsToRoad = function (road) {
  let tileABuildings = tp(road.tiles[0]).buildings
  let tileBBuildings = tp(road.tiles[1]).buildings
  road.buildings = _.intersection(tileABuildings, tileBBuildings)
  bp(road.buildings[0]).roads.push(road.id)
  bp(road.buildings[1]).roads.push(road.id)
}

// Assign buildings to all roads
var assignBuildingsToRoads = function () {
  var r = 0 // iterator
  while (r < gameBoard.numRoads) {
    assignBuildingsToRoad(gameBoard.roads[r])
    r++
  }
}

// Pass in two tiles, return a road object if it exists
var getRoadByTiles = function (tileA, tileB) {
  var r = 0
  while (r < gameBoard.numRoads) {
    var road = gameBoard.roads[r]
    if (
      gameBoard.road.tiles[0].id === tileA.id &&
      gameBoard.road.tiles[1].id === tileB.id
    ) {
      return road
    } else if (
      gameBoard.road.tiles[0].id === tileB.id &&
      gameBoard.road.tiles[1].id === tileA.id
    ) {
      return road
    }
    r++
  }
}

// Assign adjacent roads to road
var assignRoadsToRoad = function (originRoad) {
  var adjacentRoadsA = bp(originRoad.buildings[0]).roads
  var adjacentRoadsB = bp(originRoad.buildings[1]).roads
  // remove self from arrays
  adjacentRoadsA = _.without(adjacentRoadsA, originRoad.id)
  adjacentRoadsB = _.without(adjacentRoadsB, originRoad.id)
  // combine arrays
  originRoad.adjacent = _.concat(adjacentRoadsA, adjacentRoadsB)
}
// Run the above on all roads
var assignRoadsToRoads = function () {
  for (var r = 0; r < gameBoard.numRoads; r++) {
    assignRoadsToRoad(gameBoard.roads[r])
  }
}
var gameBoard;
// Generate the gameboard
function generateBoard () {
  gameBoard = new boardMaker()
  // Generate the tile network
  generateInitialTiles()
  generateTilesLoop()

  // Assign adjacent buildings to each building
  assignBuildingsToBuildings()

  // Assign 2 connected buildings to each road
  assignBuildingsToRoads()

  // Assign 4 adjacent roads to each road
  assignRoadsToRoads()
  
  console.log('--------------------------------------')
  console.log('Gameboard Generated')
  console.log('--------------------------------------')
  
  return gameBoard
}
module.exports = {
  generateBoard: generateBoard,
  gb: gameBoard
}