'use strict';
let model = require('./model.js');
let result;

let findDuplicates = () => {
    let duplicates = 0;
    for (let i = 0; i < result.length; i ++) {
        let status = result[i];
        if (status.beginStatusLocation.code === status.endStatusLocation.code) {
            duplicates = duplicates + 1;
        }
    }
    console.log('Number of duplicates: ' + duplicates);
};

let findWrongTime = () => {
    let timeErrors = 0;
    for (let i = 0; i < result.length; i ++) {
        let status = result[i];
        if (status.beginStatusTime >= status.endStatusTime) {
            timeErrors = timeErrors + 1;
        }
    }
    console.log('Number of time errors: ' + timeErrors);
};

let getAverageFlightTime = () => {
    let time = 0;
    for (let i = 0; i < result.length; i++) {
        let status = result[i];
        time = time + (new Date(status.endStatusTime).getTime() - new Date(status.beginStatusTime).getTime());
    }
    console.log('Average flight duration: ' + time / (60000 * result.length) + ' minutes');
};

let getMinFlightTime = () => {
    let minFlight = result[0];
    for (let i = 1; i < result.length; i++) {
        let status = result[i];
        if (minFlight.endStatusTime >= status.endStatusTime) {
            minFlight = status;
        }
    }
    console.log('Minimum flight time: ' + ((new Date(minFlight.endStatusTime).getTime() - new Date(minFlight.beginStatusTime).getTime()) / 60000) + ' minutes');
};

let getMaxFlightTime = () => {
    let maxFlight = result[0];
    for (let i = 1; i < result.length; i++) {
        let status = result[i];
        if (maxFlight.endStatusTime < status.endStatusTime) {
            maxFlight = status;
        }
    }
    console.log('Maximum flight time: ' + ((new Date(maxFlight.endStatusTime).getTime() - new Date(maxFlight.beginStatusTime).getTime()) / 60000) + ' minutes');
};

let evaluate = () => {
    let statusArray = [];
    for (let i=1; i < 100000; i++ ) {
        statusArray.push(model.determineStatus());
    }
    result = statusArray;
    findDuplicates();
    findWrongTime();
    getAverageFlightTime();
    getMinFlightTime();
    getMaxFlightTime();
};

evaluate();