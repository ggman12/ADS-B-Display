var ChangeAllButton = L.DomUtil.create("form");
ChangeAllButton.setAttribute('method', "post");
ChangeAllButton.setAttribute('action', "changeAllToFlightXML");
var ChangeAllInput = L.DomUtil.create("input"); //input element, Submit button
ChangeAllInput.setAttribute('type',"submit");
ChangeAllInput.setAttribute('value',"Change All to Flight XML");

ChangeAllButton.appendChild(ChangeAllInput);



var ChangeDrawButton = L.DomUtil.create("form");
ChangeDrawButton.setAttribute('method', "post");
ChangeDrawButton.setAttribute('action', "changeDraw");
var ChangeDrawInput = L.DomUtil.create("input"); //input element, Submit button
ChangeDrawInput.setAttribute('type',"submit");
ChangeDrawInput.setAttribute('value',"Turn Off Draw");

ChangeDrawButton.appendChild(ChangeDrawInput);

function ChangeDrawButtonState(Draw) {
    if(Draw){
        ChangeDrawInput.setAttribute('value', "Turn Off Draw")
    }else{
        ChangeDrawInput.setAttribute('value', "Turn On Draw")
    }
}

var ButtonsDiv = L.DomUtil.create("div");
ButtonsDiv.appendChild(ChangeAllButton);
ButtonsDiv.appendChild(ChangeDrawButton);