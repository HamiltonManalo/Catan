const http = require('http');
const url = 'mongodb://localhost:64324/test';
const app = require('./server/routes.js');
const server = app.listen(8080, function () { console.log('Catan is being served on port 8080!'); });
const socketio = require('socket.io');
const io = require('./server/sockets');

let sockets = socketio.listen(server);
const socket = io.start(sockets);

module.exports.io = socket;





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

