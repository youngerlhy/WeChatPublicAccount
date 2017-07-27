var https = require('https');
var qs = require('querystring');

var createButtons = require('./createButtons');
var initTags = require('./initTags');

function getAccessToken(callback) {
	console.log('Start to get access token ...');

	var parameters = {
		grant_type : "client_credential",
		appid : context.appid,
		secret : context.secret
	};

	var parametersAsString = qs.stringify(parameters);
	var url = "https://api.weixin.qq.com/cgi-bin/token?" + parametersAsString;

	https.get(url, function(res) {
		console.log('statusCode:', res.statusCode);
		console.log('headers:\n', res.headers);

		res.on('data', function(data) {
			var result = JSON.parse(data);
			if (result.errcode && 0 != result.errcode) {
				console.error(result.errmsg);
				return;
			}
			console.log("access token:\n", result.access_token);
			context.accessToken = result.access_token;
			if (typeof callback == "function") {
				callback();
			}
			;
		});

	}).on('error', function(e) {
		console.error(e);
	});
};

function onTokenReady() {
	initTags(createButtons);
};

module.exports = function() {
	getAccessToken(onTokenReady);
	setInterval(getAccessToken, 7100 * 1000);
};
