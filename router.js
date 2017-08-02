var request = require('request');
var mongoose = require('./mongoose');
mongoose.Promise = require('bluebird');

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {});
  });

  app.get('/dailyEnglish', function(req, res) {
    res.render('dailyEnglish', {});
  });
  
   app.get('/newsletter', function(req, res) {
    res.render('newsletter', {});
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

  app.post('/insert_data', function(req, res) {
    var nickname = req.body.nickname;
    var imageurl = req.body.imageurl;
    var num = req.body.seatnum;
    console.log(nickname + " " + imageurl + " " + num);
    mongoose.countUserByName(nickname, function(err, count) {
      if (err)
        return console.log(err);
      if (count == 0) {
        mongoose.insertSignupData(nickname, imageurl, num);
      }
    });
    res.send(nickname + ' ' + imageurl + ' ' + num);
  });

  app.get('/publish_game',function(req, res) {
     console.log('publish a game');
     var get_publish_access_token = 'get_publish_access_token';
     res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx067aa7e646581331&redirect_uri=http%3A%2F%2Fec2-34-210-237-255.us-west-2.compute.amazonaws.com%2F'
          + get_publish_access_token + '&response_type=code&scope=snsapi_base&state=home#wechat_redirect');
  });

  app.get('/get_publish_access_token', function(req, res, next) {
    // 第二步：通过code换取网页授权access_token
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
      // TODO change game status to End
      var show_sign_result = 'show_sign_result';
      res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx067aa7e646581331&redirect_uri=http%3A%2F%2Fec2-34-210-237-255.us-west-2.compute.amazonaws.com%2F'
          + show_sign_result
          + '&response_type=code&scope=snsapi_base&state=home#wechat_redirect');
  });

  app.get('/show_sign_result', function(req, res) {
    // 第二步：通过code换取网页授权access_token
    var code = req.query.code;
    request.get({
      url : 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + context.appid + '&secret='
          + context.secret + '&code=' + code + '&grant_type=authorization_code',
    }, function(error, response, body) {
      if (response.statusCode == 200) {
        var allUsers = getAllUsers();
        var allUsersStr = JSON.parse(allUsers);
        console.log(str);
        res.render('sign_up_list', {allUsersStr});
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
    console.log('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + context.appid
        + '&redirect_uri=' + return_uri + '&response_type=code&scope=' + scope
        + '&state=STATE#wechat_redirect');

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

        // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
        // console.log(JSON.parse(body));
        var data = JSON.parse(body);
        var access_token = data.access_token;
        var openid = data.openid;

        request.get({
          url : 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid='
              + openid + '&lang=zh_CN',
        }, function(error, response, body) {
          if (response.statusCode == 200) {

            // 第四步：根据获取的用户信息进行对应操作
            var userinfo = JSON.parse(body);
            // console.log(JSON.parse(body));
            console.log('获取微信信息成功！');

            res.redirect('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/?nickname='
                + userinfo.nickname + '&headimgurl=' + userinfo.headimgurl);
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

function addPublishGame(startTime, endTime) {
  mongoose.insertPublishGame(startTime, endTime);
};

function getAllUsers() {
  mongoose.findAllUsers()
}
