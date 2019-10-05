var FlightXMLButton = L.DomUtil.create("form");
FlightXMLButton.setAttribute('method', "post");
FlightXMLButton.setAttribute('action', "changeFlightXMLSetting");
var s = L.DomUtil.create("input"); //input element, Submit button
s.setAttribute('type',"submit");
s.setAttribute('value',"Turn On FlightXML");

FlightXMLButton.appendChild(s);
