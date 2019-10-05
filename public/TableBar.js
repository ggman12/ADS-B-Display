var xmlString = "<table class = 'w3-table w3-bordered' style = 'font-size: 18px'><tbody class = 'tbo'><tr><th>Model</th><th>Year</th></tr><tr class = 'row'><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>";
var doc = new DOMParser().parseFromString(xmlString, "text/xml");


var AirportTableContainer = L.DomUtil.create('div');
AirportTableContainer.style.width = "240px"

var AirportTableInfo = L.DomUtil.create('div');


AirportTableInfo.className = "w3-table-all"

// AirportTableInfo.innerHTML = "<table> <tbody><tr><td>&nbsp;</td><td>&nbsp;</td></tr>fdsjkl;lll;l;l;l;l;l;l;l;l;l;l;l;l;l;l;l;l;l;l;l;l;l;l;l;l;l<tr><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>"
AirportTableInfo.innerHTML = xmlString;

// AirportTableInfo.style.color = "white"
// AirportTableInfo.style.fontSize = "50px"
let table = AirportTableInfo.getElementsByClassName('tbo')[0]
let row = AirportTableInfo.getElementsByClassName("row")[0];

let AirportTitle = document.createElement("h2")
AirportTitle.innerText = ""
AirportTitle.style.fontSize = "30px"
AirportTitle.style.color = "white"

//Open Planes h1
let Explainer = document.createElement('h5');
Explainer.style.display = "inline"

Explainer.innerHTML = "Click on Airport to see Planes "
Explainer.style.color = "white"

//

//Close Button
let CloseButton = document.createElement('button');
CloseButton.innerHTML = "&#10006;"
CloseButton.style.color = "red"
CloseButton.style.display = "inline"
// CloseButton.style.marginLeft = "180px"
CloseButton.style.fontSize = "30px"
CloseButton.onclick = function () {
    AirportTableContainer.style.visibility = "hidden"
}
//
AirportTableContainer.appendChild(Explainer);

AirportTableContainer.appendChild(CloseButton);
AirportTableContainer.appendChild(AirportTitle);
AirportTableContainer.appendChild(AirportTableInfo);



// let AirportTitle = AirportTableInfo.getElementsByClassName('AirportTitle')[0];
// AirportTitle.style.fontSize = "30px"
// AirportTitle.style.color = "white"

var AirportTable = L.Control.Settings = L.Control.extend({
    options: {
        position: 'bottomright'
    },
    onAdd: function (map) {
        containter.appendChild(AirportTableInfo);
        return containter
    }
})
L.control.Settings = function(opts){
    return new L.Control.Settings(opts);
}

var runningInterval;
function ChangeAirportTableInfo(airport) {
    if(runningInterval!= undefined){
        clearInterval(runningInterval);

    }
    AirportTableContainer.style.visibility = "visible"
    let set = false;
    if(set == false){
        set = true;

    runningInterval =    setInterval(() => {
            AirportTitle.innerText = airport.destination.iata+ ": " +airport.Planes.length + " Planes"
    
            while(table.rows.length > 1){
                table.deleteRow(1)
            }
            airport.Planes.forEach(plane => {
                let clone = row.cloneNode(true);
        
                clone.cells[0].innerHTML = plane.modelInfo.model
                clone.cells[1].innerHTML = plane.modelInfo.year
                table.appendChild(clone);        
            });
        }, 50);
    }
    
    
}


console.log(doc.firstChild.innerHTML); // => <a href="#">Link...
console.log(doc.firstChild.firstChild.innerHTML); // => Link