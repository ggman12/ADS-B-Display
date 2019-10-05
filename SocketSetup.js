var app = require('./app')
module.exports.Setup = function (io, count) {
    io.sockets.on('connection', function (socket) {
        console.log("socket connection", socket.id);
        if (count <= 0) {
            
    
        }
        count++;
        console.log(count);
    
        io.sockets.on('disconnect', function () {
            count--;
            
            console.log(count);
        });
        // socket.on('PlaneInputTypeRequest', function () {
        //     io.sockets.emit('PlaneInputTypeRequest', Planes);
    
        // })
        socket.on('ChangePlaneStatus', function (data) {
            console.log(data);
            let plane = data.plane;
            let found = Planes[data.i]
            found.type = plane.type;
        })
    });
}
module.exports.ArraysUpdate = function (io, Planes, Airports) {
    io.emit("update", {
        Planes: Planes,
        Airports: Airports
    });
}
