
 

function CreateAirportMarker(airport) {
        
        // airportIcon.getElementsByTagName("object")[0].contentDocument.getElementById("Number_Text").children[0].innerHTML = number;
        airport.marker =  L.marker([airport.destination.latitude,airport.destination.longitude ], {icon: airportIconTemp}).addTo(map).on("click", airportClick)
        airport.marker.getElement().style.background = "transparent";
        airport.marker.getElement().style.border = "0px";
        ChangeIcon(airport.marker);
}
function ChangeIcon(marker, number, IATA) {
    let newIcon = marker._icon; 
    
    setTimeout(function(){ 
    
    let child = newIcon.children[0];
    // child.style.pointer-events = "none";
    child.contentDocument.getElementById("Number_Text").children[0].innerHTML = number;
    child.contentDocument.getElementById("Layer_3").children[0].innerHTML = IATA
}, 3000);

}
function airportClick(e) {
    var clickedPassedObject = e;
    let airport = findAirportWithLatLng(this.getLatLng())
    ChangeAirportTableInfo(airport)

}
function findAirportWithLatLng(pos) {
    for (let i = 0; i < Airports.list.length; i++) {
        const airport = Airports.list[i];
        if(airport.marker.getLatLng() == pos){
            return airport;
        }
    }
    // return Airports.list.forEach(airport => {
        
    // });
}

// function UpdateAirportMarker(airport, number) {
//     let child = airport.marker.getElement()._icon.children[0]
//     child.contentDocument.getElementById("Number_Text").children[0].innerHTML = "15";
//     console.log(child)
//     airport.marker.setLatLng([5,5])
// }

function UpdateAirports(Airports) {
    // Airports.forEach(airport => {
    //     airport.marker._popup._content
    //     airport.marker.icon = 
    // });
}

// function updateIcon(airport){
//     var airportImage;
//     var img = fetch("airport.svg").then(response => airportImage = response);
//     // let airportIcon = airport.marker._icon;
//     airportIcon = L.icon({
//         iconUrl: "airport.svg",
//         iconSize: [50, 50],
//         iconAnchor: [25, 16],
      
//     }); 
// }
