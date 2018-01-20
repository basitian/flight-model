'use strict';
let model = require('./model.js');
let http = require('http');
let url = require('url');

http.createServer((req, res) => {
    let q = url.parse(req.url, true).query;
    if (q.type == null) {
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end('Parameter type is missing!');
    } else {
        try {
            let status = model.determineStatus(q.type);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(status));
        } catch(e) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end(e);
        }

    }
}).listen(8080);
