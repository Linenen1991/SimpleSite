var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
    console.log('request ', request.url);

    if(request.url == '/')
    {
        var body = '';
        fs.readdir('./FileServer/', (err, files) => {
            files.forEach(file => {
                encodedfile = encodeURIComponent(file);
                body += '<p><a href="./' + encodedfile + '">' + file + "\r\n";
            });
            var header = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">';
            var indexhtml = '<!DOCTYPE html>' + '<html><head>' + header + '</head><body>' + body + '</body></html>';
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(indexhtml, 'utf-8');
        });
        return;
    }
    var filePath = '.' + '/FileServer/' + request.url;

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.pdf': 'application/pdf',
	'.epub':'application/epub+zip',
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    // console.log(filePath);
    filePath =  decodeURIComponent(filePath);
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(8125);

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}
console.log('Server running at http://' + results['乙太網路'] + ':8125/');
