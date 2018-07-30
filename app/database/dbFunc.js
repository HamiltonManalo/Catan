 var MongoClient = require('mongodb').MongoClient;
    var mongo = {}; // this is passed to modules and code
    MongoClient.connect("mongodb://localhost:27017/marankings", function(err, db) {
        if (!err) {
            console.log("We are connected");

            // these tables will be passed to modules as part of mongo object
            mongo.dbUsers = db.collection("users");
            // mongo.dbDisciplines = db.collection("disciplines");

        } else
            console.log(err);
    });

Users = function(app, mongo) {

Users.prototype.addUser = function() {
    console.log("add user");

};

Users.prototype.getAll = function() {
	let t = mongo.dbUsers.find({});
	console.log('logged from ' + t);
    return "all users " + mongo.dbUsers;

    };
};
    
/* 
Implement a diff check for board saving
It'll look good on the CV
*/


    // console.log("bbb " + users.getAll()); // not connected at the very first time so displays undefined
module.exports = mongo;
    //READY PROGRAM I AM 13