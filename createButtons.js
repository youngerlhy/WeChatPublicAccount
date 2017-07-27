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
		name : "发起报名",
		type : "click",
		key : "launch sign up"
	});
	buttons.button[0].sub_button.push({
		name : "结束报名",
		type : "click",
		key : "stop sign up"
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