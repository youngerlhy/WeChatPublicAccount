module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', {});
	});
	
	app.get('/tony', function(req, res) {
		res.render('tony', {});
	});
	
	app.get('/leo', function(req, res) {
		res.render('leo', {});
	});
	app.get('/affleck', function(req, res) {
		res.render('affleck', {});
	});
	app.get('/interface', function(req, res) {
		var token = "falcon";
		var signature = req.query.signature;
		var timestamp = req.query.timestamp;
		var echostr = req.query.echostr;
		var nonce = req.query.nonce;

		var oriArray = new Array();
		oriArray[0] = nonce;
		oriArray[1] = timestamp;
		oriArray[2] = token;
		oriArray.sort();

		var original = oriArray.join('');

		var jsSHA = require('jssha');
		var shaObj = new jsSHA("SHA-1", "TEXT");
		shaObj.update(original);
		var scyptoString = shaObj.getHash("HEX");

		if (signature == scyptoString) {
			//success
			res.writeHead(200, {
				'Content-Type' : 'text/plain'
			});
			res.end(echostr);
			return true;
		} else {
			//fail
			res.writeHead(400, {
				'Content-Type' : 'text/plain'
			});
			res.end("fail");
			return false;
		}
	});
	app.post('/interface', function(req, res) {
	});
}