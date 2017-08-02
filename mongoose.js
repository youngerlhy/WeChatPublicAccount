/**
 * http://usejsdoc.org/
 */

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
	wechatId:{type:String, unique:true},
	nickname:{type:String},
	imageurl:{type:String},
	car:[{type:Schema.Types.ObjectId, ref:'Car'}],
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
    typename:{type:String, default: "Practice"},
    user:[{type:Schema.Types.ObjectId, ref:'User'}]
});
var GameType = mongoose.model('GameType', GameTypeSchema);

var GameSchema = new Schema({
	gameType:[{type:Schema.Types.ObjectId, ref:'GameType'}],
	startTime:{type:Date},
	endTime:{type:Date},
	status:{type:String, default: "Start"},
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

exports.findAllUsers = function(callback){
	 User.find({}, function(err, result){
			if(err){
				console("Find all users fail:" + err);
				return;
			}else{
				callback(result);
			}
		});
}


exports.findUserByName = function(name, callback){
	User.findOne({name:name}, function(err, result){
		callback(err, result);
	});
}

exports.findCarByName = function(name,callback){
	User.findOne({name:name}).populate({path:'Car'}).exec(function(err, result){
		callback(err, result);
	});
}


exports.deleteUserCar = function(name){
    User.findOne({nickname: name}).then(function(user){
	    Car.findOne({owner: user._id}).then(function(car){car.remove()});
	    user.remove();
    });
}

exports.allotUserCar = function(callback){
   var users = [];
   User.find({}, function(err, users){
		if(err){
			console.log("Error:" + err);
			return;
		}else{
			console.log("All users:"+users);
		}
	});
	
	var allotusers = [];
	users.forEach(function(user, index){
		if(!user.car){ 
			allotusers.push(user);
		}
	});
	
	var cars = [];
	Car.find({}, function(err, cars){
		if(err){
			console.log("Error:" + err);
			return;
		}else{
			console.log("All cars:"+cars);
		}
	});
	
	var seatnum = 0;
	cars.forEach(function(item, index){
		for(var i=0; i<item.seatavailablenum; i++){
			if(seatnum+i+1 <= allotusers.length){
				item.passengers = allotusers[seatnum+i];
				item.save(function(err){
					if(err)  return console.log(err);					
				});				
			}
			// seatnum > allotusers.length
		}
		seatnum += item.seatavailablenum;
	});
}

/**
 * When starting to sign up again, clean all users and cars.
 */
exports.deleteAllUsersCars = function(){
	Car.remove({}, function(err){
		console.log("--------- Clean All Cars ---------");
		if(err){
			console.log("Clean all cars fail:"+err);
		}else{
			console.log("Clean all cars success.")
		}
		
	});
	User.remove({}, function(err){
		console.log("--------- Clean All Users ---------");
		if(err){
			console.log("Clean all users fail:"+err);
		}else{
			console.log("Clean all users success.")
		}
	});
}

exports.insertPublishGame = function(startTime,endTime) {
	  var game = new Game({
	    startTime:startTime,
	    endTime:endTime
	  }) ;
	  game.save(function(err) {
	    if (err) {
	      return console.log(err);
	  }
	  });
}

exports.findCurrentGame = function(){
	Game.find({status:"Start"}).sort({"time":-1}).limit(1).exec(function(err,reusult){
		if(err){
			console("Get current game fail:" + err);
			return;
		}else{
			callback(result);
		}
	});
}
