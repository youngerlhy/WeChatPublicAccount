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
//  id
    wechatId:{type:String, unique:true},
    nickname:{type:String},
    imageurl:{type:String},
    car:[{type:Schema.Types.ObjectId, ref:'Car'}],
    gametype:[{type:Schema.Types.ObjectId, ref:'GameType'}]
});
var User = mongoose.model('User', UserSchema);


var CarSchema = new Schema({
//  id
    owner:[{type:Schema.Types.ObjectId, ref:'User'}],
    passengers:[{type:Schema.Types.ObjectId, ref:'User'}],
    available:{type:Boolean},
    seatnum:{type:Number},
    seatavailablenum:{type:Number},
});
var Car = mongoose.model('Car', CarSchema);

var GameTypeSchema = new Schema({
//  id
    typename:{type:String},
    user:[{type:Schema.Types.ObjectId, ref:'User'}]
//  game 
});
var GameType = mongoose.model('GameType', GameTypeSchema);

var GameSchema = new Schema({
//	id
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

/**
 * json:{"openid": " ",
 *       "nickname": " ",
 *       "imageurl":" ",
 *       "car":[{
 *       "available":"",
 *       "seatnum":" ",
 *       "seatavailablenum":" "
 *       }]
 * }
 */
exports.saveUserCar = function(json,callback){
	var data = JSON.parse(json);
//	var temp = new 
	
}

exports.findUserByName = function(name, callback){
	User.findOne({name:name}, function(error, obj){
		callback(error, obj)
	});
}

exports.findCarByName = function(name,callback){
	var user = findUserByName(name);
	
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


//method2
//function test1(){
//  console.log("This is the method test1");
//};
//
//module.exports =  test1;
module.exports = {
    add: function() {
        
    },
    del: function() {
        
    },
    update: function() {
        
    },
    findBy: function() {
        
    }
    
    //自动分车
//  {findAllUsernonecar  FindAllCaravailableseat}
}; 
     
    







//db.close();



