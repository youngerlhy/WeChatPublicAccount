var https = require('https');
var qs = require('querystring');

function getAccessToken(callback){
  var parameters = {
    grant_type: "client_credential",
    appid: "wx067aa7e646581331",
    secret: "d26907f7504d80d5aea6305db84ec510"
  };

  var parametersAsString = qs.stringify(parameters);
  var url = "https://api.weixin.qq.com/cgi-bin/token?" + parametersAsString;

  https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (data) => {
      var result = JSON.parse(data);
      console.log("access token:", result.access_token);
      context.accessToken = result.access_token;
	  if (typeof callback == "function") {
		callback();
	  };
    });

  }).on('error', (e) => {
    console.error(e);
  });
};

function queryTagIdAndCreateIfNotExist(tagName, accessToken){
  console.log('Start to query if tag %s is created...', tagName);
  
  var options = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: "/cgi-bin/tags/get?access_token=" + accessToken,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  };

  var req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (data) => {
      var result = JSON.parse(data);
      console.log("result:", result);
      for (var each in result.tags) {
          if (tagName === result.tags[each].name) {
              console.log("tag already created, tagId = ", result.tags[each].id);
              return;
          }
      }
      console.log("tag not yet present");
      creatTags(tagName, accessToken);
    });
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
};

function creatTags(tagName, accessToken){
  console.log('Start to create Tag ', tagName);
  var postData = JSON.stringify({
    "tag" : {
      "name" : tagName
    }
  });
  
  var options = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: "/cgi-bin/tags/create?access_token=" + accessToken,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  var req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (data) => {
      var result = JSON.parse(data);
      console.log("result:", result);
      console.log("tagId = ", result.tag.id);
    });
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.write(postData);
  req.end();
};

function createDefaultButtons(accessToken){
  console.log('Start to create default buttons...');
  var postData = JSON.stringify({
     button:[
      {
           name:"活动",
           sub_button:[
           {
               type:"click",
               name:"羽毛球报名",
               url:"http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com:80/",
               key:"sign up"
            }]
       },{
           name:"新闻",
           sub_button:[
           {
               type:"click",
               name:"News In BID",
               url:"",
               key:"News In BID"
            },{
               type:"click",
               name:"Old News",
               url:"",
               key:"Old News"
            }]
       },{
           name:"友链",
           sub_button:[
           {
               type:"click",
               name:"妥尼唠英文",
               url:"",
               key:"Tony English"
            },{
               type:"click",
               name:"Leo Public Account",
               url:"",
               key:"Leo Public Account"
            },{
               type:"click",
               name:"大车车",
               url:"",
               key:"Big Car"
            }]
       }]
  });
  
  var options = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: "/cgi-bin/menu/create?access_token=" + accessToken,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  var req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (data) => {
      var result = JSON.parse(data);
      console.log("result:", result);
    });
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.write(postData);
  req.end();
};

function createConditionalButtons(accessToken){
  console.log('Start to create conditional buttons...');
  var postData = JSON.stringify({
     button:[
       {
           name:"查询口令",
           type:"click",
           key:"query token"
       },{
           name:"发起报名",
           type:"click",
           key:"launch sign up"
       },{
           name:"结束报名",
           type:"click",
           key:"stop sign up"
       }],
     matchrule:{
       tag_id:"2",
     }
  });
  
  var options = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: "/cgi-bin/menu/addconditional?access_token=" + accessToken,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  var req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (data) => {
      var result = JSON.parse(data);
      console.log("result:", result);
    });
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.write(postData);
  req.end();
};

function onTokenReady(){
  queryTagIdAndCreateIfNotExist("主席", context.accessToken);
  createDefaultButtons(context.accessToken);
  //createConditionalButtons(context);
};

module.exports = function(){
  getAccessToken(onTokenReady);
  setInterval(getAccessToken, 7100 * 1000);
};
