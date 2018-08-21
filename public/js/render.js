// creates DOM elements for each road, appends to #origin
function generateBoardHTML (Board) {
  gameState = JSON.parse(Board);
  if(gameState.board != null) {
    gameBoard = gameState.board;
    CurrentPlayer = gameState.players.find(player => player.activePlayer == true);
  } else {
    gameBoard = JSON.parse(Board);
    httpRequest('http://localhost:8080/getUser',function(user){
              ThisPlayer = CurrentPlayer = JSON.parse(user);
              setPanels(CurrentPlayer.id);
              
    });
  }
  
  // Create DOM elements for tiles, roads, and buildings
  renderTiles();
  renderRoads();
  renderBuildings();

  console.log('--------------------------------------');
  console.log('Gameboard Generated');
  console.log('--------------------------------------');
}

var renderRoads = function () {
  let r = 0;// iterator
  while (r < gameBoard.numRoads) {
    
    var roadObject = gameBoard.roads[r];
    let origin = document.getElementById('origin');
    let node = document.createElement('div');

    node.className = 'road road-' +  roadObject.display.angle;
    node.style.bottom = roadObject.display.y + 'px';
    node.style.right = roadObject.display.x + 'px';
    node.setAttribute('data-owner', roadObject.owner)
    node.setAttribute('data-road-id', roadObject.id);
    node.addEventListener('click', buildRoad.bind(null, r)
  );
    origin.appendChild(node)

    r++;
  }
};

// creates DOM elements for each building, appends to #origin
var renderBuildings = function () {
  let b = 0; // iterator
  while (b < gameBoard.numBuildings) {
    var buildingObject = gameBoard.buildings[ b];

    let origin = document.getElementById('origin');
    let node = document.createElement('div');

    node.className = 'building';
    node.style.bottom = buildingObject.display.y + 'px';
    node.style.right = buildingObject.display.x + 'px';
    node.setAttribute('data-building-id', buildingObject.id);
    node.setAttribute('data-owner', buildingObject.owner)
    node.addEventListener('click',buildSettlement.bind(null, b));
    origin.appendChild(node)

    b++;
  }
};

// creates DOM elements for each tile, appends to #origin
var renderTiles = function () {
  let origin = document.getElementById('origin');
  var n = 0; // iterator
  while (n < gameBoard.numTiles) {
    var tileObject = gameBoard.tiles[n];
    let newTile = document.createElement('div');
  
    newTile.setAttribute('data-tile-id', tileObject.id);
    newTile.classList.add('resource-tile');
    newTile.classList.add('resource-' + tileObject.resourceType);
    newTile.style.bottom = tileObject.display.y + 'px';
    newTile.style.right = tileObject.display.x + 'px';
    
    if (tileObject.chit) {
      let chitValue = document.createElement('span');
      
      chitValue.className = 'chit-value';
      chitValue.innerText = tileObject.chit.value;
     
      let chitAlpha = document.createElement('span');
     
      chitAlpha.className = 'chit-alpha';
      chitAlpha.innerText = tileObject.chit.alpha;
      
      let chitProbability = document.createElement('span');
      
      chitProbability.className = 'chit-probability';
      chitProbability.innerText = tileObject.chit.probability;
      newTile.append(chitAlpha, chitValue, chitProbability);

      if (tileObject.chit.value === 6 || tileObject.chit.value === 8) {
        newTile.classList.add('resource-hot');
      }
    }
    origin.append(newTile);

    n++;
  }
};

