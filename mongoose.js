var mongoose = require('mongoose');
var Promise = require("bluebird");
Promise.promisifyAll(mongoose);
var db = mongoose.connect('mongodb://localhost/testdb3', {
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
    openid:{type:String},
	nickname:{type:String},
	imageurl:{type:String},
	car:{type:Schema.Types.ObjectId, ref:'Car'},
	game:{type:Schema.Types.ObjectId, ref:'Game'}
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
	gameType:{type:Schema.Types.ObjectId, ref:'GameType'},
	startTime:{type:Date},
	endTime:{type:Date},
	signupStatus:{type:String, default: "Started"},
	gameStatus:{type:String, default: "Started"},
	competitors:[{type:Schema.Types.ObjectId, ref:'User'}],
	winners:[{type:Schema.Types.ObjectId, ref:'User'}],
});
var Game = mongoose.model('Game',GameSchema);

var ScoreSchema = new Schema({
	game:{type:Schema.Types.ObjectId, ref:'Game'},
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

insertSignupData = function(openid, nickName, imageUrl, seatnum, game) {
   console.log("insertSignupData " +  nickName);
	var person = new User({
                openid : openid,
		nickname : nickName,
		imageurl : imageUrl
	});
    if (seatnum > 0) {
        var car = new Car({
             owner : person,
             available : true,
             seatnum : seatnum,
             seatavailablenum : seatnum - 1 
         });
         person.car=car;
        car.save(function(err) {
        if (err) {
                console.log(err);}
        });

        }	
        game.competitors.push(person);
        person.game = game;

        

        game.save();
        person.save(function(err) {
        if (err) {
        	console.log(err);}
        });
}

exports.countUserByName = function(name, callback) {
	User.count({nickname:name}, callback);
}


exports.deleteUserCar = function(openid){
Game.findOne({signupStatus: 'Started'}, function(error, gameResult) {
        if(error) return console.log(error);
        User.findOne({openid: openid, game: gameResult._id}, function(err, user) {
               if(err) return console.log(err);
                Car.findOne({owner: user._id}).then(function(car){car.remove()});
            gameResult.competitors.pull(user);
            gameResult.save();
	    user.remove();
        });
});

}

exports.findAllUsersCars = function(){
	var join = Promise.join;
	var promise = Game.findOne({signupStatus: 'Ended', gameStatus: 'Started'}, function(error, gameResult) {
		var promise2 = User.find({game:gameResult._id, car:{$exists:true}}).exec();
		var promise3 = User.find({game:gameResult._id, car:{$exists:false}}).exec();
		var promise4 = User.find({game:gameResult._id}).exec();
		
		join(promise2,promise3,function(owners,passengers){
			console.log("OWNERS:"+owners);
			console.log("PASSENGERS:"+passengers);
			owners.forEach(function(owner, index){
				Car.findOne({available:true,owner:owner._id}).then(function(car){
					var len=car.seatavailablenum;
					for(var i=0; i<len; i++){
						car.passengers.push(passengers[index*len+i].get("_id"));
						car.save(function(err){
							if(err)  return console.log(err);	
							console.log("CARS3:"+car);
						});
					}
				});		
			});
		}).then(function(){
			promise4.then(function(){
				//
			});
		});	
	}).exec();
	
	return promise;
}


exports.findGameUser = function(game){
	var promise = User.find({game:game._id}).exec();
	return promise;
}

exports.findUserCar = function(user){
	var promise = Car.findOne({_id:user.car}).exec();
	return promise;
}

exports.fineCarOwner = function(car){
	var promise = User.findOne({_id:car.owner}).exec();
	return promise;
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

exports.closeOutGame = function(startTime, endTime){
  var updateGameStatus = {$set: {signupStatus: "Ended" }};
  Game.update({
    startTime:startTime,
    endTime:endTime
  }, updateGameStatus, function(error,result){
    if(error) {
      console.log(error);
    } else {
      console.log('Update success!');
      Game.find({
        startTime:startTime,
        endTime:endTime,
        signupStatus: "Ended"
      }, function(err, docs){
        if (err) {
          console.log('查询出错：' + err);
          return;
        } 
        console.log('关闭报名成功！');
      });
    }
  });
}

exports.insertSignupAndGame = function(openid, nickname, imageurl, num) {
    Game.findOne({signupStatus: 'Started'}, function(error, gameResult) {
        if(error) return console.log(error);
        User.count({openid: openid, game: gameResult._id}, function(err, count) {
                if(err) return console.log(err);
                if(count == 0) {
                        insertSignupData(openid, nickname, imageurl, num, gameResult);
                }
        });
});

}



exports.findUserByOpenId = function(openid, game){
	var promise = User.findOne({openid:openid, game: game._id}).exec();
	return promise;
}

exports.findStartedGame = function() {
        var promise = Game.findOne({signupStatus: 'Started'}).exec();
        return promise;
}

exports.findEndedGame = function() {
        var promise = Game.findOne({signupStatus: 'Ended', gameStatus: 'Started'}).exec();
        return promise;
}

exports.setGameStatusEnded = function(){
	Game.find({signupStatus:'Ended', gameStatus:'Started'},function(err,result){
		result.forEach(function(item,index){
			var now = new Date();
			if(item.endTime > now){
				item.gameStatus = 'Ended';
			}
			item.save(function(err){
				if(err)  return console.log(err);					
			});	
		});
	});
}


exports.getCountGames = function(){
	var promise = Game.count({}).exec();
    return promise;
}

exports.findOneUserGame = function(name){
	var promise = User.find({nickname:name}).exec();
	return promise;
}


