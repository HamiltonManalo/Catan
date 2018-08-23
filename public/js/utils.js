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

function buildRoad (target) {
  
  let dataObject = {
    playerId: this.CurrentPlayer.id,
    buildingType: 'road',
    nodeId: target
  }
  socket.emit('validatePlaceAction', dataObject)
}

function buildSettlement (target, player) {
  let dataObject = {
    playerId: this.CurrentPlayer.id,
    buildingType: 'settlement',
    nodeId: target
  }
  if(gameBoard.buildings[target].owner != null && CurrentPlayer.id === gameBoard.buildings[target].owner)
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
