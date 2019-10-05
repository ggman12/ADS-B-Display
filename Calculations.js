function posData(latitude, longitude, heading, destination) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.heading = heading;
    this.destination = destination;
}


exports.calculateAngle = function(planePos, destinationPos){
    var angleDeg = Math.atan2(planePos.latitude-destinationPos.latitude ,planePos.longitude- destinationPos.longitude ) *  180/Math.PI;
    return (-angleDeg + 90 );
}


exports.getPositionOnPath = function(startPt,endPt,percent) {
    
    let dlatitude = endPt.latitude-startPt.latitude;
    let dlongitude = endPt.longitude-startPt.longitude;
    let latitude = startPt.latitude + dlatitude*percent;
    let longitude = startPt.longitude + dlongitude*percent;
    return( {latitude:latitude,longitude:longitude} );
}

exports.getCurrentTime = function(){
    let myDate = new Date();
    let currentTime = myDate.getTime();
    return currentTime;
}
