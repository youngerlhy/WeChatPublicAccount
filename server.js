var express = require("express");
var path = require('path');
var app = express();
ADMIN_TAG_NAME = "admin";

app.use(express.static(path.join(__dirname, 'public')));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

server = require('http').Server(app);
app.set('views', __dirname); // config view 
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

context = {	
	appid: "wxb860e1a1c1845529",
	secret: "ac4e9563cfbc194feef871831d342d76"
};
require('./initiator')();
require('./router')(app); //router config file

server.listen(80, function() {
	console.log('App start,port 80.');
});
