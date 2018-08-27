function callNextTurn () {

  let dataObject = { playerId: this.CurrentPlayer.id }

  httpPost('http://localhost:8080/endTurn', dataObject, function (updateData) {
    gameState = JSON.parse(updateData);
    gameBoard = gameState.board;
    let nextActivePlayer = gameState.players.find(x => x.activePlayer === true)
    changePlayer(nextActivePlayer);
    setPanels(nextActivePlayer);
    updateResources(nextActivePlayer);
  })
}

$('#getBoard').click(function () {
  startGame()
  let endTurnBtn = document.getElementById('endTurnBtn')
  
  endTurnBtn.addEventListener('click', function (data) {
    callNextTurn()
  });
})

function startGame (gameBoard) {
  httpRequest('http://localhost:8080/generateBoard', generateBoardHTML)
  httpRequest('http://localhost:8080/getUser',function(users){
    gameState.players = JSON.parse(users);
    CurrentPlayer = gameState.players.find(player => player.activePlayer == true);
    setPanels(CurrentPlayer.id);
    updateResources(CurrentPlayer);
  });
}

function httpRequest (url, callback) {
  var http = new XMLHttpRequest()
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText)
    }
  }
  http.open('GET', url, true)
  http.send()
}
/**
 * 
 * @param {string} url 
 * @param {object} data 
 * @param {function} callback 
 */
function httpPost (url, data, callback) {
  var http = new XMLHttpRequest()

  http.onreadystatechange = function () {

    if (this.readyState == 4 && this.status == 200) {
      callback(this.response)
    }
  }
  if (this.status == 400) {
    return 'failure to post'
  } 
  http.open('POST', url, true)
  http.setRequestHeader('Content-Type', 'application/json')
  http.send(JSON.stringify(data))
}

function buildRoad (event) {
  if(event.detail > 1)
    return;
  let road = event.currentTarget.dataset
  let dataObject = {
    playerId: CurrentPlayer.id,
    buildingType: 'road',
    nodeId: Number(road.roadId)
  }
  socket.emit('validatePlaceAction', dataObject)
}


function buildSettlement (event) {
  if(event.detail > 1)
    return;
  let building = event.currentTarget.dataset; 
  let dataObject = {
    playerId: CurrentPlayer.id,
    buildingType: 'settlement',
    nodeId: Number(building.buildingId)
  }

  if(building.owner && CurrentPlayer.id === gameBoard.buildings[building.buildingId].owner)
    dataObject.buildingType = 'city'
  socket.emit('validatePlaceAction', dataObject)
}

function setPanels(player) {
  let panels = document.getElementsByClassName('panel');
  for(let i = 0; i < panels.length; i++) {
    panels[i].setAttribute('data-player', player.id)
  }
}

function updateResources(playerObject) {
  let resourceNodes = document.getElementsByClassName('resource');
  let newResourceValues = playerObject.resources;
  for(let propertyName in newResourceValues) {
   for(let i = 0; i < resourceNodes.length; i++) {
    if(resourceNodes[i].id == propertyName)
      resourceNodes[i].children[1].innerText = newResourceValues[propertyName];
    }
  }
}
//Event function to allow users to move robber during gameplay

function moveRobber(event) {
  if(event.detail > 1) 
    return;
  
  let tiles = document.querySelectorAll('.resource-tile');

  if(!tiles[0] || !tiles[0].classList.contains('selectable'))
    return;
  if(!gameState.robberEvent.active || CurrentPlayer.id != gameState.robberEvent.eventOwnerId) 
    return;

  let robber = document.getElementById('robber')
  robber.style.cssText = event.currentTarget.style.cssText;
  gameState.board.robberTileLocationId = event.currentTarget.dataset.tileId;
  for(let i = 0; i < tiles.length; i++) 
    tiles[i].classList.remove('selectable')
  let dataObject = {
    tileNodeId: Number(event.currentTarget.dataset.tileId)
  }
    httpPost('http://localhost:8080/placeRobber', dataObject, response => {
      cardBox(response);
    })
}

function confirmPlayerToStealFrom(event) {
  let selectedPlayer = document.querySelector('.selected')
  if(selectedPlayer.id === CurrentPlayer)
    return;

  let dataObject = { 
    playerSendingId: CurrentPlayer.id,
    targetPlayerId: Number(selectedPlayer.id)
  }
    //get rid of box 
    let parent = event.srcElement.offsetParent;
    parent.id = 'dialog-box-hidden';
    parent.innerHTML = null;

    httpPost('http://localhost:8080/selectTarget', dataObject, updateData =>{
      let responseObject = JSON.parse(updateData);
     
      cardBox(responseObject);
     });
}

function confirmCardToSteal(event) {
  let selectedCard = document.querySelector('.selected');
  if(!selectedCard) 
    return;
  let parent = event.srcElement.offsetParent;
  parent.id = 'dialog-box-hidden';
  parent.innerHTML = null;
  console.log('you have submitted a choice. Good job');
  let dataObject = {
    playerSendingId : CurrentPlayer.id,
    targetPlayerId: 1,
    cardId: Number(selectedCard.id)
  }
  httpPost('http://localhost:8080/takeCard', dataObject, updateData =>{
     let updatedState = JSON.parse(updateData);
     let playerUpdate = updatedState.players.find(player => player.id === CurrentPlayer.id)
     updateResources(playerUpdate);
    });
  
}
//gameboard function to place robber at start of game
function placeRobber(tileNodeId) {
  // if(targetNode > gameBoard.tiles.length || gameState.debuggerEnabled != true)
  //   return;
  let tile = document.querySelector(`div[data-tile-id='${tileNodeId}']`);
  
  let robber = document.getElementById('robber')

  if(!robber)
    robber = document.createElement('div');
  let origin = document.getElementById('origin');
  robber.classList.add('robber');
  robber.style.cssText = tile.style.cssText;
  robber.setAttribute('id','robber');
  origin.appendChild(robber)
  gameState.board.robberTileLocationId = tileNodeId;
}
