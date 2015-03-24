var url = require('url');
var http = require('http');
var wkhtmltox = require('wkhtmltox');
var converter = new wkhtmltox();

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/pdf'});
    converter.pdf(req, url.parse(req.url, true).query).pipe(res);
}).listen(8080, '127.0.0.1');

console.log('Server running at http://127.0.0.1:8080/');
