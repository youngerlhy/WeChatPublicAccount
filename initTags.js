var https = require('https');
var fs = require('fs');

var FILE = __dirname + "/adminList.json";

function queryTagIdAndCreateIfNotExist(tagName, callback) {
	console.log('Start to query if tag %s is created ...', tagName);

	var options = {
		hostname : 'api.weixin.qq.com',
		port : 443,
		path : "/cgi-bin/tags/get?access_token=" + context.accessToken,
		method : 'GET',
		headers : {
			'Content-Type' : 'application/json; charset=utf-8'
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
			for ( var each in result.tags) {
				if (tagName === result.tags[each].name) {
					console.log("tag already created, tagId = ",
							result.tags[each].id);
					putTagId(tagName, result.tags[each].id);
					callback();
					return;
				}
			}
			console.log("tag not yet present");
			creatTags(tagName, callback);
		});
	});
	req.on('error', function(e) {
		console.error(e);
	});
	req.end();
};

function creatTags(tagName, callback) {
	console.log('Start to create Tag %s ...', tagName);
	var postData = JSON.stringify({
		"tag" : {
			"name" : tagName
		}
	});

	var options = {
		hostname : 'api.weixin.qq.com',
		port : 443,
		path : "/cgi-bin/tags/create?access_token=" + context.accessToken,
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
			console.log("tagId = ", result.tag.id);
			putTagId(tagName, result.tag.id);
			callback();
		});
	});
	req.on('error', function(e) {
		console.error(e);
	});
	req.write(postData);
	req.end();
};

function putTagId(tagName, tagId) {
	if (!context.tags) {
		context.tags = {};
	}
	eval("context.tags." + tagName + "=" + tagId);
};

function tagAdminGroup() {
	console.log('Start to tag admin group ...');
	
	var postDataObj = JSON.parse(fs.readFileSync(FILE));
	postDataObj.tagid = context.tags[ADMIN_TAG_NAME];
	var postData = JSON.stringify(postDataObj);

	var options = {
		hostname : 'api.weixin.qq.com',
		port : 443,
		path : "/cgi-bin/tags/members/batchtagging?access_token=" + context.accessToken,
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
			console.log("tag admin group result:\n", result);
			if (result.errcode && 0 != result.errcode) {
				console.error(result.errmsg);
				return;
			}
		});
	});
	req.on('error', function(e) {
		console.error(e);
	});
	req.write(postData);
	req.end();
};

function deleteTags(tagName, callback) {
	console.log('Start to delete Tag %s ...', tagName);
	var postData = JSON.stringify({
		"tag" : {
			"id" : 101
		}
	});

	var options = {
		hostname : 'api.weixin.qq.com',
		port : 443,
		path : "/cgi-bin/tags/delete?access_token=" + context.accessToken,
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

module.exports = function(callback) {
	function callbackExt2() {
		tagAdminGroup();
		callback();
	};
	
	queryTagIdAndCreateIfNotExist(ADMIN_TAG_NAME, callbackExt2);
};