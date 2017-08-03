var mongoose = require('mongoose');
var Promise = require("bluebird");
mongoose = Promise.promisifyAll(mongoose);
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

insertSignupData = function(nickName, imageUrl, seatnum, game) {
	var person = new User({
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
	person.car = car;
	car.save(function(err) {
	if (err) {
	    return console.log(err);
	}
        });
        }	
        person.game = game;
        game.competitors.push(person);
        game.save();
        person.save(function(err) {
        if (err) {
        	console.log(err);}
        });
}

exports.countUserByName = function(name, callback) {
	User.count({nickname:name}, callback);
}

exports.findAllUsers = function(callback){
	 User.find({}, function(err, result){
			if(err){
				console.log("Find all users fail:" + err);
				return;
			}else{
				callback(result);
			}
		});
}

exports.deleteUserCar = function(name){
Game.findOne({signupStatus: 'Started'}, function(error, gameResult) {
        if(error) return console.log(error);
        User.findOne({nickname: name, game: gameResult._id}, function(err, user) {
               if(err) return console.log(err);
                Car.findOne({owner: user._id}).then(function(car){car.remove()});
            gameResult.competitors.pull(user);
            gameResult.save();
	    user.remove();
        });
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

exports.findCurrentSignupGame = function(callback){
	return Game.find({signupStatus:"Started",gameStatus:"Started"}).sort({"startTime":-1}).limit(1).execAsync()
	.then(function(result){
	  console.log(result);
	}).catch(function(err){
	  if(err){
	    console.log("Get current signup game fail:" + err);
	    return;
	  }
	});
}

exports.closeOutGame=function(startTime, endTime,callback){
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
        } else {
          callback(docs);
        }
      });
    }
  });
}

exports.insertSignupAndGame = function(nickname, imageurl, num) {
    Game.findOne({signupStatus: 'Started'}, function(error, gameResult) {
        if(error) return console.log(error);
        User.count({name: nickname, game: gameResult._id}, function(err, count) {
                if(err) return console.log(err);
                if(count == 0) {
                        insertSignupData(nickname, imageurl, num, gameResult);
                }
        });
});

}


exports.queryAllStatus = function(nickname,imgurl, callback) {
      Game.findOne({signupStatus: 'Started'}, function(error, gameResult) {
        if(error) return console.log(error);
        if(gameResult != null) {
        User.count({name: nickname, game: gameResult._id}, function(err, count) {
                if(err) return console.log(err);
                if(count == 0) {
                    // /insert data page
                   callback('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/?nickname='
                    + nickname + '&headimgurl=' + imgurl);

                } else {
                   // /cancel data page
                  callback('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/cancel_sign_up?nickname=' + nickname);
                }
        });
} 
    Game.findOne({signupStatus: 'Ended', gameStatus: 'Started'}, function(error, gameResult) {
        if(error) return console.log(error);
        if(gameResult !=null) {
          // show result
            callback('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/show_sign_result');

         } else {
          // no action
           callback('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/no_action');
         }
    });
});

}
