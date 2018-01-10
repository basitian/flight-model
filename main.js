'use strict';
let model = require('./model.js');

let args = process.argv.slice(2);

console.log(JSON.stringify(model.determineStatus(args[0] || 'A320')));