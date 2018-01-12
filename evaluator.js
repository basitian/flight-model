'use strict';
let model = require('./model.js');
let airports = require('./airports.json');

let args = process.argv.slice(2);
let acType = args[0] || 'A320';

let statusList = Object.freeze({
    AIRBORNE: {
        name: "AIRBORNE",
    },
    ONGROUND: {
        name: "ONGROUND",
        duration: 183
    },
    MAINTENANCE: {
        name: "MAINTENANCE",
        duration: 732
    },
    OVERHAUL: {
        name: "OVERHAUL",
        duration: 0
    },
    UNPLANNEDMAINTENANCE: {
        name: "UNPLANNEDMAINTENANCE",
        duration: 0
    },
    UNKNOWN: {
        name: "UNKNOWN",
        duration: 0
    }
});

let findLocationErrors = (result) => {
    let duplicates = 0;
    for (let i = 0; i < result.length; i++) {
        let status = result[i];
        if (status.status === statusList.AIRBORNE.name) {
            if (status.beginStatusLocation.code === status.endStatusLocation.code) {
                duplicates = duplicates + 1;
            }
        } else {
            if (status.beginStatusLocation.code !== status.endStatusLocation.code) {
                duplicates = duplicates + 1;
            }
        }
    }
    return duplicates;
};

let findWrongTime = (result) => {
    let timeErrors = 0;
    for (let i = 0; i < result.length; i++) {
        let status = result[i];
        if (status.beginStatusTime > status.endStatusTime) {
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

let findDurationErrors = (result) => {
    let durationErrors = 0;
    for (let i = 0; i < result.length; i++) {
        let status = result[i];
        let duration = (status.endStatusTime - status.beginStatusTime) / 60000;
        let statusType = statusList[status.status];
        if (duration !== statusType.duration && statusType !== statusList.AIRBORNE) {
            durationErrors = durationErrors + 1;
        }
    }
    return durationErrors;
};

let evaluate = () => {
    let timeErrors = 0;
    let locationErrors = 0;
    let timeOverlaps = 0;
    let durationErrors = 0;
    for (let i = 0; i < 1; i++) {
        let result = model.determineStatus(acType);
        timeErrors = timeErrors + findWrongTime(result);
        locationErrors = locationErrors + findLocationErrors(result);
        timeOverlaps = timeOverlaps + findTimeOverlap(result);
        durationErrors = durationErrors + findDurationErrors(result);
    }
    console.log('Number of location errors: ' + locationErrors);
    console.log('Number of time errors: ' + timeErrors);
    console.log('Number of time overlaps: ' + timeOverlaps);
    console.log('Number of duration Errors: ' + durationErrors);
};

evaluate();