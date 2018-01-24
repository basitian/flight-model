'use strict';
let model = require('./model.js');
const opn = require('opn');

let args = process.argv.slice(2);

let statusList = model.determineStatus(args[0] || 'A320', args[1] || 5);

let queryString = '';

statusList.forEach(status => {
    let depCode = status.beginStatusLocation.code;
    let arrCode = status.endStatusLocation.code;

    queryString = queryString + depCode + '-' + arrCode + ';';
});

console.log(JSON.stringify(statusList));
opn('http://www.greatcirclemap.com/globe?routes=' + queryString, {wait: false});

