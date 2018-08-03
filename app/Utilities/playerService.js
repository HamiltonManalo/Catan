class playerService {
    constructor(DBFunc) {
        this.DBFunc = DBFunc;
        this.playerArray;
    }

   
     //holder for player array

    AddResource(resource, playerId) {

        for(let player in playerArray) {
            if(!player.id === playerId) 
                continue
            
            switch(resource) {
                case "ore":
                    player.resources.ore ++;
                    break;
                case "sheep":
                    player.resources.sheep ++;
                    break;
                case "wheat":
                    player.resources.wheat ++;
                    break;
                case "wood":
                    player.resources.wood ++;
                    break;
                case "brick": 
                    player.resources.brick ++;
                    break;
            }
        }
    }
}