//types: "openSky", "FlightXML", "Draw", "Not Live"
exports.flightXMLCount = 0;
// OpenSky promise with resolve reject 
const request = require('request-promise');

var planePath = require('./PlanePath');
exports.posData = function(latitude, longitude, heading, destination) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.heading = heading;
    this.destination = destination;
}


var OpenSkyUrl = "https://@opensky-network.org/api/states/all?icao24="

exports.OpenSky = async function (hexcode) {
    
    try {
        let planeUrl = OpenSkyUrl + hexcode;
        var Openres = await request({
            url: planeUrl,
            method: 'GET',
            timeout: 10000
        });

    } catch (e) {
        return Promise.reject(new Error('failed url request'))
    }

    let parsedData = JSON.parse(Openres);
    let data = parsedData.states;

    try {
        let states = data[0];
        let myposData = new exports.posData();
        myposData.latitude = states[6];
        myposData.longitude = states[5];
        myposData.heading = states[10];
        return {myposData, hexcode};
    } catch (e) {
        
        return Promise.reject(new Error(e));
    }






}

var flightxmlurlbasic = "https://flightxml.flightaware.com/json/FlightXML2/SearchBirdseyeInFlight?";
var username = "goodejonah3";
var apiKey = "9a453d7ce012f1b0e2b5a8a190d1fec018aefbe1";

exports.FlightXml = async function (tailNum) {
    return Promise.reject();
    exports.flightXMLCount++;
    let data;
    // let planeUrl = flightxmlurlbasic + "query=" + tailNum + "&howMany=1&offset=0";
    try {
        let propObject = {
            howMany: 1,
            query: "{ident_or_reg {" + tailNum + "}}"
        }
        var res = await request({
            url: flightxmlurlbasic,
            qs: propObject,
            auth: {
                username: username,
                password: apiKey
            }
    
        });
    }
    catch (error) {
        console.log(error);
        return Promise.reject(new Error('failed flightxml request'))

    }
    try {
        let parsedRes = JSON.parse(res);
        data = parsedRes["SearchBirdseyeInFlightResult"].aircraft[0];
    } catch (error) {
        console.log(error);
        return Promise.reject(new Error('failed flightxml request'))
    }
        // RequestTracker.newRequest(tailNum); 
        
        let myposData = new exports.posData();
        if(data.arrivalTime == 0){
            let inFlight = true;
            myposData.heading = parseInt(data.heading, 10) ;

            myposData.latitude = data.latitude;
            myposData.longitude = data.longitude;
            try {
            let desData = await planePath.createDestinationObject(data.destination, myposData);
            myposData.destination = desData;
            return {myposData, tailNum, inFlight}
            } catch (error) {
                return {myposData, tailNum, inFlight};
            }
        } else{
            let inFlight = false;

            try {
                let desData = await planePath.getAirportLocation(data.destination);
                myposData.destination = desData;
                return {myposData, tailNum, inFlight};
            } catch (error) {
                return{myposData, tailNum, inFlight}
            }

        }
};


exports.restorePlaneState = function (plane){
    
        plane.type = "openSky";
        console.log("ran state change");
 
}
