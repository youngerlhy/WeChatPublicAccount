var request = require('request');
var mongoose = require('./mongoose');
mongoose.Promise = require('bluebird');

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {});
  });

  app.get('/cancel_sign_up', function(req, res) {
    res.render('cancel_sign_up', {});
  });

  app.get('/dailyEnglish', function(req, res) {
    res.render('dailyEnglish', {});
  });
  
   app.get('/newsletter', function(req, res) {
    res.render('newsletter', {});
  });
  
   app.get('/newshistory', function(req, res) {
    res.render('daily_english_history', {});
  });

   app.get('/no_action', function(req, res) {
    res.render('no_action', {});
   });
 
  app.get('/no_publish', function(req, res) {
    res.render('no_publish', {});
   });

  app.get('/sign_up_list', function(req, res) {
    res.render('sign_up_list', {});
   });

  app.get('/history', function(req, res) {
	    res.render('history', {});
	   });
  
  app.get('/game_history', function(req, res) {
	    // 第二步：通过code换取网页授权access_token
	    var code = req.query.code;
	    request.get({
	      url : 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + context.appid + '&secret='
	          + context.secret + '&code=' + code + '&grant_type=authorization_code',
	    }, function(error, response, body) {
	      if (response.statusCode == 200) {
	    	  var nickname = req.body.nickname;
	    	  
	    	  var promise =mongoose.getCountGames();
	    	  promise.then(function (count){
	    		  var promise2 =  mongoose.findOneUserGame(nickname);
	    		  promise2.then(function(result){
	    			  
	    			  var userGamesNum = result.length;
	    			  var gameCount = {"count":count,"userGamesNum":userGamesNum};
	    			  var gameCountJson = JSON.stringify(gameCount);
	    			  console.log('{'+gameCountJson+'}');
	    			  res.json('{'+gameCountJson+'}');
	    			  
	    		  });
	    	  });
	      }
	    });
  });  
 
  app.get('/tony', function(req, res) {
    res.render('tony', {});
  });

  app.get('/leo', function(req, res) {
    res.render('leo', {});
  });
  app.get('/affleck', function(req, res) {
    res.render('affleck', {});
  });
  app.get('/interface', function(req, res) {
    var token = "falcon";
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var echostr = req.query.echostr;
    var nonce = req.query.nonce;

    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = token;
    oriArray.sort();

    var original = oriArray.join('');

    var jsSHA = require('jssha');
    var shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(original);
    var scyptoString = shaObj.getHash("HEX");

    if (signature == scyptoString) {
      // success
      res.writeHead(200, {
        'Content-Type' : 'text/plain'
      });
      res.end(echostr);
      return true;
    } else {
      // fail
      res.writeHead(400, {
        'Content-Type' : 'text/plain'
      });
      res.end("fail");
      return false;
    }
  });

  app.post('/interface', function(req, res) {
  });


  app.post('/delete_data', function(req, res) {
    var openid  = req.body.openid;
    mongoose.deleteUserCar(openid);
    res.send(openid);
  });

  app.post('/insert_data', function(req, res) {
    var openid = req.body.openid;
    var nickname = req.body.nickname;
    var imageurl = req.body.imageurl;
    var num = req.body.seatnum;
    console.log(nickname + " " + imageurl + " " + num);
    mongoose.insertSignupAndGame(openid, nickname,imageurl,num);
    res.send(nickname + ' ' + imageurl + ' ' + num);
  });

  app.get('/publish_game',function(req, res) {
     console.log('publish a game');
     var promise = mongoose.findStartedGame();
     promise.then(function(result) {
     if(result == null) {
        var get_publish_access_token = 'get_publish_access_token';
        res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx067aa7e646581331&redirect_uri=http%3A%2F%2Fec2-34-210-237-255.us-west-2.compute.amazonaws.com%2F'
          + get_publish_access_token + '&response_type=code&scope=snsapi_base&state=home#wechat_redirect');
       } else {
        res.redirect('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/no_publish');    
      }
      });
  });

  app.get('/get_publish_access_token', function(req, res, next) {
    var code = req.query.code;
    request.get({
      url : 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + context.appid + '&secret='
          + context.secret + '&code=' + code + '&grant_type=authorization_code',
    }, function(error, response, body) {
      if (response.statusCode == 200) {
        res.render('select_sign_up_date', {});
      } else {
        console.log(response.statusCode);
      }
    });
  });

  app.get('/close_out_game',function(req, res) {
      console.log('close out a game');
      var game = mongoose.findStartedGame();
      game.then(function(result){
        console.log('result is :'+result);
        if(gameStarted(result)){
          console.log(result.startTime.toISOString() + ' ' + result.endTime.toISOString());
          console.log('close_out_game info :'+result);
          res.render('close_out_game',{startTime:result.startTime.toLocaleString(),endTime:result.endTime.toLocaleString()});
        }else{
          var show_sign_result = 'show_sign_result';
          res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx067aa7e646581331&redirect_uri=http%3A%2F%2Fec2-34-210-237-255.us-west-2.compute.amazonaws.com%2F'+ show_sign_result + '&response_type=code&scope=snsapi_base&state=home#wechat_redirect');
        }
      },function(err) {
        console.log(err); // Error: "It broke"
      });
  });
  
  app.post('/close_out_game_confirm',function(req, res) {
   console.log("confirm close out");
    var game = mongoose.findStartedGame();
    game.then(function(result){
    if(gameStarted(result)){
      console.log("close game!!!!");
      mongoose.closeOutGame(result.startTime, result.endTime);
    }else{
       console.log("there is no game to close out, no action ");
       res.redirect('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/no_action');
    }
    },function(err) {
      console.log(err); // Error: "It broke"
    });
  });
  
  app.post('/close_out_game_cancel', function(req,res){
    var show_sign_result = 'show_sign_result';
    res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx067aa7e646581331&redirect_uri=http%3A%2F%2Fec2-34-210-237-255.us-west-2.compute.amazonaws.com%2F'+ show_sign_result + '&response_type=code&scope=snsapi_base&state=home#wechat_redirect');
  });
  

  app.get('/show_sign_result', function(req, res) {
    // 第二步：通过code换取网页授权access_token
    var code = req.query.code;
    request.get({
      url : 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + context.appid + '&secret='
          + context.secret + '&code=' + code + '&grant_type=authorization_code',
    }, function(error, response, body) {
      if (response.statusCode == 200) {
    	  var json = '"user":[';
    	  var promise = mongoose.findGameUsersCars();
    	  promise.then(function(game){
    		  if(game != null){
	    		  var promise2 = mongoose.findGameUser(game);
	    		  promise2.then(function(users){
	    			  if(users != null){
		    			  users.forEach(function(user,index){
		    				  console.log("INDEX:"+index);
		    				  var promise3 = mongoose.findUserCar(user);
		    				  promise3.then(function(car){
		    					  if(car != null){
			    					  var promise4 = mongoose.fineCarOwner(car);
			    					  promise4.then(function(owner){
			    						  console.log("owner5:"+owner);
			    						  
			    						  json += '{"nickname":"'+user.nickname+'","imageurl":"'+user.imageurl+'","carname":"'+owner.nickname+'"},';
			    						  console.log("index:"+index);
			    						  console.log("users.length:"+users.length);
			    						  if(index == users.length-1){
			    							  json = json.substring(0, json.length-1)+']';
			    			    			  console.log("JSON:==="+json);
			    			    			  
			    			    			  var data = '[{"nickname":"Tiny Ding","imageurl":"http://wx.qlogo.cn/mmopen/vypzhLPqWka4cdIsQHWuU1IrztYcicz1icaibBW2rAoCbDFABK5TtLreFlnwvMbepkVgQDP7LcibcBbIicZ35bUEAbU5EjsCGUmAG/0","carname":"Phoenix"},{"nickname":"Phoenix","imageurl":"http://wx.qlogo.cn/mmopen/xJhQocZic7og1LicJVqXSc21aOPOUFDH0rBc3akeQkoU5kePONwWDKjmhqXv5W39rUKkHv83Uec3iaKPeZ5YZ8H2xqW4zueShRf/0","carname":"Phoenix"}]';
			    			    			  res.json({data}); 
			    						  }
			    					  });
		    					  }else{
		    						  json += '{"nickname":"'+user.nickname+'","imageurl":"'+user.imageurl+'","carname":"出租车"},';
		    						  if(index == users.length-1){
		    							  json = json.substring(0, json.length-1)+']';
		    			    			  console.log("JSON2:==="+json);
		    			    			  var data = '[{"nickname":"Tiny Ding","imageurl":"http://wx.qlogo.cn/mmopen/vypzhLPqWka4cdIsQHWuU1IrztYcicz1icaibBW2rAoCbDFABK5TtLreFlnwvMbepkVgQDP7LcibcBbIicZ35bUEAbU5EjsCGUmAG/0","carname":"Phoenix"},{"nickname":"Phoenix","imageurl":"http://wx.qlogo.cn/mmopen/xJhQocZic7og1LicJVqXSc21aOPOUFDH0rBc3akeQkoU5kePONwWDKjmhqXv5W39rUKkHv83Uec3iaKPeZ5YZ8H2xqW4zueShRf/0","carname":"Phoenix"}]';
		    			    			  res.render('sign_up_list', {data});
		    						  }
		    					  }
		    				  });
		    			  });	
	    			  }
	    		  });
    		  }
    	  });    
      } else {
        console.log(response.statusCode);
      }
    });
  });

  app.post('/add_publish_game', function(req, res, next) {
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    console.log("Start time is :" + startTime + " , end time is :" + endTime);
    addPublishGame(startTime, endTime);
  });

  app.get('/wx_login', function(req, res, next) {
    // 第一步：用户同意授权，获取code
    var get_code = 'get_wx_access_token';
    // 这是编码后的地址
    var return_uri = 'http%3A%2F%2Fec2-34-210-237-255.us-west-2.compute.amazonaws.com%2F'
        + get_code;
//    console.log('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + context.appid
//        + '&redirect_uri=' + return_uri + '&response_type=code&scope=' + scope
//        + '&state=STATE#wechat_redirect');

    var scope = 'snsapi_userinfo';

    res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + context.appid
        + '&redirect_uri=' + return_uri + '&response_type=code&scope=' + scope
        + '&state=STATE#wechat_redirect');
  });

  app.get('/get_wx_access_token', function(req, res, next) {
    // 第二步：通过code换取网页授权access_token
    var code = req.query.code;
    request.get({
      url : 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + context.appid + '&secret='
          + context.secret + '&code=' + code + '&grant_type=authorization_code',
    }, function(error, response, body) {
      if (response.statusCode == 200) {
    	  
    	  console.log("RESPONSE1："+response);

        // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
          body = body.toString("utf-8");
        var data = JSON.parse(body);
        var access_token = data.access_token;
        var openid = data.openid;

        request.get({
          url : 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid='
              + openid + '&lang=zh_CN',
        }, function(error, response, body) {
          if (response.statusCode == 200) {
        	  
        	  console.log("RESPONSE2："+response);

             body = body.toString("utf-8");
            // 第四步：根据获取的用户信息进行对应操作
            var userinfo = JSON.parse(body);
          //   console.log(JSON.parse(body));
            console.log('获取微信信息成功！');
            var nickname = userinfo.nickname;
            var imgurl = userinfo.headimgurl;
            var promise = mongoose.findStartedGame();
            var promise2 = mongoose.findEndedGame();
 
             promise.then(function(result) {
               if(result != null) {
                  var promise3 = mongoose.findUserByOpenId(openid, result);
                  promise3.then(function(result2) {
                    if(result2 != null) {
                       res.redirect('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/cancel_sign_up?openid=' + openid);
                    } else {
                       console.log(imgurl);
                       res.redirect('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/?openid=' + openid + '&nickname=' + escape(nickname) + '&headimgurl=' + imgurl);
                    }
                  });
               } else {
                 promise2.then(function(result3){
                   if(result3 != null) {
                      res.redirect('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/show_sign_result');
                   } else {
                      res.redirect('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/no_action');
                   }
                 });
               }
             });
          } else {
            console.log(response.statusCode);
          }
        });
      } else {
        console.log(response.statusCode);
      }
    });
  });
  
}

setInterval(mongoose.setGameStatusEnded,24*60*60*1000);
//setInterval(mongoose.setGameStatusEnded,60*1000);

function addPublishGame(startTime, endTime) {
  mongoose.insertPublishGame(startTime, endTime);
};

function gameStarted(game){
  if(game == null){
    return false;
  }
  var isStarted = false;
  if("Started" == game.gameStatus.replace(/(^\s*)|(\s*$)/g, "")){
    isStarted = true;
  }
  return isStarted;
}

function Format(dateTime){
  var date = dateTime.replace('T',' ').substring(0,19);
  return date;
}
