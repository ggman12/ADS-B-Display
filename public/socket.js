var socket = io.connect();
console.log(Planes);
console.log(Airports);
var isInput = false;
try {
    console.log(thisIsATable);

    isInput = true;
} catch (error) {
    isInput = false;
}
if(!isInput){
    Airports.list.forEach(airport => {
        CreateAirportMarker(airport)
        ChangeIcon(airport.marker, airport.Planes.length, airport.destination.iata)
    });
} else if(isInput){
}

socket.on('update', function (data) {
    console.log("update")
    // console.log(data.plane)
    try{
        let result =  findInPlanes(data.plane)
        if(result != false){
            mapUpdate(data.plane);

        }
        
        updateCounts(data.count)
        if(!isInput){
            UpdateText(data.FlightXMLCount)
        }
    } catch(e){
        console.log(e +"did not Run MapUpdate")
    }

    
});


function updateMarker(Plane, latitude, longitude, angle) {

    Plane.marker.setLatLng([latitude, longitude]);
    Plane.marker.setRotationAngle(angle + 180);
}

function mapUpdate(plane) {
    
    let myPlane = findInPlanes(plane)
    myPlane._type = plane._type
    myPlane.posData = plane.posData;
    let posData = myPlane.posData;
    if(!isInput){
        if(plane._type == "Not Live"){
            if(myPlane.marker!= undefined){
                map.removeLayer(myPlane.marker);

            }
        }else if(plane.posData != undefined){
            if (myPlane.marker == undefined) {
                createMarker(myPlane);
        
            }
            updateMarker(myPlane, posData.latitude, posData.longitude, posData.heading)
            UpdateMarkerWithPlaneInfo(myPlane);
        }
        
    }else if(isInput){
        TableUpdate(myPlane);
    }
   

}

function findInPlanes(plane, isDelete) {
    for (let i = 0; i < Planes.length; i++) {
        const element = Planes[i];
        if (element.ID === plane.ID) {
            if(isDelete == true){
                Planes.splice(i, 1);
            } else{
                return Planes[i]

            }
        }

    }
    return false;
}

function findAirportInAirports(airport) {
    for (let i = 0; i < Airports.list.length; i++) {
        const element = Airports.list[i];
        if (element.ID === airport.ID) {
            return Airports.list[i]
        }

    }
    let port = Airports.list.push(airport);
    return (Airports.list[port -1])

}

function findPlaneInAirport(airport, plane, index) {
    for (let i = 0; i < airport.Planes.length; i++) {
        const element = airport.Planes[i];
        if (element.ID === plane.ID) {
            if (index == true) {
                return i
            } else {
                return element;
            }
        }

    }
    let thisPlane = airport.Planes.push(plane);
    return thisPlane;
}
socket.on('AddPlane', function (data) {
    let plane = data.Plane
    if(findInPlanes(plane) == false){
        Planes.push(plane);
    }
    
})
  

socket.on('AddPlaneToAirport', function (data) {  

    let plane = data.Plane;
    let airport = data.airport
    
    let myAirport = findAirportInAirports(airport);
    let myPlane = findPlaneInAirport(myAirport, plane)
    let mapPlane = findInPlanes(plane)
    if(mapPlane.marker!= undefined){
        map.removeLayer(mapPlane.marker);
    }
    findInPlanes(plane, true);
    if(!isInput){
        if(myAirport.marker == undefined){
            CreateAirportMarker(myAirport)
            
        }
        ChangeIcon(myAirport.marker, myAirport.Planes.length, airport.destination.iata)
    } else{
        
    }
    

    
})

socket.on('AirplaneDelete', function (data) {
    let plane = data.Plane
    if(data.airport!= undefined){
        let airport = data.airport
        let myAirport = findAirportInAirports(airport)
        let myPlaneIndex = findPlaneInAirport(myAirport, plane, true);
    
        myAirport.Planes.splice(myPlaneIndex, 1);
        if(myAirport.marker!= undefined){
            ChangeIcon(myAirport.marker, myAirport.Planes.length, airport.destination.iata)
        }
    } else{
        let myPlane = findInPlanes(plane)
        if(myPlane.marker!= undefined){
            map.removeLayer(myPlane.marker)
        }
        if(isInput){
            TableUpdate(myPlane, true);
        }
        findInPlanes(plane, true)
    }
   
    


})


//Settings Stuff
socket.on("ChangeInFlightXMLOPState", (data) =>{
    changeInFlightXMLOP(data)
})
function changeInFlightXMLOP(data) {
    if (data == false) {
        s.setAttribute('value', "Turn On FlightXML");

    } else if (data == true) {
        s.setAttribute('value', "Turn Off FlightXML");

    }
}
function updateCounts(planeCount) {
    let NotLive = planeCount.NotLiveCountPlanes;
    let OpenSkyCountPlanes = planeCount.OpenSkyCountPlanes;
    let flightXMLCountPlanes = planeCount.flightXMLCountPlanes;
    let Landed  = planeCount.Landed;
    countText.innerHTML = "Planes not Live: " + NotLive + " Opensky Planes: " + OpenSkyCountPlanes + " FlightXML Planes: " + flightXMLCountPlanes;
}
