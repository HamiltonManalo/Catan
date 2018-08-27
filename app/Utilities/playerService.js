class playerService {
    constructor(DBFunc) {
        this.DBFunc = DBFunc;
        this.playerArray;
    }

   
        /**
     * Adds the specified resource to players hand and saves game instance
     * @param {number} resource 
     * @param {number} playerId 
     */
    addResource(resource, playerId) {
        this.playerArray = this.DBFunc.getPlayers();
        let index = this.playerArray.findIndex(player => player.id == playerId);
            
        switch(resource) {
            case "ore":
                 this.playerArray[index].resources.ore ++;
                break;
            case "sheep":
                 this.playerArray[index].resources.sheep ++;
                break;
            case "wheat":
                 this.playerArray[index].resources.wheat ++;
                break;
            case "wood":
                 this.playerArray[index].resources.wood ++;
                break;
            case "brick": 
                 this.playerArray[index].resources.brick ++;
                break;
        }
    
        this.DBFunc.savePlayers(this.playerArray);
    };
    /**
     * Removes the specified resource to players hand and saves game instance
     * @param {number} resource 
     * @param {number} playerId 
     */
    removeResource(resource, playerId) {
        this.playerArray = this.DBFunc.getPlayers();
        let index = this.playerArray.findIndex(player => player.id == playerId);
            
        switch(resource) {
            case "ore":
                this.playerArray[index].resources.ore --;
                break;
            case "sheep":
                this.playerArray[index].resources.sheep --;
                break;
            case "wheat":
                this.playerArray[index].resources.wheat --;
                break;
            case "wood":
                this.playerArray[index].resources.wood --;
                break;
            case "brick": 
                this.playerArray[index].resources.brick --;
                break;
        }
    
        this.DBFunc.savePlayers(this.playerArray);
    }

    DiscardHalf(playerId) {
        
    }
}

module.exports = playerService; 