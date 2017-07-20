var https = require('https');
var qs = require('querystring');
var express = require("express");
var path=require('path');
var app = express();
server  = require('http').Server(app);
app.set('views',__dirname);    // config view 
app.set('view engine', 'html'); 
app.engine( '.html', require( 'ejs' ).__express );

var context = {};
require('./initiator')(context);
require('./router')(app, context);      //router config file

server.listen(80,function(){
console.log('App start,port 80.');
});