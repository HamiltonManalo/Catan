let validatePlayerCanPlaceBuilding = function (
  gameObject,
  buildingId,
  playerId
) {
  // Check adjacent buildings for owners
  let building = gameObject.board.buildings['b' + buildingId] // Hacky move so I don't have to say the array somewhere. I miss linq
  let playerObject = gameObject.players
    .filter(player => player.id === playerId)
    .shift()
  let resourceCheck = _validatePlayerHasResourcesForSettlement(playerObject)
  let placementsComplete = _validatePlacementRoundsComplete(
    gameObject,
    playerObject
  )

  // If player doesn't have resources and it isn't a placement round return false
  if (gameObject.completedPlacement && !resourceCheck) return false
  // If player hasn't completed placement round structures, they can't end their turn
  //   if(!placementsComplete)
  //      return false;

  let path = gameObject.board.buildings
  for (let j = 0; j < building.adjacent.length; j++) {
    let adjacentBuildingId = building.adjacent[j]
    if (path['b' + adjacentBuildingId].owner != null) {
      // Returns false if there are no roads connected
      console.log('Building too close to a rival nation!')
      return false
    }
  }

  path = gameObject.board.roads
  for (let i = 0; i < building.roads.length; i++) {
    let adjacentRoadId = building.roads[i]

    if (
      (path['road' + adjacentRoadId].owner === playerId &&
        building.owner === null) ||
      !placementsComplete
    ) {
      console.log('Can Build a town here')
      return true
    } // reassigning path
  }
  return false
}

/*
 * Roads can only be built if the player owns an adjacent road and the road space is unowned
 */

let validatePlayerCanPlaceRoad = function (gameObject, roadId, playerId) {
  let resourceCheck = _validatePlayerHasResourcesForRoad(
    gameObject.players.filter(player => player.id === playerId).shift()
  )

  //Check to make sure they aren't placing too many times on the first turn
  let roadCount = gameObject.players.find(x => x.id === playerId)
  if(gameObject.round == 0 && roadCount + 1 == 2)
    return false;
  if(gameObject.round == 1 && roadCount + 1 === 3 )
    return false;

  if (gameObject.completedPlacement && !resourceCheck) 
    return false
  let buildingPath = gameObject.board.buildings;
  let path = gameObject.board.roads
  let road = gameObject.board.roads['road' + roadId]
  for (let i = 0; i < road.adjacent.length; i++) {
    let adjacentRoadId = road.adjacent[i]
    if (
      path['road' + adjacentRoadId].owner === playerId &&
      road.owner == null
    ) {
      return true
    }

    let adjacentBuildingsOwned = road.buildings.map(x => buildingPath['b' + x].owner === playerId )

    return adjacentBuildingsOwned.find(x => x === true) == true;
  }
}
/** ***************************
*                            *
*    Resource Verfication    *
*                            *
*****************************/
let _validatePlayerHasResourcesForRoad = function (playerObject) {
  let playerResources = playerObject.resources

  if (playerResources.wood >= 1 && playerResources.brick >= 1) return true
  else return false
}

let _validatePlayerHasResourcesForSettlement = function (playerObject) {
  let playerResources = playerObject.resources

  if (
    playerResources.wood >= 1 &&
    playerResources.brick >= 1 &&
    playerResources.wheat >= 1 &&
    playerResources.sheep >= 1
  ) { return true } else return false
}

let _validatePlayerHasResourcesForCity = function (playerObject) {
  let playerResources = playerObject.resources

  if (playerResources.wheat >= 2 && playerResources.ore >= 2) return true
  else return false
}

let _validatePlayerHasResourcesForDevCard = function (playerObject) {
  let playerResources = playerObject.resources

  if (
    playerResources.sheep >= 1 &&
    playerResources.wheat >= 1 &&
    playerResources.ore >= 1
  ) { return true } else return false
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
  let placedStructures =
    playerObject.settlements.length + playerObject.roads.length
  let round = gameObject.round
  if (
    (round == 0 && placedStructures == 2) ||
    (round == 1 && placedStructures)
  ) {
    return true
  }
  return false
}
exports.validateRoad = validatePlayerCanPlaceRoad
exports.validateBuilding = validatePlayerCanPlaceBuilding
