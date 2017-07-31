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
	appid: "wx067aa7e646581331",
	secret: "d26907f7504d80d5aea6305db84ec510"
};
require('./initiator')();
require('./mongoose');
require('./router')(app); //router config file

server.listen(80, function() {
	console.log('App start,port 80.');
});
