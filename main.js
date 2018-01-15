'use strict';
let model = require('./model.js');
let http = require('http');
let url = require('url');

http.createServer(function (req, res) {
    let q = url.parse(req.url, true).query;
    if (q.type == null) {
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end('Parameter type is missing!');
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(model.determineStatus(q.type)));
    }
}).listen(8080);
