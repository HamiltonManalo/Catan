/*Requires */
// var paths = require('path');

// var fs = require('fs');
// var fs = require('math.js');
// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');
// var ObjectId = require('mongodb').ObjectId;
// var parseUrlencoded = bodyParser.urlencoded({extended: false});
// var gameboard = require('../game-logic/gameboard.js');
// var _ = require('lodash');
// var $ = require('jQuery');
// var config = require('./config.js');
const http = require('http');
const url = 'mongodb://localhost:64324/test';
const cons = require('../game-logic/cons.js');
const bodyParser = require('body-parser');
const app = require('./server/routes.js');
const server = app.listen(8080, function () { console.log('Catan is being served on port 8080!'); });
const io = require('socket.io')(server);

module.exports = io;



// /*						Server Functionality					/*
// *\  																				*/																					

// MongoClient.connect("mongodb://localhost:27017/catanDB", function(err, db) {
//   if(!err) {
//     console.log("We are connected");
//     // async function insertUser(userData)
//   } else console.log("error connecting");
// });

// // MongoClient.connect('mongodb://localhost:64324/test', function(err, db) {
// //   console.log(db);
// //   // Get the collection
// //   var col = db.collection('test');
// //   col.insertOne({'a': 123}, function(err, r) {
// //     // test.equal(null, err);
// //     // test.equal(1, r.insertedCount);
// //     // Finish up test
// //     db.close();
// //   });
// // });

//  MongoClient.connect("mongodb://localhost:27017/catanDB", function(err, db) {
//   if(!err) {
//     console.log("We are connected");
// app.post('/newUser', parseUrlencoded, function(req, res){
//   let userData = req.body;
//   console.log(userData);
//   let collection = db.collection('users')
//   collection.insertOne(userData);
//   res.redirect(201, '/');
//   console.log("why didnt u redirect")
// });


  ////////////////////////////////////////////
  // 					server API functions 				 //
  //////////////////////////////////////////

