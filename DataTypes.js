var PromiseClasses = require('./PromiseClasses')
var SocketSetup = require("./SocketSetup")
var FlightXMLOP = false;
var PromiseClasses = require("./PromiseClasses");
const request = require('request-promise');
module.exports.flightXMLCount = 0;

exports.repeatCallTime =  60000
module.exports.Plane = class Plane  {
  
  constructor(tailNumber, hexcode, type) {
    this.tailNumber = tailNumber;
    this.hexcode = hexcode
    this._type = type
    this.openSkyFails = 0;
    this.ID = ID();
    
  }
  
  get type() {
    return this._type;
  }
  set type(newType) {
    if (this._type !== newType) {
      this._type = newType;

      if (this._type === "openSky") {
        if (this.hexcode != undefined) {
          this.promise = PromiseClasses.OpenSky
        }
      } else if (this._type === "FlightXML") {
        if (true) {
          this.promise = PromiseClasses.FlightXml;

        }
      } else if (this._type === "Landed") {

      } else if (this._type === "Not Live") {
        this.promise = undefined;
      }
    }

  }
  planeRequest (){
    let today = new Date();
    let time = today.getTime();

    if (this.requestTime == undefined) {
      this.requestTime = time;
      return true;
    } else{
        let timeToCall = this.requestTime + exports.repeatCallTime;

        if (time > timeToCall) {
            this.requestTime = time;
            return true;
        } else {
            return false;
        }
      }
  }
  

}
module.exports.modelInfo = class{
  constructor(model, year) {
    this.model = model;
    this.year = year;
}
}


module.exports.PosData = function(latitude, longitude, heading, destination) {
  this.latitude = latitude;
  this.longitude = longitude;
  this.heading = heading;
  this.destination = destination;
}
function ID() {
  return Math.random().toString(36).substr(2, 9);
}

exports.Airports = class{
  constructor(){
    this.list = [];
  }
  findAirport(plane){
      let destination = plane.posData.destination
      for (let i = 0; i < this.list.length; i++) {
          const element = this.list[i];
          if(element.destination.iata === destination.iata){
              return this.list[i]
          }
          
      }
      var port = this.list.push(new exports.Airport(destination))
      port = this.list[port-1]
      return port;
      

  }
  addAirplaneToAirport(port, plane){
    port.Planes.push(plane);
  }
  
  
}
exports.Airport = class {
  constructor(destination) {
      this.destination = destination
      this.Planes = [];
      this.ID = ID()
  }
  findPlane(plane, index){
    for (let i = 0; i < this.Planes.length; i++) {
      const element = this.Planes[i];
      if(element.ID === plane.ID){
        if(index == true){
          return i;

        } else {
          return this.Planes[i];
        }
      }
      
    }
  }
  RemovePlane(plane){
    let index = this.findPlane(plane, true)
    this.Planes.splice(index, 1);
  }
}
exports.destination= class {
  constructor(iata, latitude, longitude) {
    this.iata = iata;
    this.latitude = latitude
    this.longitude = longitude
    this.ID = ID();
}
}
exports.getAirportLocation = async function (iata) {
  if (iata == "KMVY") {
    return new exports.destination("KMVY", 41.388145, -70.61387);

  }

  if (iata == "KBED") {
    return new exports.destination("KBED", 42.46317, -71.29119);

  }if(iata == "KOWD") {
    return new exports.destination("KOWD", 42.191998, -71.17662);

  }

  let url = 'https://airport-info.p.rapidapi.com/airport?icao=' + iata;
  try {
    let req = await request({
      url: url,
      headers: {
        'X-RapidAPI-Host': 'airport-info.p.rapidapi.com',
        'X-RapidAPI-Key': 'bf0e1034d7msh85be39c7dac179bp132a3fjsn4647c138e2f0'
      }

    });
    let data = JSON.parse(req);
    if (data.latitude == undefined || data.longitude == undefined) {
      return Promise.reject(new Error(err));
    }
    let myDesData = new exports.destination(iata, data.latitude, data.longitude)

    return myDesData;
  } catch (err) {
    return Promise.reject(new Error(err));

  }

}

