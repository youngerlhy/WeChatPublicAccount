/**
 * http://usejsdoc.org/
 */


var mongoose = require('mongoose');
var db = mongoose.createConnection();


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


db.openUri('mongodb://127.0.0.1:27017/runoob');

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
	owner:[{type:Schema.Types.ObjectId, ref:'User'}],
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

exports.findUserByName = function(name, callback){
	User.findOne({name:name}, function(err, obj){
		callback(err, obj);
	});
}

exports.findCarByName = function(name,callback){
	User.findOne({name:name}).populate({path:'Car'}).exec(function(err, obj){
		callback(err, obj);
	});
}


exports.deleteUserCar = function(name){
    User.findOne({nickname: name}).then(function(user){
    Car.findOne({owner: user._id}).then(function(car){car.remove()});
    user.remove();
});
}

exports.updateUserCar = function(name,userdata,cardata,callback){
	var updateStr = {$set:{userdata}};
	User.update({name:name}, updateStr, function(err, result){
		if(err){
			console.log("Error:"+err);
			return;
		}else{
			callback(result);
		}
	});
	
	if(cardata){
		var user = User.findOne({name:name}, function(err, obj){
			callback(err, obj);
		});
		updateStr = {$set:{cardata}};
		Car.update({name:user.nickname}, updateStr, function(err, result){
			if(err){
				console.log("Error:"+err);
				return;
			}else{
				callback(result);
			}
		});
	}
	
	
}

exports.allotUserCar = function(){
	var users = new Array();
	users = User.find({}, function(err, result){
		if(err){
			console("Error:" + err);
			return;
		}else{
			callback(result);
		}
	});
	
	var allotusers = new Array();
	users.forEach(function(value, index, array){
		if(value.car != null){   //
			allotusers.push(value);
		}
	});
	
	var cars = new Array();
	cars = Car.find({}, function(err, result){
		if(err){
			console("Error:" + err);
			return;
		}else{
			callback(result);
		}
	});
	
	var seatnum = 0;
	cars.forEach(function(value, index, array){
		for(var i=0; i<cars[index].seatavailablenum; i++){
			if(seatnum+i+1 <= allotusers.length){
				cars[index].passengers = allotusers[seatnum+i];
				cars[index].save(function(err){});				
			}
			// 若是座位数大于人数
		}
		seatnum += cars[index].seatavailablenum;
	});
}

/**
 * 再次发起报名时删除已有user和car
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
