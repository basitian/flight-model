'use strict';
let airports = require('./airports.json');
let aircrafts = require('./ac_types.json');

exports.determineStatus = aircraft => {
    let statusList = [];
    let predecessor = null;
    for (let i = 0; i < 5; i++) {
        let status = new Status(aircraft, predecessor);
        statusList.push(status);
        console.log(JSON.stringify(status));
        predecessor = status;
    }
    return statusList;
};

class Status {
    constructor(aircraft, predecessor) {
        if (predecessor !== null ) {
            this.aircraftId = predecessor.aircraftId;
        } else {
            this.aircraftId = Math.floor((Math.random() * 899999999) + 100000000);
        }
        this.detailName = "AircraftStatus";
        this.updatedTimestamp = 0;
        this.status = "AIRBORNE";
        let flightNo = Math.floor((Math.random() * 8999) + 1000);
        this.currentFlightNo = "AV" + flightNo;
        this.currentFlightNoIcao = "AVI" + flightNo;
        this.eventType = null;
        this.eventName = null;

        this.determineAirports(predecessor, aircraft);
        this.determineTimes(predecessor);
    }

    determineAirports(predecessor, aircraft) {
        let airportList = airports;
        if (predecessor !== null) {
            this.beginStatusLocation = predecessor.endStatusLocation;
        } else {
            let randomIndex = Math.floor(Math.random() * airports.length);
            this.beginStatusLocation = new Airport(airportList[randomIndex].airport_code);
        }
        if (this.status === 'AIRBORNE') {
            let depAirport = airportList.find(port => {
                return port.airport_code === this.beginStatusLocation.code;
            });
            let indexToRemove = airportList.indexOf(depAirport);
            airportList.splice(indexToRemove, 1);
            while (this.endStatusLocation === undefined) {
                let randomIndex = Math.floor(Math.random() * airports.length);
                let airport = airportList[randomIndex];
                if (this.validateFlightType(aircraft, depAirport, airport) === true) {
                    this.endStatusLocation = new Airport(airport.airport_code);
                }
            }
        } else {
            this.endStatusLocation = new Airport(this.beginStatusLocation.code);
        }
    }

    validateFlightType(aircraft, dep, arr) {
        let routeType;
        let distance = Math.floor(Math.sqrt((Math.pow((dep.longitude - arr.longitude), 2) + Math.pow((dep.latitude - arr.latitude), 2))));
        if (distance > 50) {
            routeType = "LONG_DISTANCE";
        } else if (distance > 10) {
            routeType = "MIDDLE_DISTANCE";
        } else {
            routeType = "SHORT_DISTANCE";
        }
        return (this.determineFlightType(aircraft) === routeType);
    }


    determineFlightType(aircraft) {
        let flightType = aircrafts.find(ac => {
            return ac.ac_type_name === aircraft;
        });
        return flightType.type;
    };

    determineTimes(predecessor) {
        if (predecessor !== null) {
            this.beginStatusTime = predecessor.endStatusTime;
        } else {
            this.beginStatusTime = new Date();
        }
        this.endStatusTime = new Date(this.beginStatusTime.getTime() + (Math.floor((Math.random() * 64800000) + 60000)));
    };
}

class Airport {
    constructor(code) {
        this.code = code;
        this.href = "/airports/" + code;
    }
}