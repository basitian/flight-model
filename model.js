'use strict';
let airports = require('./airports.json');

exports.determineStatus = () => {
    let status = new Status(getDestination().airport_code, getDestination().airport_code, new Date(), getEnd());
    console.log(JSON.stringify(status));
    return status;
};

let getDestination = () => {
    let randomIndex = Math.floor(Math.random() * airports.length);
    return airports[randomIndex];
};

let getEnd = () => {
    let now = new Date();
    return new Date(now.getTime() + (Math.floor((Math.random() * 64800000) + 60000)));
};

class Status {
    constructor(depAirport, arrAirport, start, end) {
        this.aircraftId = "123498765";
        this.detailName = "AircraftStatus";
        this.updatedTimestamp = 0;
        this.status = "AIRBORNE";
        this.beginStatusTime = start;
        this.endStatusTime = end;
        this.beginStatusLocation = new Airport(depAirport);
        this.endStatusLocation = new Airport(arrAirport);
        this.currentFlightNo = "AV1234";
        this.currentFlightNoIcao = "AVI1234";
        this.eventType = null;
        this.eventName = null;
    }
}

class Airport {
    constructor(code) {
        this.code = code;
        this.href = "/airports/" + code;
    }
}