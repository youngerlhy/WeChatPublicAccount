var https = require('https');
var qs = require('querystring');

function getAccessToken(context){
  var parameters = {
    grant_type: "client_credential",
    appid: "wx06b3b86f63137f4f",
    secret: "15faf94a01a96db4567af88de17ae998"
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
    });

  }).on('error', (e) => {
    console.error(e);
  });
};

function createButtons(context){
  if (!context.accessToken) {
      setTimeout(createButtons, 0, context);
      return;
  }
  console.log("init button with token:", context.accessToken);

  var postData = qs.stringify({
     "button":[
      {
           "name":"badminton",
           "sub_button":[
           {
               "type":"click",
               "name":"sign up",
               "url":"http://ec2-34-210-237-255.us-west-2.compute.amazonaws.com:80/",
               "key":"sign up"
            }]
       }]
  });
  
  var options = {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path: "/cgi-bin/menu/create?access_token=" + context.accessToken,
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
}

module.exports = function(context){
  getAccessToken(context);
  setInterval(getAccessToken, 7100 * 1000, context);
  setTimeout(createButtons, 0, context);
};
