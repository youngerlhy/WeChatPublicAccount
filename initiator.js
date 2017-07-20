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

module.exports = function(context){
  getAccessToken(context);
  setInterval(getAccessToken, 7100 * 1000, context);
};