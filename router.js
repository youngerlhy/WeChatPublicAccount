var request = require('request');

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', {});
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
			//success
			res.writeHead(200, {
				'Content-Type' : 'text/plain'
			});
			res.end(echostr);
			return true;
		} else {
			//fail
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
            insertSignUpData(nickname, imageurl, num);
            res.send(nickname + ' ' + imageurl + ' ' + num);
        });
	
	app.get('/wx_login', function(req,res, next){
		//console.log("oauth - login")
	
		// 第一步：用户同意授权，获取code
		var get_code = 'get_wx_access_token';
		// 这是编码后的地址
		var return_uri = 'http%3A%2F%2Fec2-34-210-237-255.us-west-2.compute.amazonaws.com%2F'+get_code;
console.log('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+context.appid+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');
		var scope = 'snsapi_userinfo';
	
		res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+context.appid+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');
	
	});

	app.get('/get_wx_access_token', function(req, res, next){
		//console.log("get_wx_access_token")
		//console.log("code_return: "+req.query.code)
	
		// 第二步：通过code换取网页授权access_token
		var code = req.query.code;
		request.get(
			{   
				url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+context.appid+'&secret='+context.secret+'&code='+code+'&grant_type=authorization_code',
			},
			function(error, response, body){
				if(response.statusCode == 200){
	
					// 第三步：拉取用户信息(需scope为 snsapi_userinfo)
					//console.log(JSON.parse(body));
					var data = JSON.parse(body);
					var access_token = data.access_token;
					var openid = data.openid;
	
					request.get(
						{
							url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
						},
						function(error, response, body){
							if(response.statusCode == 200){
	
								// 第四步：根据获取的用户信息进行对应操作
								var userinfo = JSON.parse(body);
								//console.log(JSON.parse(body));
								console.log('获取微信信息成功！');
	
								// 小测试，实际应用中，可以由此创建一个帐户
							/*	res.send("\
									<h1>"+userinfo.nickname+" 的个人信息</h1>\
									<p><img src='"+userinfo.headimgurl+"' /></p>\
									<p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
								"); */
console.log(openid);
//req.session.openid = openid;
res.redirect('http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/?nickname='+userinfo.nickname+'&headimgurl='+userinfo.headimgurl);
							}else{
								console.log(response.statusCode);
							}
						}
					);
				}else{
					console.log(response.statusCode);
				}
			}
		);
	});
}



function insertSignUpData(name, url, num) {
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/wechatdb';
MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    var collection = db.collection('site');

    var data = [{"nickname":name,"imageurl":url,"seatnum":num}];

    collection.insert(data, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
    });
   db.close();
});
}

