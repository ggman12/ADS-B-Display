//types: "openSky", "FlightXML", "Draw", "Not Live"

var fs = require('fs');
var LocalStorage = require('node-localstorage').LocalStorage;
var PlanePath = require('./PlanePath');
localStorage = new LocalStorage('./local');
var DataTypes = require('./DataTypes');


//These are the plane types: "openSky", "Not Live", "Draw", "FlightXML"

exports.TestDestinationPlane = async function(lat, long) {
    let Plane = new exports.Plane();
    Plane.type = "Draw";
    Plane.posData = new Promises.posData(lat,long,0);
    Plane.tailNumber = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    Plane.posData.destination = await PlanePath.createDestinationObject('OWD', Plane.posData);
    return Plane
}

module.exports.LoadJSON = function (path) {
    let Planes = [];
    var data = fs.readFileSync(path);
    let parsedData = JSON.parse(data);
    parsedData.forEach(element => {
        let myPlane = new DataTypes.Plane();
        myPlane.hexcode = element["ICAO24"];
        myPlane.tailNumber = element["Tail Number"]
        Planes.push(myPlane);
        myPlane.modelInfo = new DataTypes.modelInfo(element["Model"], element["Year"])
    });
    return Planes;

}

module.exports.SavePlanes = function (Planes) {
    let data = JSON.stringify(Planes);
    localStorage.setItem('Planes', data);
}
module.exports.GetPlanes = function () {
    localStorage.getItem('Planes');
}
module.exports.LoadStorage = async function (loadTest) {
    let Planes;
    if (loadTest == true) {
        Planes = exports.LoadJSON("./Data/Test Planes.json");
        return Planes;
    }
  
    Planes = exports.LoadJSON("./Data/East Aero Club 3.json");
    console.log(Planes);
    return Planes;
  // try {
    //     let data = localStorage.getItem("Planes");
    //     Planes = JSON.parse(data);
    // } catch (error) {
    //     console.log(error);

    // }
    // if (Planes != null) {
    //     return Planes;

    // } else {
    //     Planes = exports.LoadJSON("./Data/East Aero Club.json");
    //     return Planes;
    // }

}
module.exports.PlaneCounts = function (Planes) {
    let counts = {
        NotLiveCountPlanes: 0,
        OpenSkyCountPlanes: 0,
        flightXMLCountPlanes: 0,
        DrawCountPlanes: 0,
        Landed: 0
    }
    Planes.forEach(element => {
        if (element.type == undefined || element.type == "Not Live") {
            counts.NotLiveCountPlanes++;
            return;
        } else if (element.type == "openSky") {
            counts.OpenSkyCountPlanes++;
            return;

        } else if (element.type == "FlightXML") {
            counts.flightXMLCountPlanes++;
            return;
        } else if (element.type == "Draw") {
            counts.DrawCountPlanes++;
            return;
        }else if (element.type == "Landed") {
            counts.Landed++;
            return;
        }
    });
    return counts;
}
module.exports.findInPlanes = function (tailNumber, hexcode, Planes){
    let found = Planes.find(function (element) {
        if (element.tailNumber != undefined) {
            if (element.tailNumber == tailNumber) {
                return element;
            }
        }
        if (element.hexcode != undefined) {
            if (element.hexcode == hexcode) {
                return element;
            }
        }

    });
    if(found == undefined){

    } else{
        return found;

    }
}