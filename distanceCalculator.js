
function GPXWithDistance(filename) {
    this.filename = filename;
    this.distances = [];
    
}

var distances = [];

    async function initialLoadGPX() {
    const xml = await fetch("/src/HRP.gpx.xml")
        .then((res) => res.text())
        .then((str) =>
        new window.DOMParser().parseFromString(str, "text/xml")
        );
    const coords = Array.from(xml.querySelectorAll("trkpt")).map(
        (element) =>
        new google.maps.LatLng(
            Number(element.getAttribute("lat")),
            Number(element.getAttribute("lon"))
        )
    );
    distances = coords.reduce((old, ne, index, original) => {
        if (index > 0) {
        var trackPnt = {};
        trackPnt.latLng = ne;
        trackPnt.distanceToPreviousTrackPnt = haversine_distance(
            ne,
            original[index - 1]
        );
        old.push(trackPnt);
        } else {
        var trackPnt = {};
        trackPnt.latLng = ne;
        trackPnt.distanceToPreviousTrackPnt = 0;
        old.push(trackPnt);
        }

        return old;
    }, []);
    console.log(distances.length);
    //console.log(distances[0].distanceToPreviousTrackPnt);

    var Wannes = new google.maps.LatLng(
        Number("42.744851"),
        Number("-0.091281")
    );
    var index = GetNearestTrackPnt(Wannes);
    var distanceDone = GetDistanceToTrackPnt(index);
    console.log(distanceDone);
    }

    function GetNearestTrackPnt(coord1) {
    var indexShortestDistance = -1;
    var shortestDistance = -1;
    distances.forEach((element, index) => {
        var distance = haversine_distance(coord1, element.latLng);

        if (shortestDistance == -1 || distance < shortestDistance) {
        shortestDistance = distance;
        indexShortestDistance = index;
        }
    });
    
    return indexShortestDistance;
    }

    function GetDistanceToTrackPnt(index) {
    var totalDistance = 0.0;
    for (let i = 0; i < index; i++) {
        totalDistance += distances[i].distanceToPreviousTrackPnt;
    }
    return totalDistance;
    }

    function haversine_distance(coord1, coord2) {
    const R = 6371; // Radius of the Earth in km
    const rlat1 = coord1.lat() * (Math.PI / 180); // Convert degrees to radians
    const rlat2 = coord2.lat() * (Math.PI / 180); // Convert degrees to radians
    const difflat = rlat2 - rlat1; // Radian difference (latitudes)
    const difflon = (coord2.lng() - coord1.lng()) * (Math.PI / 180); // Radian difference (longitudes)

    const d =
        2 *
        R *
        Math.asin(
        Math.sqrt(
            Math.sin(difflat / 2) * Math.sin(difflat / 2) +
            Math.cos(rlat1) *
                Math.cos(rlat2) *
                Math.sin(difflon / 2) *
                Math.sin(difflon / 2)
        )
        );
    return d;
    }