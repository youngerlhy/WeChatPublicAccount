var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/testdb', {
	useMongoClient : true,
});

db.on('error', console.error.bind(console,'Database Connection error……'));

db.on('open',function(callback){
    console.log('db service connected.');
});

db.on('connecting',()=>{
    console.log('db connecting……');
});

db.on('connected', ()=>{
    console.log('db connected');
});
db.on('disconnecting', ()=>{
    console.log('db disconnecting...');
});
db.on('disconnected', ()=>{
    console.log('db disconnected');
});
db.on('close', ()=>{
    console.log('db close');
});

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    nickname:{type:String},
    imageurl:{type:String},
    car:{type:Schema.Types.ObjectId, ref:'Car'},
    gametype:[{type:Schema.Types.ObjectId, ref:'GameType'}]
});
var User = mongoose.model('User', UserSchema);


var CarSchema = new Schema({
    owner:{type:Schema.Types.ObjectId, ref:'User'},
    passengers:[{type:Schema.Types.ObjectId, ref:'User'}],
    available:{type:Boolean},
    seatnum:{type:Number},
    seatavailablenum:{type:Number},
});
var Car = mongoose.model('Car', CarSchema);

var GameTypeSchema = new Schema({
    typename:{type:String},
    user:[{type:Schema.Types.ObjectId, ref:'User'}]
});
var GameType = mongoose.model('GameType', GameTypeSchema);

var GameSchema = new Schema({
	gameType:[{type:Schema.Types.ObjectId, ref:'GameType'}],
	startTime:{type:Date},
	endTime:{type:Date},
	status:{type:String},
	compition:[{type:Schema.Types.ObjectId, ref:'User'}],
	winner:[{type:Schema.Types.ObjectId, ref:'User'}],
});
var Game = mongoose.model('Game',GameSchema);

var ScoreSchema = new Schema({
	game:[{type:Schema.Types.ObjectId, ref:'Game'}],
	firstset:{type:String},
	secondset:{type:String},
	thirdset:{type:String},
	totalPoints:{type:String},
});
var Score = mongoose.model('Score', ScoreSchema);

var LogSchema = new Schema({
    time:{type:Date},
    log:{type:String}
});
var Log = mongoose.model('Log', LogSchema);

exports.insertSignupData = function(nickName, imageUrl, seatnum) {
	var person = new User({
		nickname : nickName,
		imageurl : imageUrl
	});
	person.save(function(err) {
		if (err) return console.log(err);
		if (seatnum > 0) {
			var car = new Car({
				owner : person,
				available : true,
				seatnum : seatnum,
				seatavailablenum : seatnum - 1 
			});
			car.save(function(err) {
				if (err) return console.log(err);
			});
		}
	});
}

exports.countUserByName = function(name, callback) {
	User.count({nickname:name}, callback);
}

exports.findUserByName = function(name, callback){
	User.findOne({nickname:name}, callback);
}

exports.findCarByName = function(name, callback){
}

exports.deleteUserCar = function(name, callback){
}

exports.updateUserCar = function(name, callback){
	
}

exports.allotUserCar = function(){
}


//for Test

exports.test1 = function(){
    console.log("This is the method test1");
};

//var mongoose = require("./mongoose");
//mongoose.test1();


//db.close();



