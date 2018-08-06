// creates DOM elements for each road, appends to #origin
var renderRoads = function () {
  let r = 0 // iterator
  while (r < gameBoard.numRoads) {
    var roadObject = gameBoard.roads['road' + r]
    $origin = $('#origin')
    $roadDOM = $('<div/>')
      .attr('data-road-id', roadObject.id)
      .addClass('road')
      .addClass('road-' + roadObject.display.angle)
      .click(placeRoadEventGenerator(r, CurrentPlayer))
      .css({
        bottom: roadObject.display.y,
        right: roadObject.display.x
      })
    // Inject into DOM
    $origin.append($roadDOM)
    r++
  }
}

// creates DOM elements for each building, appends to #origin
var renderBuildings = function () {
  let b = 0 // iterator
  while (b < gameBoard.numBuildings) {
    var buildingObject = gameBoard.buildings['b' + b]
    $origin = $('#origin')
    $buildingDOM = $('<div/>')
      .attr('data-building-id', buildingObject.id)
      .addClass('building')
      .click(placeSettlementEventGenerator(b, CurrentPlayer))
      .css({
        bottom: buildingObject.display.y,
        right: buildingObject.display.x
      })
    // Inject into DOM
    $origin.append($buildingDOM)
    b++
  }
}

// creates DOM elements for each tile, appends to #origin
var renderTiles = function () {
  $origin = $('#origin')
  var n = 0 // iterator
  while (n < gameBoard.numTiles) {
    var tileObject = gameBoard.tiles['tile' + n]
    $tileDOM = $('<div />')
      .attr('data-tile-id', tileObject.id)
      .addClass('resource-tile')
      .addClass('resource-' + tileObject.resourceType)
      .css({
        bottom: tileObject.display.y,
        right: tileObject.display.x
      })
    if (tileObject.chit) {
      $chitValue = $('<span />')
        .addClass('chit-value')
        .text(tileObject.chit.value)
      $chitAlpha = $('<span />')
        .addClass('chit-alpha')
        .text(tileObject.chit.alpha)
      $chitProbability = $('<span />')
        .addClass('chit-probability')
        .text(tileObject.chit.probability)
      $tileDOM.append($chitAlpha, $chitValue, $chitProbability)

      if (tileObject.chit.value === 6 || tileObject.chit.value === 8) {
        $tileDOM.addClass('resource-hot')
      }
    }
    $origin.append($tileDOM)
    // Increment
    n++
  }
}
function go() {
  let dataObject = { playerId: this.CurrentPlayer.id }
  httpPost('http://localhost:8080/endTurn', dataObject, function (response) {
    console.log('next turn response ' + response)
  })
}

$('#getBoard').click(function () {
  console.log('get board called')

  makeBoard()
  let endTurnBtn = document.getElementById('endTurnBtn')

  endTurnBtn.addEventListener('click', function() {
      go()
    }
  )
  console.log('Board was generated? ' + (gameBoard == null))
})
function makeBoard (gameBoard) {
  httpRequest('http://localhost:8080/generateBoard', generateBoardHTML)
}
function generateBoardHTML (Board) {
  gameBoard = JSON.parse(Board)
  // Create DOM elements for tiles, roads, and buildings
  renderTiles()
  renderRoads()
  renderBuildings()

  console.log('--------------------------------------')
  console.log('Gameboard Generated')
  console.log('--------------------------------------')
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
async function httpPost (url, data, callback) {
  console.log('http post data ' + data)
  var http = new XMLHttpRequest()

  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.response)
    }
  }
  http.open('POST', url, true)
  http.setRequestHeader('Content-Type', 'application/json')
  http.send(JSON.stringify(data))
}

// function go() {
//   let endTurnBtn = document.getElementById('endTurnBtn');
//   let message = {'currentPlayersTurn': CurrentPlayer}

//   endTurnBtn.addEventListener('click', function() {
//     httpPost('http://localhost:8080/endTurn', message, function(response){
//       console.log('next turn response' + response)
//     }.call(null, message), {once: true} );
//   });
// }
