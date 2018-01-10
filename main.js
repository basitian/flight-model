'use strict';
let model = require('./model.js');

let acType = process.env.AC_TYPE || 'A320';

model.determineStatus(acType);