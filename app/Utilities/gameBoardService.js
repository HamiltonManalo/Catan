module.exports = class gameBoardService {
    constructor(DBService) {
        this.DBService = DBService;
        this.gameBoard = DBService.getGameboard()
        console.log(DBService != null)
    }

    

    setRoadOwner(roadId, playerId) {
        
        this.gameBoard.roads['road' + roadId].owner = playerId;
        this.DBService.saveGB(this.gameBoard);
        return true; //return true if save was successful. Return false if failure
    }

    setBuildingOwner(buildingId, playerId) {

        this.gameBoard.buildings['b' + buildingId].owner = playerId;
        this.DBService.saveGB(this.gameBoard);
         return true; //return true if save was successful. Return false if failure
    }

/*
Public methods which will be exposed to perform actual changes on the board
*/
}

