var Storage = require('./Storage');
exports.Airports = [];

exports.PlaneLanded = function(plane) {
    let destination = plane.destination;
    let foundAirport = findAirportinAirports(plane)
    if(foundAirport == false){
        foundAirport =  NewAirport(destination);
    } 
    let foundPlane = findPlaneinAirport(plane, foundAirport);
    if(foundPlane == false){
        foundAirport.Planes.push(plane)
    }else{
        foundPlane = plane;
    }
    
    
}
exports.PlaneTookOff = function(plane) {
    let destination = plane.destination
    let foundAirport = findAirportinAirports(plane);
    let foundPlane = findPlaneIndexinAirport(plane, foundAirport);
    foundAirport.Planes.splice(foundPlane, 1);
}

function NewAirport(destination) {
    exports.Airports.push(new Airport(destination))
    return exports.Airports[exports.Airports.length - 1];
}

class Airport{
    constructor(destination) {
        this.iata = destination.iata;
        this.latitude = destination.latitude
        this.longitude = destination.longitude
        this.Planes = [];
        this.Marker = Marker;
    }
}
function findAirportinAirports(plane){
    for (let i = 0; i < exports.Airports.length; i++) {
        let planeiata = plane.posData.destination.iata;
        const airport = Airports[i];
        if(airport.iata == planeiata){
            return exports.Airports[i];
        }else{
            return false; 
        }
}
function findPlaneinAirport(plane, airport) {
        const planes = airport.Planes;
        for (let index = 0; index < planes.length; index++) {
            const element = planes[index];
            if(plane.hexcode == element.hexcode){
                return element;
            }else if(plane.tailNumber == element.tailNumber){
                return element;
            }else{
                return false; 
            }
        }
    }
}
function createPlaneinAiport(plane,airport){
    airport.push(plane);
    //Do some stuff after
}
function findPlaneIndexinAirport(plane, airport) {
    const planes = airport.Planes;
    for (let index = 0; index < planes.length; index++) {
        const element = planes[index];
        if(plane.hexcode == element.hexcode){
            return index;
        }else if(plane.tailNumber == element.tailNumber){
            return index;
        }else{
            return false; 
        }
    }
}
