// Create web server
// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var comments = require('./comments');

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(), unescape(uri));
    console.log('Loading ' + uri);
    var stats;

    try {
        stats = fs.lstatSync(fileName);
    } catch (e) {
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write('404 Not Found');
        res.end();
        return;
    }

    if (stats.isFile()) {
        var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, {'Content-type': mimeType});
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            'Location': 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {'Content-type': 'text/plain'});
        res.write('500 Internal Error');
        res.end();
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');

// Path: comments.js
// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var comments = require('./comments');

http.createServer(function (req, res) {
    var urlParts = url.parse(req.url);
    console.log(urlParts);
    if (urlParts.pathname === '/getComments') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.write(JSON.stringify(comments.getComments()));
        res.end();
    } else if (urlParts.pathname === '/addComment') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var newComment = JSON.parse(body);
            comments.addComment(newComment);
            res.end();
        });
    }
