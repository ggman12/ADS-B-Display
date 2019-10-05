//types: "openSky", "FlightXML", "Draw", "Not Live"
var Promises = require('./Promises');
var reqTracker = require('./FlightXMLRequestTracker');
var Calculations = require('./Calculations');

module.exports = function (Planes, FlightXMLOp) {
    let PromisesArray = [];
    let PlanesNotIncluded = [];

    Planes.forEach(element => {
        if (element.type == "openSky") {
            PromisesArray.push(Promises.OpenSky(element.hexcode));
        } else if (element.type == "FlightXML" && FlightXMLOp.option == true) {
            let timerTrue = reqTracker.planeRequest(element);
            if (timerTrue) {
                PromisesArray.push(Promises.FlightXml(element.tailNumber));

            } 
        } else if (element.type == "Draw") {
            PromisesArray.push(Drawing(element))
        } else {
            // PromisesArray.push(NotLive);
            // Doing nothing
        }

    });
    return PromisesArray;
}


async function Drawing(plane) {
    try {
        let totalTime = plane.posData.destination.endTime - plane.posData.destination.startTime;
        let timePassed = Calculations.getCurrentTime() - plane.posData.destination.startTime;
        // let currentTime = Calculations.getCurrentTime() + plane.posData.destination.startTime;
        // let endTime = plane.posData.destination.endTime - plane.posData.destination.startTime;
        let percent = (timePassed / totalTime);
        let startPT = plane.posData.destination.startPt;
        let pathPosition = Calculations.getPositionOnPath(startPT, plane.posData.destination, percent);
        plane.posData.latitude = pathPosition.latitude;

        plane.posData.longitude = pathPosition.longitude;
        console.log(percent);
        if (percent >= 1) {
            plane.type = "Landed"
            plane.posData.destination = undefined;
            console.log("compeleted path 100%")
        }
        let returnPosData = new Promises.posData(pathPosition.latitude, pathPosition.longitude, plane.posData.heading)
        returnPosData.destination = plane.posData.destination;
        return returnPosData;

    } catch (error) {
        plane.type = "openSky"

        return error;
    }
}