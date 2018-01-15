'use strict';
let airports = require('./airports.json');
let aircrafts = require('./ac_types.json');
let defineProbability = require('./define-probability');
let statusProbs = require('./status-prob.json');

let status = Object.freeze({
    AIRBORNE: {
        name: "AIRBORNE",
    },
    GROUND_OPS: {
        name: "GROUND_OPS",
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
let routeType = Object.freeze({
    LONG_DISTANCE: {
        name: 'LONG_DISTANCE',
        speed: 14.502
    },
    MIDDLE_DISTANCE: {
        name: 'MIDDLE_DISTANCE',
        speed: 11.986
    },
    SHORT_DISTANCE: {
        name: 'SHORT_DISTANCE',
        speed: 8.729
    }
});

exports.determineStatus = aircraft => {
    let statusList = [];
    let predecessor = null;
    for (let i = 0; i < 5; i++) {
        let status = new Status(aircraft, predecessor);
        statusList.push(status);
        predecessor = status;
    }
    return statusList;
};

class Status {
    constructor(aircraft, predecessor) {
        this.determineStatusType(predecessor);
        this.detailName = 'AircraftStatus';
        this.updatedTimestamp = null;
        this.eventType = null;
        this.eventName = null;

        let acFlightType = this.determineFlightType(aircraft);
        this.determineAirports(predecessor, acFlightType);
        this.determineTimes(predecessor, acFlightType);
        this.beginStatusLocation = new Airport(this.beginStatusLocation.airport_code);
        this.endStatusLocation = new Airport(this.endStatusLocation.airport_code);
    }

    determineStatusType(predecessor) {
        if (predecessor !== null) {
            this.aircraftId = predecessor.aircraftId;
            if (predecessor.status === status.AIRBORNE.name) {
                this.currentFlightNoIcao = null;
                this.currentFlightNo = null;
                this.status = defineProbability(statusProbs);
            } else {
                this.setAirborne();
            }
        } else {
            this.aircraftId = Math.floor((Math.random() * 899999999) + 100000000);
            this.setAirborne();
        }
    }

    setAirborne() {
        this.status = status.AIRBORNE.name;
        let flightNo = Math.floor((Math.random() * 8999) + 1000);
        this.currentFlightNo = 'AV' + flightNo;
        this.currentFlightNoIcao = 'AVI' + flightNo;
    }

    determineFlightType(aircraft) {
        let flightType = aircrafts.find(ac => {
            return ac.ac_type_name === aircraft;
        });
        return flightType.type;
    };

    determineAirports(predecessor, acFlightType) {
        let airportList = airports;
        if (predecessor !== null) {
            this.beginStatusLocation = airportList.find(port => {
                return port.airport_code === predecessor.endStatusLocation.code;
            });
        } else {
            let randomIndex = Math.floor(Math.random() * airports.length);
            this.beginStatusLocation = airportList[randomIndex];
        }
        if (this.status === status.AIRBORNE.name) {
            let indexToRemove = airportList.indexOf(this.beginStatusLocation);
            airportList.splice(indexToRemove, 1);
            while (this.endStatusLocation === undefined) {
                let randomIndex = Math.floor(Math.random() * airports.length);
                let airport = airportList[randomIndex];
                if (this.validateFlightType(acFlightType, this.beginStatusLocation, airport) === true) {
                    this.endStatusLocation = airport;
                }
            }
        } else {
            this.endStatusLocation = this.beginStatusLocation;
        }
    }

    validateFlightType(acFlightType, dep, arr) {
        let distance = calculateDistance(dep, arr);
        return (acFlightType === this.determineDistanceType(distance));
    }


    determineDistanceType(distance) {
        let flightType;
        if (distance > 5000) {
            flightType = routeType.LONG_DISTANCE.name;
        } else if (distance > 2000) {
            flightType = routeType.MIDDLE_DISTANCE.name;
        } else {
            flightType = routeType.SHORT_DISTANCE.name;
        }
        return flightType;
    }

    determineTimes(predecessor, flightType) {
        if (predecessor !== null) {
            this.beginStatusTime = predecessor.endStatusTime;
        } else {
            this.beginStatusTime = new Date();
        }
        let duration;
        switch (this.status) {
            case status.AIRBORNE.name:
                let distance = calculateDistance(this.beginStatusLocation, this.endStatusLocation);
                let flightSpeed;
                switch (flightType) {
                    case routeType.LONG_DISTANCE.name:
                        flightSpeed = routeType.LONG_DISTANCE.speed;
                        break;
                    case routeType.MIDDLE_DISTANCE.name:
                        flightSpeed = routeType.MIDDLE_DISTANCE.speed;
                        break;
                    case routeType.SHORT_DISTANCE.name:
                        flightSpeed = routeType.SHORT_DISTANCE.speed;
                        break;
                }
                duration = Math.floor(distance / flightSpeed);
                break;
            case status.MAINTENANCE.name:
                duration = status.MAINTENANCE.duration;
                break;
            case status.GROUND_OPS.name:
                duration = status.GROUND_OPS.duration;
                break;
            case status.OVERHAUL.name:
                duration = status.OVERHAUL.duration;
                break;
            case status.UNPLANNEDMAINTENANCE.name:
                duration = status.UNPLANNEDMAINTENANCE.duration;
                break;
            default:
                duration = status.UNKNOWN;
        }
        this.endStatusTime = new Date(this.beginStatusTime.getTime() + (duration * 60000));
    };
}

let calculateDistance = (dep, arr) => {
    const EARTH_RADIUS_KM = 6371.009;

    let lat1Rad = degreesToRadians(dep.latitude);
    let long1Rad = degreesToRadians(dep.longitude);
    let lat2Rad = degreesToRadians(arr.latitude);
    let long2Rad = degreesToRadians(arr.longitude);

    let centralAngle = Math.acos((Math.sin(lat1Rad) * Math.sin(lat2Rad)) +
        (Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(Math.abs(long1Rad - long2Rad))));
    return centralAngle * EARTH_RADIUS_KM;
};

let degreesToRadians = (number) => {
    return (number * (Math.PI / 180));
};

class Airport {
    constructor(code) {
        this.code = code;
        this.href = "/airports/" + code;
    }
}