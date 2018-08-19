function callNextTurn () {
  let dataObject = { playerId: this.CurrentPlayer.id }
  httpPost('http://localhost:8080/endTurn', dataObject, function (player) {
    player = JSON.parse(player);
    changePlayer(player);
    setPanels(player);
    updateResources(player);
    console.log('next turn response ')
    console.log(player);
  })
}

$('#getBoard').click(function () {
  makeBoard()
  let endTurnBtn = document.getElementById('endTurnBtn')

  endTurnBtn.addEventListener('click', function (data) {
    callNextTurn()
  });
})

function makeBoard (gameBoard) {
  httpRequest('http://localhost:8080/generateBoard', generateBoardHTML)
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
