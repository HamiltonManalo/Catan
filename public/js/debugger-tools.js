/*
    Debugger Tools
    ------------------------------------------------------
    Called from gameBoard.generate();
*/
var debuggerTools = function() {

  if(!gameBoard.tiles) return;
  // Set max input value on debug tool
  // $('#move-robber')
  //   .attr('max',(gameBoard.config.maxTiles - 1))
  //   .attr('maxlength',(gameBoard.config.maxTiles.toString()).length)
  //   .val(gameBoard.robber.location.id);
  $('#road-id')
    .attr('max',(gameBoard.numRoads - 1))
    .attr('maxlength',(gameBoard.numRoads.toString()).length);

  // Make sure user can't set a tileID that doesn't exist
  $('#move-robber').on('blur',function(){
    var numValue = $(this).val();
    if (numValue >= gameBoard.config.maxTiles) {
      numValue = (gameBoard.config.maxTiles - 1);
      $(this).val(numValue);
    }
  });

  // Make sure user can't set a roadID that doesn't exist
  $('#road-id').on('blur',function(){
    var numValue = $(this).val();
    if (numValue >= gameBoard.numRoads) {
      numValue = (gameBoard.numRoads - 1);
      $(this).val(numValue);
    }
  });

  // Make sure user can't set a buildingID that doesn't exist
  $('#building-id').on('blur',function(){
    var numValue = $(this).val();
    if (numValue >= gameBoard.numBuildings) {
      numValue = (gameBoard.numBuildings - 1);
      $(this).val(numValue);
    }
  });

  // Submit new robber location
  $('#move-robber-submit').on('click', function() {
    var newTileID = $('#move-robber').val();
    var newTile = gameBoard.tiles["tile"+newTileID];
    gameBoard.robber.newLocation(newTile);
  });

  // Disable generateBoard button
  $('#generate-board').attr('disabled',true);
 
  // Submit new road owner
  $('#road-submit').on('click', function() {
    var roadID = $('#road-id').val();
    var roadObject = roads["road"+roadID];
    var playerID = $('#road-player').val();
    var playerObject = null;
    if (playerID < players.length) {
      playerObject = players[playerID];
    }
    roadObject.newOwner(playerObject);
  });

  // Submit new building owner
  $('#building-submit').on('click', function() {
    var buildingID = $('#building-id').val();
    var buildingObject = buildings["b"+buildingID];
    var playerID = $('#building-player').val();
    var playerObject = null;
    if (playerID < players.length) {
      playerObject = players[playerID];
    }
    buildingObject.newOwner(playerObject);
  });

  // Show debug tools
  $('#debugger-tools').addClass('show');

  // Log road object on click
  $('.road').on('click',function(){
    $roadId = $(this).attr('data-road-id');
    $roadObject = gameBoard.roads["road"+$roadId];
    console.log($roadObject);
  });

  // Log building object on click
  $('.building').on('click',function(){
    $buildingId = $(this).attr('data-building-id');
    $buildingObject = gameBoard.buildings["b"+$buildingId];
    console.log($buildingObject);
  });

  // Log tile object on click
  $('.resource-tile').on('click',function(){
    $tileId = $(this).attr('data-tile-id');
    $tileObject = gameBoard.tiles["tile"+$tileId];
    console.log($tileObject);
  });

  // Building mouseover
  $('.building').on('mouseover', function(){
    $(this).addClass('hover');
    $buildingId = $(this).attr('data-building-id');
    $buildingObject = gameBoard.buildings["b"+$buildingId];
    // Highlight adjacent buildings
    for (var b = 0; b < $buildingObject.adjacent.length; b++) {
      let x = $buildingObject.adjacent[b];
      $adjacentBuilding = document.querySelector(`div[data-building-id="${$buildingObject.adjacent[b]}"]`);
      $adjacentBuilding.addClass('hover');
    }
    // Highlight adjacent roads
    for (var r = 0; r < $buildingObject.roads.length; r++) {
      $adjacentRoad = $buildingObject.roads[r].getElement();
      $adjacentRoad.addClass('hover');
    }
    // Highlight adjacent tiles 
    for (var t = 0; t < $buildingObject.resources.length; t++) {
      $adjacentTile = $buildingObject.resources[t].getElement();
      $adjacentTile.addClass('hover');
    }
  });

  // Building mouseout
  $('.building').on('mouseout', function(){
    $(this).removeClass('hover');
    $buildingId = $(this).attr('data-building-id');
    $buildingObject = gameBoard.buildings["b"+$buildingId];
    for (var b = 0; b < $buildingObject.adjacent.length; b++) {
      $adjacentBuilding = $buildingObject.adjacent[b].getElement();
      $adjacentBuilding.removeClass('hover');
    }
    for (var r = 0; r < $buildingObject.roads.length; r++) {
      $adjacentRoad = $buildingObject.roads[r].getElement();
      $adjacentRoad.removeClass('hover');
    }
    // Highlight adjacent tiles 
    for (var t = 0; t < $buildingObject.resources.length; t++) {
      $adjacentTile = $buildingObject.resources[t].getElement();
      $adjacentTile.removeClass('hover');
    }
  });

  // Road mouseover
  $('.road').on('mouseover', function(){
    $(this).addClass('hover');
    $roadId = $(this).attr('data-road-id');
    $roadObject = gameBoard.roads["road"+$roadId];
    // Highlight adjacent buildings
    for (var b = 0; b < $roadObject.buildings.length; b++) {
      $adjacentBuilding = $roadObject.buildings[b].getElement();
      $adjacentBuilding.addClass('hover');
    }
    // Highlight adjacent roads
    for (var r = 0; r < $roadObject.adjacent.length; r++) {
      $adjacentRoad = $roadObject.adjacent[r].getElement();
      $adjacentRoad.addClass('hover');
    }
  });
  // Road mouseout
  $('.road').on('mouseout', function(){
    $(this).removeClass('hover');
    $roadId = $(this).attr('data-road-id');
    $roadObject = gameBoard.roads["road"+$roadId];
    // Highlight adjacent buildings
    for (var b = 0; b < $roadObject.buildings.length; b++) {
      $adjacentBuilding = $roadObject.buildings[b].getElement();
      $adjacentBuilding.removeClass('hover');
    }
    // Highlight adjacent roads
    for (var r = 0; r < $roadObject.adjacent.length; r++) {
      $adjacentRoad = $roadObject.adjacent[r].getElement();
      $adjacentRoad.removeClass('hover');
    }
  });
};


//Generate board without going through startup
function wrapItUp() {
  $('#game-setup').remove();
  generateBoard();
  initializePlayers(3);
  debuggerTools();
  buildings.b42.build(players[0]);
  buildings.b19.build(players[0]);
  players[0].secondBuilding = buildings.b19;
  buildings.b37.build(players[1]);
  buildings.b5.build(players[1]);
  players[1].secondBuilding = buildings.b5;
  buildings.b11.build(players[2]);
  buildings.b7.build(players[2]);
  players[2].secondBuilding = buildings.b7;
  roads.road60.build(players[0]);
  roads.road61.build(players[0]);
  currentPlayerID = players[1];
  roads.road56.build(players[1]);
  roads.road55.build(players[1]);
  currentPlayerID = players[2];
  roads.road21.build(players[2]);
  roads.road22.build(players[2]);

  payoutFirstTurn();
}