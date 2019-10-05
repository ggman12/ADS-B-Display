var DataTypes = require('./DataTypes');
const request = require('request-promise');
var planePath = require('./PlanePath');
var flightxmlurlbasic = "https://flightxml.flightaware.com/json/FlightXML2/SearchBirdseyeInFlight?";
var username = "goodejonah3";
var apiKey = "9a453d7ce012f1b0e2b5a8a190d1fec018aefbe1";
var OpenSkyUrl = "https://@opensky-network.org/api/states/all?icao24="
exports.FlightXMLOP = false
    module.exports.OpenSky = async function(hexcode, tailNum, plane) {

        // let myposData = new DataTypes.PosData();

        // let desData = await DataTypes.getAirportLocation("KBED");
        // myposData.destination = desData;
        // plane.posData = myposData;
        // plane.type = "Landed"
        // return plane
        try {
            let planeUrl = OpenSkyUrl + hexcode;
            var Openres = await request({
                url: planeUrl,
                method: 'GET',
                timeout: 10000
            });
    
        } catch (e) {
            return Promise.reject(plane)
        }
    
        let parsedData = JSON.parse(Openres);
        let data = parsedData.states;
    
        try {
            let states = data[0];
            let myposData = new DataTypes.PosData();
            myposData.latitude = states[6];
            myposData.longitude = states[5];
            myposData.heading = states[10];
            plane.posData = myposData;
            return plane;
        } catch (e) {
            
            return Promise.reject(plane);
        }
    
    }
    module.exports.FlightXml = async function(hexcode, tailNum, plane) {
        
            if(plane.planeRequest() === true && exports.FlightXMLOP === true && tailNum != undefined){
            } else{
              console.log("rejected")  
              await Promise.reject({plane: plane, reason: "Can't"})

            }
            
        
        console.log("running FlightXMLRequest")
        DataTypes.flightXMLCount++
        let data;
        // let planeUrl = flightxmlurlbasic + "query=" + tailNum + "&howMany=1&offset=0";
        try {
            var propObject = {
                howMany: 1,
                query: "{ident_or_reg {" + tailNum + "}}"
            }
            var res = await request({
                url: flightxmlurlbasic,
                qs: propObject,
                auth: {
                    username: username,
                    password: apiKey
                }
        
            });
        }
        catch (error) {
            console.log(error);
            return Promise.reject(plane)
    
        }
        try {
            let parsedRes = JSON.parse(res);
            data = parsedRes["SearchBirdseyeInFlightResult"].aircraft[0];
        } catch (error) {
            console.log(error);
            return Promise.reject(plane)
        }
            // RequestTracker.newRequest(tailNum); 
            
            let myposData = new DataTypes.PosData();
            if(data.arrivalTime == 0){
                let inFlight = true;
                myposData.heading = parseInt(data.heading, 10) ;
    
                myposData.latitude = data.latitude;
                myposData.longitude = data.longitude;
                return myposData;
            } else{
    
                try {
                    let desData = await DataTypes.getAirportLocation(data.destination);
                    myposData.destination = desData;
                    plane.posData = myposData;
                    plane.type = "Landed"
                    return plane
                } catch (error) {
                    return myposData
                }
    
            }
    };


