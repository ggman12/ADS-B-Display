


CurrentLocation();
//types: "openSky", "FlightXML", "Draw", "Not Live"

L.mapbox.accessToken = 'pk.eyJ1IjoiZ29vZGVqb25haGdtYWlsY29tIiwiYSI6ImNqd3pkejdzaTFmOW80OW50eGJ0Y2x2cHYifQ.57F313PTCf3RtS3ZfzwEsg'
var map = L.mapbox.map('map')
   .setView([42.3601, -71.0589], 8)
   .addLayer(L.mapbox.styleLayer('mapbox://styles/goodejonahgmailcom/cjx0oogokixj41cpburxs21kx'))

   map.addControl(new customControl());
   map.addControl(new customControlCount())
   // map.addControl(new AirportTable())

   window.addEventListener('DOMContentLoaded', map);
var turbopropIcon = L.icon({
    iconUrl: 'turboprop2.svg',
    iconSize: [50, 50],
    iconAnchor: [25, 16],
  
});
// var turbopropIcon = L.divIcon({
//    html: '<img src = "turboprop.svg">',
//    iconSize: [25, 25],
//    iconAnchor: [25, 16],
 
// });



function CurrentLocation() {
   if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(CreateGEOMarker)
   }
}
function CreateGEOMarker(position){
   var home = L.marker([position.coords.latitude, position.coords.longitude], {title: 'Current Location'}).addTo(map);
   home.bindPopup("Current Location").openPopup();
}

function createMarker(element) {
   element.marker = L.marker([0,0], {icon: turbopropIcon, title: element.tailNumber}).addTo(map);
   
   element.marker.bindPopup();
   UpdateMarkerWithPlaneInfo(element);
}

function UpdateMarkerWithPlaneInfo(element) {
   var textInfo;
   if(element.tailNumber != undefined){
       var tailNumText =  "Tail Number: "+element.tailNumber
   }
   if(element.hexcode != undefined){
      var hexcodeText = "hexcode: " + element.hexcode;
   }
   if(tailNumText != undefined && hexcodeText != undefined){
      textInfo = tailNumText + " " + hexcodeText;
   }
   else if(tailNumText != undefined){
      textInfo = tailNumText
   }
   else if(hexcodeText != undefined){
      textInfo = hexcodeText;
   }

   

   if(element._type == "openSky" || element._type == "FlightXML" || element._type == "Draw"){
      var PopupTextStatus = "In Flight: " + element._type;
      var TextPosInfo = "heading: " + element.posData.heading +  " latitude: " + element.posData.latitude + " longitude: " + element.posData.longitude;
   }
   element.marker._popup.setContent(PopupTextStatus + '<br />' + textInfo  + '<br />' + TextPosInfo);
}
