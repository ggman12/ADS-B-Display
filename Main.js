var Promises = require('./Promises');
var PromiseCreator = require('./PromiseCreator');
var allSettled = require('promise.allsettled');
var storage = require('./Storage');
const Calculations = require('./Calculations');
var Landed = require('./Landed');
function resultOBJ(data, state) {
    this.data = data;
    this.state = state;
}

function DrawingCalc(plane) {
    try {
        let totalTime = plane.posData.destination.endTime - plane.posData.destination.startTime;
        let timePassed = Calculations.getCurrentTime() - plane.posData.destination.startTime;
        // let currentTime = Calculations.getCurrentTime() + plane.posData.destination.startTime;
        // let endTime = plane.posData.destination.endTime - plane.posData.destination.startTime;
        let percent =  (timePassed/ totalTime);
        let startPT = plane.posData.destination.startPt;
        let pathPosition = Calculations.getPositionOnPath(startPT, plane.posData.destination, percent);
        // plane.posData.latitude = pathPosition.latitude;
        
        // plane.posData.longitude = pathPosition.longitude;
        console.log(percent);
        if(percent >= 1){
            plane.type = "Landed"
            plane.destination = undefined;
            console.log("compeleted path 100%")
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}
exports.MainLoop = async function (Planes, io, FlightXMLOp) {
    let PromisesArray = PromiseCreator(Planes, FlightXMLOp);
    await allSettled(PromisesArray).then((results) => {
        console.log(Promises.flightXMLCount);
        planeCounts = storage.PlaneCounts(Planes);

        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            
            
            if(element.status == "rejected"){
                console.log(element.reason);
                FailedRequest(Planes[i],io);
               
            } else if(element.status == "fulfilled"){
                let returnedPosdata = element.value.myposData;
                let value = element.value               
                let passedPlane = storage.findInPlanes(value.tailNumber, value.hexcode, Planes)
                console.log(element.value);
                let inFlight = value.inFlight;
                
                FullfilledRequest(passedPlane,returnedPosdata, io,inFlight);
            }

        }

    }).catch((error=> 
        console.log("There was a big time error" + error)));

}
//types: "openSky", "FlightXML", "Draw", "Not Live"

function FailedRequest(plane, io) {
    if(plane.type == "openSky" ){
        if(plane.fails.OpenSky <=5){
        plane.fails.OpenSky++;
            
        }else{
            plane.type = "FlightXML"
            io.emit("update", {
                Plane: plane,
                count: Promises.flightXMLCount,
                delete: true,
                planeCount: planeCounts
            });
        }
    } else if (plane.type == "FlightXML") {
        plane.type = "Not Live";
        io.emit("update", {
            Plane: plane,
            count: Promises.flightXMLCount,
            delete: true,
            planeCount: planeCounts
        });
    }
    
}
function FullfilledRequest(plane, posData, io, inFlight) {
    
    if(posData != undefined){
        plane.fails.OpenSky = 0;
        plane.posData = posData;
        if(plane.posData.destination != undefined){
            if(inFlight == false){
                plane.type = "Landed";
                Landed.PlaneLanded(plane);
                io.emit("AirportUpdate",{
                    Airports:Landed.Airports
                })
            }else{
                plane.type = "Draw";

            }
        }
        io.emit("update", {
            Plane: plane,
            count: Promises.flightXMLCount,
            delete: false,
            planeCount: planeCounts
        });
    }

    
}



const delay = ms => new Promise(res => setTimeout(res, ms));
