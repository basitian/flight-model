'use strict';

var fs = require('fs');
var input = require('./input.json');
var airports = require('./airports.json');

var determineStatus = () => {
    console.log('\nDetermining Status\n');
    getDestination();
    console.log('\nFinished\n');
}

var getDestination = () => {
    var matchFound;
    var index = 0;
    var inputAirport = airports.find(port => {
        return port.airport_code === input.departure;
    });

    while (!matchFound) {
        var port = airports[index];
        if (port.airport_code !== inputAirport.airport_code && (getDistance(inputAirport, port) === getAircraftType(input))) {
            matchFound = port;
        } else {
            index++;
        }
    }

    if (!matchFound) {
        console.log('\nNo match found\n');
    } else {
        console.log('\nMatch found: ' + JSON.stringify(port) + '\n');
    }
}

var getDistance = (airport1, airport2) => {
    var distance = Math.sqrt(Math.pow(airport1.longitude - airport2.longitude, 2) + Math.pow(airport1.latitude - airport2.latitude, 2));
    if (distance > 5) {
        if (distance > 10) {
            return 'LONG_DISTANCE';
        } else {
            return 'MIDDLE_DISTANCE';
        }
    } else {
        return 'SHORT_DISTANCE';
    }
}

var getAircraftType = (input) => {
    var type;
    switch(input.type) {
        case "707":  
        case "747":
        case "767":
        case "777":
        case "787":
        case "A310":
        case "A330":
        case "A340":
        case "A350":
        case "A380":
        case "Il-62":
        case "Il-86":
        case "Il-96":
        case "L-1011 TriStar":
        case "MD-11":
        case "DC-10":
        case "Tu-114":
        case "Tu-116":
        case "Tu-144":
            type = 'LONG_DISTANCE';
            break;
        case "A300":
        case "A318":
        case "A319":
        case "A320":
        case "A321":
        case "717":
        case "727":
        case "737 (CFMI)":
        case "737 (JT8D)":
        case "737 (Max)":
        case "737 (NG)":
        case "757":
        case "CSeries":
        case "DC-9":
        case "MD-90":
        case "Superjet 100":
        case "Tu-154":
        case "Tu-204":
        case "Tu-334":
            type = 'MIDDLE_DISTANCE';
            break;
        default:
            type = 'SHORT_DISTANCE';
    }
    return type;
}

class Status {
    constructor(depAirport, arrAirport, start, end) {
        this.depAirport = depAirport;
        this.arrAirport = arrAirport;
        this.start = start;
        this.end = end;
    }
}

determineStatus();