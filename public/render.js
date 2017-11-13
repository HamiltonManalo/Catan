// creates DOM elements for each road, appends to #origin
var renderRoads = function() {
  var r = 0; // iterator
  while (r < gameBoard.numRoads) {
    var roadObject = gameBoard.roads["road"+r];
    $origin = $('#origin');
    $roadDOM = $('<div/>')
      .attr('data-road-id',roadObject.id)
      .addClass('road')
      .addClass('road-'+roadObject.display.angle)
      .css({
        bottom: roadObject.display.y,
        right: roadObject.display.x
      });
    // Inject into DOM
    $origin.append($roadDOM);
    r++;
  }
};

// creates DOM elements for each building, appends to #origin
var renderBuildings = function() {
  var b = 0; // iterator
  while (b < gameBoard.numBuildings) {
    var buildingObject = gameBoard.buildings["b"+b];
    $origin = $('#origin');
    $buildingDOM = $('<div/>')
      .attr('data-building-id',buildingObject.id)
      .addClass('building')
      .css({
       bottom: buildingObject.display.y,
       right: buildingObject.display.x
      });
    // Inject into DOM
    $origin.append($buildingDOM);
    b++;
  }
};

// creates DOM elements for each tile, appends to #origin
var renderTiles = function() {
  $origin = $("#origin");
  var n = 0; // iterator
  while (n < gameBoard.numTiles) {
    var tileObject = gameBoard.tiles["tile"+n];
    $tileDOM = $("<div />")
      .attr('data-tile-id',tileObject.id)
      .addClass('resource-tile')
      .addClass('resource-'+tileObject.resourceType)
      .css({
        bottom: tileObject.display.y,
        right: tileObject.display.x
      });
    if (tileObject.chit) {
      $chitValue = $("<span />").addClass("chit-value").text(tileObject.chit.value);
      $chitAlpha = $("<span />").addClass("chit-alpha").text(tileObject.chit.alpha);
      $chitProbability = $("<span />").addClass("chit-probability").text(tileObject.chit.probability);
      $tileDOM.append($chitAlpha, $chitValue, $chitProbability);

      if (tileObject.chit.value === 6 || tileObject.chit.value === 8) {
        $tileDOM.addClass("resource-hot");
      }
    }
    $origin.append($tileDOM);
    // Increment
    n++;
  }
};

var generateBoardHTML = function() {

  // Create DOM elements for tiles, roads, and buildings
  renderTiles();
  renderRoads();
  renderBuildings();

  console.log("--------------------------------------");
  console.log("Gameboard Generated");
  console.log("--------------------------------------");
};