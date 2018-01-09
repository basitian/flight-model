'use strict';
let model = require('./model.js');

// Just for testing
let airports = require('./airports');
let acType = process.env.AC_TYPE || 'A320';

let lax = airports.find(port => {
   return port.airport_code === 'LAX';
});
let fra = airports.find(port => {
    return port.airport_code === 'FRA';
});
let distance = Math.floor(Math.sqrt((Math.pow((lax.longitude - fra.longitude), 2) + Math.pow((lax.latitude - fra.latitude), 2))));
console.log(distance);

// Real shit!
//model.determineStatus(acType);