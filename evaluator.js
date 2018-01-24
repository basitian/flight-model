'use strict';
let model = require('./model.js');
let airports = require('./airports.json');

let args = process.argv.slice(2);
let acType = args[0] || 'A320';

let findDuplicates = (result) => {
    let duplicates = 0;
    for (let i = 0; i < result.length; i ++) {
        let status = result[i];
        if (status.status === 'AIRBORNE' && status.beginStatusLocation.code === status.endStatusLocation.code) {
            duplicates = duplicates + 1;
        }
    }
    return duplicates;
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
    for (let i = 1; i < result.length; i++) {
        let status = result[i];
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
    for (let i = 1; i < 1000; i++) {
        let result = model.determineStatus(acType);
        timeErrors = timeErrors + findWrongTime(result);
        airportDuplicates = airportDuplicates + findDuplicates(result);
        timeOverlaps = timeOverlaps + findTimeOverlap(result);
    }
    console.log('Number of duplicates: ' + airportDuplicates);
    console.log('Number of time errors: ' + timeErrors);
    console.log('Number of time overlaps: ' + timeOverlaps);
};

evaluate();