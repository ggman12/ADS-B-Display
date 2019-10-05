var NumberInputForm = L.DomUtil.create("form");
// NumberInputForm.innerHTML = "set the time in seconds between FlightXML Requests" 
NumberInputForm.setAttribute('method', "post");
NumberInputForm.setAttribute('action', "changeFlightXMLTimer");
var numberInput = L.DomUtil.create("input"); //input element, Submit button
numberInput.setAttribute('type',"number");

numberInput.setAttribute('value',"60");
numberInput.setAttribute('name',"number");


var submitNumber = L.DomUtil.create("input"); //input element, Submit button
submitNumber.setAttribute('type',"submit");
submitNumber.setAttribute('value',"Change time between FlightXML Calls(in seconds) ");

NumberInputForm.appendChild(numberInput);
NumberInputForm.appendChild(submitNumber);
