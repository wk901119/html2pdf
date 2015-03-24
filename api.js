
var url = require('url'),
 	restify = require('restify'),
 	request = require('request'),
	winston	 = require('winston'),
	wkhtmltox = require('wkhtmltox'),
	converter = new wkhtmltox();

exports.createServer = function(port) {
	var server = restify.createServer();

	server.use(restify.bodyParser());
	server.use(restify.CORS());

	server.post('/', function create(req, res, next) {

		res.header("Access-Control-Allow-Origin", "*");
    	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	
		winston.info('Incoming Request', {url: req.url});

	    var options = req.params;

	    if (!options || !options.url || !isUrl(options.url)) {
	    	res.send(400, new Error('Bad json options sent.. requires { "url": "http://urltopdf.com"}'))
	    }

	    res.header('Content-Type', 'application/pdf');

	 	winston.info('Retrieving HTML from ' + options.url);

	 	var htmlRequest = request(options.url);
	 	var pdfOptions = url.parse(req.url, true).query;

	 	winston.info('With PDF options ' + JSON.stringify(pdfOptions));

	 	converter.pdf(request.get(options.url), pdfOptions).pipe(res);

	    
	});
    
	if (port) {
		server.listen(port);
	}

};

function isUrl(s) {
	var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}
