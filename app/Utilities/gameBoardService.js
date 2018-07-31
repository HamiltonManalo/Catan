class gameBoardService {
    constructor(gameBoard, playerObject, playerService, DBService) {
        this.gameBoard = gameBoard;
        this.player = playerObject;
        this.playerService = playerService;
        this.DBService = DBService;
    }

/* 
Private methods to make changes to the gameBoard internally with the idea that they will be implemented with calls to save to DB. 
*/ 
    setRoadOwner(roadId, playerId) {
        gameBoard.roads['road' + id].owner = playerId;
        //Save to DB here
        return true; //return true if save was successful. Return false if failure
    }

    setBuildingOwner(buildingId, playerId) {
        gameBoard.buildings['b' + buildingId].owner = playerId;
         //Save to DB here
         return true; //return true if save was successful. Return false if failure
    }

/*
Public methods which will be exposed to perform actual changes on the board
*/
}

module.exports = gameBoardService;