
let validatePlayerCanPlaceBuilding = function(gb, buildingId, playerId) {
  // Check adjacent buildings for owners
  let path = gb.buildings
  let building = gb.buildings['b' + buildingId];
  for (let j = 0; j < building.adjacent.length; j++) {
    let adjacentBuildingId = building.adjacent[j]
    if (path['b' + adjacentBuildingId].owner != null) {
      // Returns false if there are no roads connected
      console.log('Building too close to a rival nation!')
      return false
    }
  }
  path = gb.roads
  for (let i = 0; i < building.roads.length; i++) {
    let adjacentRoadId = building.roads[i]

    if (path['road' + adjacentRoadId].owner === playerId && building.owner === null) {
      console.log('Can Build a town here')
      return true;
    } // reassigning path
  }
  return false
}

/* 
 * Roads can only be built if the player owns an adjacent road and the road space is unowned 
 */ 

let validatePlayerCanPlaceRoad = function(gb, roadId, playerId) {
    let path = gb.roads;
    let road = gb.roads['road' + roadId]
    for(let i = 0; i < road.adjacent.length; i++) {
        let adjacentRoadId = road[i];
        if(path['road' + adjacentRoadId].owner == playerId && road.id == null ) {
            return true;
        }
    }
    return false;
}

let validatePlayerHasResourcesForRoad = function(playerObject) {
    let playerResources = playerObject.resources;

    if(playerResources.wood >= 1 && playerResources.brick >= 1)
        return true;
    else 
        return false;
}

let validatePlayerHasResourcesForSettlement = function(playerObject) {
    let playerResources = playerObject.resources;

    if(playerResources.wood >= 1 && playerResources.brick >= 1 &&
        playerResources.wheat >=1 && playerResources.sheep >= 1)
        return true; 
    else 
        return false; 
}

let validatePlayerHasResourcesForCity = function(playerObject) {
    let playerResources = playerObject.resources;

    if(playerResources.wheat >= 2 && playerResources.ore >= 2) 
        return true;
    else
        return false; 
}

let validatePlayerHasResourcesForDevCard = function(playerObject) {
    let playerResources = playerObject.resources;
    
    if(playerResources.sheep >= 1 && playerResources.wheat >= 1 && 
        playerResources.ore >= 1)
        return true;
    else
        return false; 
}

exports.validateRoad = validatePlayerCanPlaceRoad
exports.validateBuilding = validatePlayerCanPlaceBuilding
