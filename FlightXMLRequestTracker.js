const fs = require('fs');
exports.repeatCallTime =  60000; //milliseconds
function request(tailNum, time) {
    this.tailNum = tailNum;
    this.time = time;
}
exports.newRequest = function (tailNum) {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let currentTime = date + " " + time;
    fs.readFile('RequestTracker.json', function (err, data) {
        let parsedData = JSON.parse(data)
        let myRequest = new request(tailNum, currentTime);
        parsedData.requests.push(myRequest);
        parsedData.totalNumofRequests++;
        let stringedData = JSON.stringify(parsedData);
        console.log(parsedData.totalNumofRequests);
        fs.writeFile('RequestTracker.json', stringedData, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("file saved")
        });
    });

    // return JSON.parse(data);
    // console.log(data);
}

// fs.readFileSync('./RequestTracker.json', 'utf8', function (err, contents) {
//     if (err) throw err;
//     console.log(contents.totalNumofRequests);
//     let thisRequest = new request(tailNum, date + ' '+time);
//     let requests = contents.requests;

//     requests.push(thisRequest)
// });

exports.planeRequest = function (plane) {

    let today = new Date();
    let time = today.getTime();

    if (plane.flightReqTime == undefined) {
        plane.flightReqTime = time;
        return true;
    } else {
        let timeToCall = plane.flightReqTime + exports.repeatCallTime;

        if (time > timeToCall) {
            plane.flightReqTime = time;
            return true;
        } else {
            return false;
        }
    }

}