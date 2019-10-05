var express = require("express");
var app = express();
var storage = require('./Storage');

var reqTracker = require('./FlightXMLRequestTracker');
var Loop = require("./Loop")
var Planes = [];
var socket = require("socket.io");
var bodyParser = require('body-parser');
var DataTypes = require("./DataTypes");
var PromiseClasses = require('./PromiseClasses');
var Airports = new DataTypes.Airports();

//types: "openSky", "FlightXML", "Draw", "Not Live"
async function Startup() {

    Planes = await storage.LoadStorage(false);

    Planes.forEach(element => {
        element.type = "openSky";

    });

}

// console.log(Planes);

//Routes
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", function (req, res) {

    res.render("index", {
        Planes: Planes,
        Airports: Airports
    });
    if (count <= 0) {}

});
app.get("/Input", function (req, res) {
    res.render("PlaneInput", {
        Planes: Planes,
        Airports: Airports

    });
});
app.post("/changeFlightXMLSetting", function (req, res) {
    if (PromiseClasses.FlightXMLOP == false) {
        PromiseClasses.FlightXMLOP = true
    } else if (PromiseClasses.FlightXMLOP == true) {
        PromiseClasses.FlightXMLOP = false;
    }

    res.status(204).send();
    console.log(PromiseClasses.FlightXMLOP)
    io.emit("ChangeInFlightXMLOPState",
        PromiseClasses.FlightXMLOP

    )
})
app.post("/addPlane", function (req, res) {
    console.log(req.body);
    let myPlane = new DataTypes.Plane();;

    if (req.body.hexcode !== "" && req.body.hexcode != undefined) {
        let hexcode = req.body.hexcode;
        myPlane.hexcode = hexcode;
    }
    if (req.body.tailNumber !== "" && req.body.tailNumber != undefined) {
        let tailNumber = req.body.tailNumber;
        myPlane.tailNumber = tailNumber;
    }
    myPlane.type = "openSky"

    Planes.push(myPlane);
    io.emit("AddPlane", {
        Plane: myPlane
    })
    res.redirect("/Input");
});
app.post("/changeFlightXMLTimer", function (req, res) {
    // console.log(req.body);
    DataTypes.repeatCallTime = req.body.number * 1000;
    res.status(204).send();

});
var ToChangeToFlightXML = false
app.post("/changeAllToFlightXML", function (req, res) {
    ToChangeToFlightXML = true;
    res.status(204).send();

});
// app.post("/changeDraw", function (req,res) {

// })
app.post("/ChangePlaneType", function (req, res) {
    let foundPlane = findPlane(undefined, req.body.ID)
    foundPlane.type = req.body.type;
    res.redirect("/Input");
})
app.post("/deletePlane", function (req, res) {
    console.log(req.body.ID)
    let plane = findPlane(undefined, req.body.ID)
    io.emit("AirplaneDelete", {
        Plane: plane

    })
    findPlane(undefined, req.body.ID, true)
    res.redirect("/Input");

})

var listener = app.listen(process.env.port, function () {
    Startup();

    console.log("ABS-D Display Server has started" + listener.address().port);
});

//Socket Setup
var count = 0;
var io = socket(listener);
var SocketSetup = require('./SocketSetup')
// SocketSetup.Setup(io, count);
io.sockets.on('connection', function (socket) {
    console.log("socket connection", socket.id);
    if (count <= 0) {
        PromiseClasses.FlightXMLOP = true
       
    setTimeout(Main, 1000);

    }
    io.emit("ChangeInFlightXMLOPState",
    PromiseClasses.FlightXMLOP

)
    console.log(PromiseClasses.FlightXMLOP)

    count++;
    console.log(count);

    socket.on('disconnect', (reason) => {
        count--;
        if(count == 0 ){
            PromiseClasses.FlightXMLOP = false;

        }
        
        console.log(count);
    });

});

//#region Exit
process.stdin.resume();
process.on('SIGINT', function () {
    console.log("Run Exit")
    exit();

});
process.on('exit', function () {
    console.log("ran exit in debugger");
    exit();
})

function exit() {
    storage.SavePlanes(Planes);
    process.exit(99);
}
//#endregion 
async function Main() {
    console.log("loop");

    Loop(io, Planes, Airports).then(() => {
        if (count > 0) {
            if(ToChangeToFlightXML == true){
                Planes.forEach(element => {
                    element.type = "FlightXML"
                });
                ToChangeToFlightXML = false;
            }
            setTimeout(Main, 1000);
            console.log("Ran Loop loop thing");
        }




    });

}

function findPlane(plane, ID, isDelete) {
    for (let i = 0; i < Planes.length; i++) {
        const element = Planes[i];
        if (plane != undefined) {
            if (element.ID === plane.ID) {
                return element
            }
        } else if (ID != undefined) {
            if (element.ID === ID) {
                if (isDelete == true) {
                    Planes.splice(i, 1)
                } else {
                    return element;
                }

            }
        }


    }
}