





function GPXTrack(xmlDoc) {
    this.xmlDoc = xmlDoc;
    this.mintrackpointdelta = 0.0001;
}

function GPXTrackPoint(id,lat, lon, previousGPXTrackPoint){
    this.id = id;
    this.lat = lat;
    this.lon = lon;
    this.previousGPXTrackPoint = previousGPXTrackPoint;
    this.distance = function() { 
        return haversine_distance(this.lat, this.lon, previousGPXTrackPoint.lat, previousGPXTrackPoint.lon);
    };
}

// Set the minimum distance between trackpoints.
// Used to cull unneeded trackpoints from map.
GPXTrack.prototype.setMinTrackPointDelta = function(delta) {
    this.mintrackpointdelta = delta;
}

GPXTrack.prototype.processTrackpoints = function() {
    var tracks = this.xmlDoc.documentElement.getElementsByTagName("trk");
    for(var i = 0; i < tracks.length; i++) {
        this.processTrack(tracks[i]);
    }
}

GPXTrack.prototype.processTrack = function(track) {
    var segments = track.getElementsByTagName("trkseg");
    for(var i = 0; i < segments.length; i++) {
        var segmentlatlngbounds = this.processTrackSegment(segments[i]);
    }
    }

GPXTrack.prototype.processTrackSegment = function(trackSegment) {
    var trackpoints = trackSegment.getElementsByTagName("trkpt");
    if(trackpoints.length == 0) {
        return;
    }

    var pointarray = [];

    // process first point
    var lastlon = parseFloat(trackpoints[0].getAttribute("lon"));
    var lastlat = parseFloat(trackpoints[0].getAttribute("lat"));
    var GPXTrackPoint = new GPXTrackPoint(0,lastlat,lastlon);
    
    pointarray.push(GPXTrackPoint);

    for(var i = 1; i < trackpoints.length; i++) {
        var lon = parseFloat(trackpoints[i].getAttribute("lon"));
        var lat = parseFloat(trackpoints[i].getAttribute("lat"));

        // Verify that this is far enough away from the last point to be used.
        var latdiff = lat - lastlat;
        var londiff = lon - lastlon;
        if(Math.sqrt(latdiff*latdiff + londiff*londiff)
                > this.mintrackpointdelta) {
            lastlon = lon;
            lastlat = lat;
            GPXTrackPoint  = new GPXTrackPoint(pointarray.length,lastlat,lastlon, pointarray[i-1]);
            pointarray.push(GPXTrackPoint);
        }
    }

}

function haversine_distance(coord1Lat, coord1Lng, coord2Lat, coord2Lng) {
    const R = 6371; // Radius of the Earth in km
    const rlat1 = coord1Lat * (Math.PI/180); // Convert degrees to radians
    const rlat2 = coord2Lat * (Math.PI/180); // Convert degrees to radians
    const difflat = rlat2-rlat1; // Radian difference (latitudes)
    const difflon = (coord2Lng-coord1Lng) * (Math.PI/180); // Radian difference (longitudes)
  
    const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    return d;   // distance in km
  }

  
