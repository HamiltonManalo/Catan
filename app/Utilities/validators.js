

let validatePlayerCanPlaceBuilding = function(gb, buildingId) {
  // Check adjacent buildings for owners
  let path = gb.buildings
  let building = gb.buildings['b' + buildingId];
  for (let j = 0; j < building.adjacent.length; j++) {
    let adjacentRoadId = building.adjacent[j]
    if (path['road' + adjacentRoadId].owner != null) {
      // Returns false if there are no roads connected
      console.log('You cant build here without a road')
      return false
    }
  }
  path = gb.roads
  for (let i = 0; i < building.adjacent.length; i++) {
    let adjacentBuildingId = building.adjacent[i]

    if (path['b' + adjacentBuildingId].owner == gb.currentPlayerID && building.owner == null) {
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
exports.validateRoad = validatePlayerCanPlaceRoad
exports.validateBuilding = validatePlayerCanPlaceBuilding
