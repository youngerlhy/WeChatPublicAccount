var express = require("express");
var path = require('path');
var app = express();
ADMIN_TAG_NAME = "admin";

app.use(express.static(path.join(__dirname, 'css')));

server = require('http').Server(app);
app.set('views', __dirname); // config view 
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

context = {};
require('./initiator')();
require('./router')(app); //router config file

server.listen(80, function() {
	console.log('App start,port 80.');
});