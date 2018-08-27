let validatePlayerCanPlaceBuilding = function (gameObject, buildingId, playerId) {
  // Check adjacent buildings for owners
  let building = gameObject.board.buildings[buildingId] // Hacky move so I don't have to say the array somewhere. I miss linq
  let playerObject = gameObject.players.find(player => player.id === playerId);
  let resourceCheck = _validatePlayerHasResourcesForSettlement(playerObject)
  let placementsComplete = _validatePlacementRoundsComplete(gameObject, playerObject)

  // If player doesn't have resources and it isn't a placement round return false
  if (gameObject.completedPlacement && !resourceCheck) return false

  let settlementCount = gameObject.players.find(x => x.id === playerId).settlements.length

  if ((gameObject.round === 1 && settlementCount + 1 === 2) ||
      (gameObject.round === 2 && settlementCount + 1 === 3))  
    return false 

  let path = gameObject.board.buildings
  for (let j = 0; j < building.adjacent.length; j++) {
    let adjacentBuildingId = building.adjacent[j]

    if (path[ adjacentBuildingId].owner != null) {
      return false
    }
  }

  path = gameObject.board.roads
  for (let i = 0; i < building.roads.length; i++) {
    let adjacentRoadId = building.roads[i]

    if ((path[adjacentRoadId].owner === playerId &&
        building.owner === null) || !placementsComplete) {
      return true
    } 
  }
  return false
}

/*
 * Roads can only be built if the player owns an adjacent road and the road space is unowned
 */

// Need validation to make sure players place second round road attached to second round building
let validatePlayerCanPlaceRoad = function (gameObject, roadId, playerId) {
  let playerObject = gameObject.players.find(player => player.id === playerId);
  let resourceCheck = _validatePlayerHasResourcesForRoad(playerObject)

  // Check to make sure they aren't placing too many times on the first turn
  if (gameObject.completedPlacement && !resourceCheck) 
    return false

  let roadCount = gameObject.players.find(x => x.id === playerId).roads.length;
  if ((gameObject.round === 1 && roadCount + 1 === 2) ||
         (gameObject.round === 2 && roadCount + 1 === 3))
    return false 

  let buildingNodes = gameObject.board.buildings
  let path = gameObject.board.roads
  let road = gameObject.board.roads[roadId]

  for (let i = 0; i < road.adjacent.length; i++) {
    let adjacentRoadId = road.adjacent[i]

    if (path[adjacentRoadId].owner === playerId && road.owner == null && gameObject.completedPlacement)  
      return true 
  }
  let adjacentBuildingsOwned = [];
  // If placement is completed, place road next to any other building or road. If it hasn't been completed place only next to the last building you placed.
  //Also a weird check to see if you've already placed the second building in the second round. 
  if (gameObject.completedPlacement) {
    adjacentBuildingsOwned = road.buildings.map(x => buildingNodes[x].owner === playerId)
  } else if (gameObject.round == playerObject.settlements.length){
    let lastBuildingId = playerObject.settlements[playerObject.settlements.length - 1];
    adjacentBuildingsOwned = road.buildings.map(x => buildingNodes[x].owner === playerId && buildingNodes[x].id === lastBuildingId)
  }
  return adjacentBuildingsOwned.some(x => x == true)
}
/**
 * Validate player can place building at target node location
 * @param {object} gameObject 
 * @param {number} buildingNodeId 
 * @param {number} playerId 
 */
let validatePlayerCanPlaceCity = function(gameObject, buildingNodeId, playerId){
  let building = gameObject.board.buildings[buildingNodeId];
  let playerObject = gameObject.players.find(player => player.id === playerId);
  if(building.owner != playerId)
    return false;
  
  if(_validatePlayerHasResourcesForCity(playerObject))
    return true;
  
  console.log('Error with city validation');
  return false;
  
}

let validateRobberCanBeMoved = function(tileNodeId, gameObject) {
  if(gameObject.robberTileLocationId === tileNodeId) 
    return false;
  else 
    return true;
  
}
/** ***************************
*                            *
*    Resource Verfication    *
*                            *
*****************************/
let _validatePlayerHasResourcesForRoad = function (playerObject) {
  let playerResources = playerObject.resources;

  if (playerResources.wood >= 1 && playerResources.brick >= 1) 
    return true;
  else 
    return false;
}

let _validatePlayerHasResourcesForSettlement = function (playerObject) {
  let playerResources = playerObject.resources

  if (playerResources.wood >= 1 && playerResources.brick >= 1 && playerResources.wheat >= 1 && playerResources.sheep >= 1) 
    return true;
  else 
    return false;
}

let _validatePlayerHasResourcesForCity = function (playerObject) {
  let playerResources = playerObject.resources

  if (playerResources.wheat >= 2 && playerResources.ore >= 3)
    return true;
  else  
    return false;
}

let _validatePlayerHasResourcesForDevCard = function (playerObject) {
  let playerResources = playerObject.resources

  if (playerResources.sheep >= 1 && playerResources.wheat >= 1 && playerResources.ore >= 1)  
    return true;
  else 
    return false;
}

/**********************************
*                                 *
*    PlacementRound Validation    *
*                                 *
**********************************/
// Checked to see if the placement round is complete, and the player has completed the placements for each round
let _validatePlacementRoundsComplete = function (gameObject, playerObject) {
  // If round 0, each player should have 1 settlement and 1 road
  // If round 1, each player should have 2 settlements and 2 roads
  let placedStructures = playerObject.settlements.length + playerObject.roads.length;
  let round = gameObject.round;
  let numPlayers = gameObject.players.length;
  if ((round === 0 && placedStructures === numPlayers) || (round == 1 && placedStructures === numPlayers * 2)) {
    return true;
  }
  return false;
}

exports.validateRoad = validatePlayerCanPlaceRoad;
exports.validateBuilding = validatePlayerCanPlaceBuilding;
exports.validateCity = validatePlayerCanPlaceCity;
exports = validateRobberMove = validateRobberCanBeMoved;