var allSettled = require('promise.allsettled');
var SocketSetup = require('./SocketSetup')
var DataTypes = require('./DataTypes');

var LandedPlaneCount
module.exports = async function (io, Planes, Airports) {
    let promiseArray = []
    for (let i = 0; i < Planes.length; i++) {
        const plane = Planes[i];
        if (plane.type == undefined || plane.type == "Not Live" || plane.type == "Landed" ) {
           console.log("special Case")

            
        } else if (plane.promise != undefined) {

            promiseArray.push(plane.promise(plane.hexcode, plane.tailNumber, plane));


        }
    }
    Planes.forEach(plane => {
        console.log(plane.type)
    });
    await allSettled(promiseArray).then((results) => {
        // Do something with each result from the promiseArray results array
        for (let i = 0; i < results.length; i++) {

            const result = results[i]

            if (result.status == "rejected") {
                let plane = result.reason;
                
                if(plane.reason == "Can't"){
                    // Flight XML 
                    plane = result.reason.plane
                    if(findPlaneIndex(Planes, plane) != false){
                        emitUpdate(plane,io, Planes)
                    }
                    continue;

                }
                if (plane.type == "openSky") {

                    if (plane.openSkyFails <= 3) {
                        plane.openSkyFails++;
                    } else {
                        
                        plane.type = "FlightXML"
                    }
                } else if (plane.type == "FlightXML") {
                    plane.posData = undefined;
                    plane.type = "Not Live";
                    
                }
                
                    emitUpdate(plane, io, Planes)
                
               
            } else {
                let plane = result.value;
                if (result.value.reason == "Can't") {
                    if(findPlaneIndex(Planes, result.value.plane) != false){
                    emitUpdate(result.value.plane, io, Planes)

                }
                } else if (plane.type == "Landed") {
                    let airport = Airports.findAirport(plane);
                    Airports.addAirplaneToAirport(airport,plane);
                    io.emit("AddPlaneToAirport",{
                        Plane: plane,
                        airport: airport,
                        Airports: Airports
                    })
                    setTimeout(movePlaneToPlanesFromAirports, 4.32e7, plane, io, Planes, Airports) 
                    Planes.splice(findPlaneIndex(Planes,plane), 1);
                    
                } else {
                    console.log(plane.posData);
                    if (plane.type == "openSky") {
                        plane.openSkyFails = 0;
                    }
                    // plane.posData = result.value;
                    if (plane == undefined) {

                    }
                    // if(findPlaneIndex(Planes, plane)!==false){
                  emitUpdate(plane, io, Planes)

                
                }
            }

        }
        if(Airports.list.Planes!= undefined){
            console.log(Airports.list[0].Planes.length)

        }
        console.log("Planes Length: " + Planes.length)
    })
    
    console.log("Finished")
    return Promise.resolve();
}

function findPlaneIndex(Planes, plane) {
    for (let i = 0; i < Planes.length; i++) {
        const element = Planes[i];
        if(element.ID === plane.ID){
            return i;
        }
        
    }
    return false;
}
function movePlaneToPlanesFromAirports(plane, io, Planes,Airports) {
    let port = Airports.findAirport(plane)
    let myPlane = port.findPlane(plane, false)
    port.RemovePlane(plane) 
    setTimeout(() => {
        myPlane.type = "openSky"

    }, 6000);
    Planes.push(myPlane);
    io.emit("AirplaneDelete", {
        Plane: plane,
        airport: port
    }) 
    
}
function GetPlaneCounts(Planes) {
    let NotLiveCountPlanes =0
        let OpenSkyCountPlanes =0
        // let Landed = 0;
        let flightXMLCountPlanes =0;
    Planes.forEach(plane => {
        
        if(plane.type =="openSky"){
            OpenSkyCountPlanes++
        }if(plane.type =="FlightXML"){
            flightXMLCountPlanes++
        }if(plane.type =="Not Live"){
            NotLiveCountPlanes++
        }
    });
    return {
        NotLiveCountPlanes,
        OpenSkyCountPlanes,
        flightXMLCountPlanes
    }
}
function emitUpdate(plane,io, Planes) {
    //emit update to all connected clients with Socket.Js
    io.emit("update", {
        plane: plane, 
        count: GetPlaneCounts(Planes),
        FlightXMLCount: DataTypes.flightXMLCount
    })
}