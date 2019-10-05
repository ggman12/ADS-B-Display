var Calculations = require('./Calculations');
var Promises = require('./Promises');
const request = require('request-promise');

exports.destinationData = function(iata, latitude, longitude, angle, startTime, endTime, startPt){
    this.iata = iata;
    this.latitude = latitude;
    this.longitude = longitude;
    this.angle = angle;
    this.startTime = startTime;
    this.endTime = endTime;
    this.startPt = startPt;
}
exports.startPoint = function(latitude, longitude){
    this.latitude = latitude;
    this.longitude = longitude;
}
exports.createDestinationObject = async function (iata, posData) {
    let startingPoint = new exports.startPoint(posData.latitude,posData.longitude);
    try {
    let airportData = await exports.getAirportLocation(iata)
        
    } catch (error) {
        return Promise.reject(new Error(err));
    }
    posData.destination = airportData;
    posData.destination.startPt = startingPoint;

    let endTimeCalc = exports.getEndTime(posData, airportData, 200);
    posData.destination.startTime = Calculations.getCurrentTime();
    posData.destination.endTime = endTimeCalc;
    posData.heading = (Calculations.calculateAngle(posData, posData.destination));
    return posData.destination;
}
exports.getAirportLocation = async function (iata) {
    if(iata == "KMVY"){
        return new exports.destinationData(iata, 41.388145 ,-70.61387);
        
    }

    if(iata == "KBED"){
        return new exports.destinationData(iata, 42.46317 ,-71.29119);

    }

    let url = 'https://airport-info.p.rapidapi.com/airport?icao=' + iata;
    try {
        var req = await request({
            url: url,
            headers: {
                'X-RapidAPI-Host': 'airport-info.p.rapidapi.com',
                'X-RapidAPI-Key': 'bf0e1034d7msh85be39c7dac179bp132a3fjsn4647c138e2f0'
            }

        });
        let data = JSON.parse(req);
        if(data.latitude == undefined || data.longitude == undefined){
            return Promise.reject(new Error(err));
        }
        let myDesData = new exports.destinationData(iata, data.latitude, data.longitude)
        
        return myDesData;
    } catch (err) {
        return Promise.reject(new Error(err));
        
    }

}
exports.getEndTime = function (startPt, endPt, speed) {
    let lat1 = startPt.latitude;
    let lat2 = endPt.latitude;
    let lon1 = startPt.longitude;
    let lon2 = endPt.longitude;
    if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515 *97.5553;
		// if (unit=="K") { dist = dist * 1.609344 }
        // if (unit=="N") { dist = dist * 0.8684 }
        let currentTime = Calculations.getCurrentTime();
        let timeToTravel = (dist / speed) *60 *60 ;
        let endTime = currentTime+ timeToTravel;
		return endTime;
	
}
function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}