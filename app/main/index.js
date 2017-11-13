/*Requires */
var paths = require('path');
var http = require('http');
var fs = require('fs');
var fs = require('math.js');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:64324/test';
var cons = require('../game-logic/cons.js');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var gameboard = require('../game-logic/gameboard.js');
var path = require('../game-logic/helpers.js');
// var _ = require('lodash');
// var $ = require('jQuery');
// var config = require('./config.js');

//////					Global Variables				//////
// let currentState = { numPlayers: null,
//  players: [],
//  currentPlayerID: null,
//  numUsers: 0,
//  roads: {},
//  buildings: {},
//  tiles: []
// };
//////			 Server Side Constructors 		//////

// Automagically run test

var initializePlayers = function(numPlayers) {
  // Must be at least 2 players, and no more than 4
  if (numPlayers > 4 || numPlayers < 2) {
    console.log("There was a joke here before it moved server side.");
    console.log("Stupid Cunt, eh");
    return;
  }
  console.log("There are " + numPlayers + " players in the game");
  // Generate player object for each player
  for (var i = 0; i < numPlayers; i++) {
    currentState.players.push(cons.newPlayer(i));
     // io.emit('numplayers', playerLog)
  }
  /*

  Need to add dice roll and randomizer

  */
  // console.log(players)
  // Set active player to first in array
  // currentPlayerID = players[0].ID;
  // console.log("Current player is Player " + currentPlayerID);
}



// function run() {
//   initializePlayers(3);
//   // // Test gameboard
//   gameboard.generate();
//   console.log(gameboard.buildings.build0);
// };
// run();


  ////////////////////////////////////////////
  // 					server API functions 				 //
  //////////////////////////////////////////


// io.on('getBoard', function())



io.on('connection', function(socket){
	console.log('CLIENT CONNECT')
	var addedUser = false; 
	//Calls a roll and returns the value of 1d6
	socket.on('rollRequest', function rollD(){
	var roll = Math.floor(Math.random() * 6 + 1);
			console.log("DICE ROLLED")
		io.emit('rollRequest', roll);
	});
	//Nick Names for users does not appear to be working
	socket.on('add user', function(userName){
		if(addedUser) return;
		++numUsers
		socket.userName = userName;
		addedUser = true;
		console.log(userName)
		socket.emit('login', {msg : userName + " HAS CONNECTED!"})
	});
  socket.on('generateboard', function(){
    console.log("generate board called")
    gameboard.generate()
  });
 //Generates player cards for game
	socket.on('numplayers', function(num) {
		// conditional to prevent server crash
		initializePlayers(num);	
    // generateBoard();
    if(num > 4|| num < 2 ) {
    };
//Checks if any board has been created; need to write client side receiver to check values
  });
  socket.on('checkBoard', function test1(){
    console.log("checkBoard Called!")
    // gameboard.generate();
    var boardPiece = gameboard.tiles.tile0;
    console.log('///////////////////////////////////////////////////////')
    console.log(boardPiece)
    // socket.emit('checkBoard', JSON.parse(boardPiece));
    // socket.emit('checkBoard', {msg : gameboard.tiles.tile1.display} )
  }); 

  // constructor test
  socket.on('constructorTest', function test2() {
    function test3(name, age) {
      this.name = name,
      this.age = age
    }
    var allen = new test3("allen", "ded");
    console.log(allen)
  })

  //Bring in the gameboard from node

  socket.on('import board', function getBoard() {
    console.log('getBoard called')
    let board = JSON.stringify(gameboard);
    socket.emit('send board', board);
  });

  socket.on('getTileElement', function getTile(id) {
    console.log('get tile called!' + id);
    var tile = path.t(id).getElement();
    console.log(tile);
    socket.emit('tileinfo', tile)
  })

});




/*						Server Functionality					/*
*\  																				*/																					

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })

http.listen(8080, function() {
	console.log('LISTENING ON PORT 8080')
});
				 // serves game page								//
app.get('/game', function(req, res){ 
  	res.sendFile(paths.join(__dirname, '../../public/', 'index.html'));
});

app.get('/',function(req, res){
res.sendFile(paths.join(__dirname, '../../public/', 'login.html'));
});

app.get('/newUser', function(req, res){
 res.sendFile(paths.join(__dirname, '../../public/', 'newUser.html'));
});


MongoClient.connect("mongodb://localhost:27017/catanDB", function(err, db) {
  if(!err) {
    console.log("We are connected");
    // async function insertUser(userData)
  } else console.log("error connecting");
});

// MongoClient.connect('mongodb://localhost:64324/test', function(err, db) {
//   console.log(db);
//   // Get the collection
//   var col = db.collection('test');
//   col.insertOne({'a': 123}, function(err, r) {
//     // test.equal(null, err);
//     // test.equal(1, r.insertedCount);
//     // Finish up test
//     db.close();
//   });
// });

 MongoClient.connect("mongodb://localhost:27017/catanDB", function(err, db) {
  if(!err) {
    console.log("We are connected");
app.post('/newUser', parseUrlencoded, function(req, res){
  let userData = req.body;
  console.log(userData);
  let collection = db.collection('users')
  collection.insertOne(userData);
  res.redirect(201, '/');
  console.log("why didnt u redirect")
});
   
  } else console.log("error connecting");
});

app.use(express.static(paths.join(__dirname, '../../public')))
/*            Testing Calls                  /*
*\                                           */
