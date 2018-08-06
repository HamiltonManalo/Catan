module.exports = class gameBoardService {
    constructor(DBService) {
        this.DBService = DBService;
        this.gameObject = this.DBService.getGameObject()
        console.log(DBService != null)
    }

/* 
* Private methods
 */

/*
Public methods which will be exposed to perform actual changes on the board
*/

setRoadOwner(roadId, playerId) {
    
    this.gameObject.board.roads['road' + roadId].owner = playerId;
    let playerIndex = this.gameObject.players.findIndex(x => x.id === playerId)
    this.gameObject.players[playerIndex].roads.push(roadId)
    this.DBService.saveGameObject(this.gameObject);
    return true; //return true if save was successful. Return false if failure
}

setSettlementOwner(buildingId, playerId) {

    this.gameObject.board.buildings['b' + buildingId].owner = playerId;
    let playerIndex = this.gameObject.players.findIndex(x => x.id === playerId)
    this.gameObject.players[playerIndex].settlements.push(buildingId)
    this.DBService.saveGameObject(this.gameObject);
     return true; //return true if save was successful. Return false if failure
}
}

