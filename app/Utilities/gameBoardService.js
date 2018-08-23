module.exports = class gameBoardService {
  constructor (DBService, playerService) {
    this.DBService = DBService
    this.playerService = playerService;
    this.gameObject = this.DBService.getGameObject()
    
  }

  /*
* Private methods
 */

  /*
Public methods which will be exposed to perform actual changes on the board
*/
  /**
   * Takes the road node ID and playerID and changes the owner of the road. Performs no validation
   * @param {number} roadId 
   * @param {number} playerId
   */
  setRoadOwner (roadId, playerId) {
    let cost = ['brick', 'wood'];
    let playerIndex = this.gameObject.players.findIndex(x => x.id === playerId);

    this.gameObject.board.roads[roadId].owner = playerId;
    this.gameObject.players[playerIndex].roads.push(roadId);

    if(this.gameObject.completedPlacement) {
      cost.forEach(resource => this.playerService.removeResource(resource, playerId));
    }
    this.DBService.saveGameObject(this.gameObject);
    return this.gameObject.players[playerIndex]; // return true if save was successful. Return false if failure
  }
  /**
   * Takes in the building node ID and playerID and changes the owner of the settlement. Performs no validation  
   * @param {number} buildingId 
   * @param {number} playerId
   */
  setSettlementOwner (buildingId, playerId) {
    let cost = ['brick', 'wood', 'sheep', 'wheat'];
    let playerIndex = this.gameObject.players.findIndex(x => x.id === playerId);

    this.gameObject.board.buildings[buildingId].owner = playerId;
    this.gameObject.players[playerIndex].settlements.push(buildingId)
    if(this.gameObject.completedPlacement) {
      cost.forEach(resource => this.playerService.removeResource(resource, playerId));
    }
    this.DBService.saveGameObject(this.gameObject);
    return this.gameObject.players[playerIndex]; // return true if save was successful. Return false if failure
  }

  /**
   * Upgrades settlement to city. performs no validations
   * @param {number} buildingNodeId
   * @param {number} playerId
   */
  upgradeSettlement(buildingNodeId, playerId) {
    let playerIndex = this.gameObject.players.findIndex(x => x.id === playerId);
    let cost = ['ore', 'ore', 'ore', 'wheat', 'wheat']

    this.gameObject.board.buildings[buildingNodeId].isCity = true;
    this.gameObject.players[playerIndex].cities.push(buildingId)
    let idxToRemove = this.gameObject.players[playerIndex].settlements.indexOf(buildingNodeId);
    let result = this.gameObject.players[playerindex].settlements.splice(idxToRemove, 1);
    console.log('building upgraded to city nodeID removed from settlements should be ' + buildingNodeId + " node removed was " + result);
    this.DBService.saveGameObject(this.gameObject);
    return this.gameObject.players[playerIndex]; // return true if save was successful. Return false if failure
  }


/**
 * @param {number} roadId
 * Retrieving for data only, not for updating values 
 */
  getRoad(roadId) {
    return this.gameObject.board.roads[roadId];
  }

  /**
   * @param {number} buildingNodeId 
   * Retrieving for data only, not for updating values 
   */
  getBuildingNode(buildingNodeId) {
    return this.gameObject.board.buildings[buildingNodeId];
  }
  /**
   * @param {number} tileNodeId
   * Retrieving for data only, not for updating values 
   */
  getTileNode(tileNodeId) {
    return this.gameObject.board.tiles[tileNodeId];
  }
}
