//types: "openSky", "FlightXML", "Draw", "Not Live"

var fs = require('fs');
var LocalStorage = require('node-localstorage').LocalStorage;
var PlanePath = require('./PlanePath');
localStorage = new LocalStorage('./local');
var DataTypes = require('./DataTypes');


//These are the plane types: "openSky", "Not Live", "Draw", "FlightXML"



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