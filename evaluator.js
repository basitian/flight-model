'use strict';
let model = require('./model.js');
let aircrafts = require('./ac_types.json');
let airports = require('./airports.json');

let acType = process.env.AC_TYPE || 'A320';

let findDuplicates = (result) => {
    let duplicates = 0;
    for (let i = 0; i < result.length; i ++) {
        let status = result[i];
        if (status.beginStatusLocation.code === status.endStatusLocation.code) {
            duplicates = duplicates + 1;
        }
    }
    return duplicates;
};

let findFlightTypeErrors = (result) => {
    let acFlightType = aircrafts.find(ac => {
        return ac.ac_type_name === acType;
    }).type;

    let typeErrors = 0;
    for (let i = 0; i < result.length; i++) {
        let status = result[i];
        let statusDep = status.beginStatusLocation.code;
        let dep = airports.find(port => {
            return port.airport_code === statusDep.toString();
        });
        console.log(JSON.stringify(dep));
        let arr = airports.find(port => {
            return port.airport_code === status.endStatusLocation.code;
        });
        if (acFlightType !== determineDistance(dep, arr)) {
            typeErrors = typeErrors + 1;
        }
    }
    return typeErrors;
};

let determineDistance = (dep, arr) => {
    let routeType;
    let distance = calculateDistance(dep.latitude, dep.longitude, arr.latitude, arr.longitude);
    if (distance > 5000) {
        routeType = "LONG_DISTANCE";
    } else if (distance > 2000) {
        routeType = "MIDDLE_DISTANCE";
    } else {
        routeType = "SHORT_DISTANCE";
    }
    return routeType;
};

let calculateDistance = (lat1, long1, lat2, long2) => {

    const EARTH_RADIUS_KM = 6371.009;

    let lat1Rad = degreesToRadians(lat1);
    let long1Rad = degreesToRadians(long1);
    let lat2Rad = degreesToRadians(lat2);
    let long2Rad = degreesToRadians(long2);

    let centralAngle = Math.abs(Math.atan(Math.sqrt(Math.pow(Math.cos(lat2Rad) *
        Math.sin(Math.abs(long1Rad - long2Rad)), 2) +
        Math.pow((Math.cos(lat1Rad) * Math.sin(lat2Rad)) - (Math.sin(lat1Rad) * Math.cos(lat2Rad) *
            Math.cos(Math.abs(long1Rad - long2Rad))), 2)) /
        ((Math.sin(lat1Rad) * Math.sin(lat2Rad)) + (Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.cos(Math.abs(long1Rad - long2Rad))))));
    return centralAngle * EARTH_RADIUS_KM;
};

let degreesToRadians = (number) => {
    return (number * (Math.PI / 180));
};

let findWrongTime = (result) => {
    let timeErrors = 0;
    for (let i = 0; i < result.length; i ++) {
        let status = result[i];
        if (status.beginStatusTime >= status.endStatusTime) {
            timeErrors = timeErrors + 1;
        }
    }
    return timeErrors;
};

let findTimeOverlap = (result) => {
    let timeErrors = 0;
    for (let i = 0; i < result.length; i++) {
        let status = result[i];
        if (i === 0) {
            continue;
        }
        let predecessor = result[i - 1];
        if (status.beginStatusTime !== predecessor.endStatusTime) {
            timeErrors = timeErrors + 1;
        }
    }
    return timeErrors;
};


let evaluate = () => {
    let timeErrors = 0;
    let airportDuplicates = 0;
    let timeOverlaps = 0;
    let flightTypeErrors = 0;
    for (let i = 1; i < 1000; i++) {
        let result = model.determineStatus(acType);
        timeErrors = timeErrors + findWrongTime(result);
        airportDuplicates = airportDuplicates + findDuplicates(result);
        timeOverlaps = timeOverlaps + findTimeOverlap(result);
        // Does not work yet!
        // flightTypeErrors = flightTypeErrors + findFlightTypeErrors(result);
    }
    console.log('Number of duplicates: ' + airportDuplicates);
    console.log('Number of time errors: ' + timeErrors);
    console.log('Number of time overlaps: ' + timeOverlaps);
    console.log('Number of flight type errors: ' + flightTypeErrors);
};

evaluate();