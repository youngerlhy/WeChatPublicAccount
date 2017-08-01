var https = require('https');
var fs = require('fs');

var FILE = __dirname + "/buttons.json";

function createDefaultButtons(callback) {
	console.log('Start to create default buttons ...');
	var buttons = JSON.parse(fs.readFileSync(FILE));
	var postData = JSON.stringify(buttons);
    console.log('post data:\n', postData);
	
	var options = {
		hostname : 'api.weixin.qq.com',
		port : 443,
		path : "/cgi-bin/menu/create?access_token=" + context.accessToken,
		method : 'POST',
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Content-Length' : Buffer.byteLength(postData)
		}
	};

	var req = https.request(options, function(res) {
		console.log('statusCode:', res.statusCode);
		console.log('headers:\n', res.headers);

		res.on('data', function(data) {
			var result = JSON.parse(data);
			console.log("result:\n", result);
			if (result.errcode && 0 != result.errcode) {
				console.error(result.errmsg);
				return;
			}
			callback();
		});
	});
	req.on('error', function(e) {
		console.error(e);
	});
	req.write(postData);
	req.end();
};

function createConditionalButtons() {
	console.log('Start to create conditional buttons ...');
	var buttons = JSON.parse(fs.readFileSync(FILE));
	buttons.button[0].sub_button.push({
	    type : "view",
		name : "发起报名",
		url :"http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com/publish_game"
	});
	buttons.button[0].sub_button.push({
	  type : "view",
		name : "结束报名",
		url :"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx067aa7e646581331&redirect_uri=http%3A%2F%2Fec2-34-210-237-255.us-west-2.compute.amazonaws.com%2Fclose_out_game&response_type=code&scope=snsapi_base&state=home#wechat_redirect"
	});
	buttons.matchrule = {
		tag_id : context.tags[ADMIN_TAG_NAME],
	};
	var postData = JSON.stringify(buttons);
    console.log('post data:\n', postData);
	
	var options = {
		hostname : 'api.weixin.qq.com',
		port : 443,
		path : "/cgi-bin/menu/addconditional?access_token="
				+ context.accessToken,
		method : 'POST',
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Content-Length' : Buffer.byteLength(postData)
		}
	};

	var req = https.request(options, function(res) {
		console.log('statusCode:', res.statusCode);
		console.log('headers:\n', res.headers);

		res.on('data', function(data) {
			var result = JSON.parse(data);
			console.log("result:\n", result);
		});
	});
	req.on('error', function(e) {
		console.error(e);
	});
	req.write(postData);
	req.end();
};

module.exports = function() {
	createDefaultButtons(createConditionalButtons);
};