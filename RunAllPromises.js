var Planes = [{hexcode: "45ce46"}]
var allSettled = require('promise.allsettled');
var storage = require('./Storage');
var Planes = [];





var PromiseCreator = require('./PromiseCreator');
async function Run() {
    Planes.push({hexcode: "678786"});
    Planes.push({hexcode: "45ce56"});
    Planes.push({hexcode: "3de584"});
    Planes.push({hexcode: "45ce48"});
    Planes.push({hexcode: "3c4b28"});
    var addPlanes = await storage.LoadStorage(false);
    // var planesToRun = Planes.concat(addPlanes);
    var planesToRun = Planes.concat(addPlanes);



    allSettled(PromiseCreator(planesToRun)).then((results) => {
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            if(element.status == "rejected"){
                console.log(element);
               
            } else if(element.status == "fulfilled"){
                console.log(element.error);

            }

        }
    }).catch((error=> console.log("There was a big time error" + error)));
    
}

Run();