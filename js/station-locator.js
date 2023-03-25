mapboxgl.accessToken = mapBoxKey;

const map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/streets-v12', // Map style to use
    center: [-98.4946, 29.4252], // Starting position [lng, lat]
    zoom: 12 // Starting zoom level
});

const marker = new mapboxgl.Marker ({ // Initialize a new marker
    draggable: true
})
    .setLngLat([-98.491142,29.424349])// Marker [lng, lat] coordinates
    .addTo(map); // Add the marker to the map

marker.on('dragend', function(e){
    console.log(marker)
    let html = "";
    let longlat = e.target._lngLat;
    console.log(longlat)
    console.log( $.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.geojson?api_key=${stationKey}&longitude=${longlat.lng}&latitude=${longlat.lat}`));
    $.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.geojson?api_key=${stationKey}&longitude=${longlat.lng}&latitude=${longlat.lat}`).done(function (data) {
        for(let i = 0; i < data.features.length; i++) {
            const station = data.features[i];
            const lngLat = station.geometry.coordinates;
            const name = station.properties.station_name;
            const address = station.properties.street_address;
            const fuelType = station.properties.fuel_type_code;
            const distance = station.properties.distance;

            // Create a marker for the gas station
            const stationMarker = new mapboxgl.Marker()
                .setLngLat(lngLat)
                .addTo(map);

            // Create a popup for the gas station
            const popup = new mapboxgl.Popup()
                .setHTML(`<h3>${name}</h3><p>Address: ${address}</p><p>Fuel type: ${fuelType}</p><p>Distance: ${distance} miles</p>`);

            // Attach the popup to the marker
            stationMarker.setPopup(popup);
        }
    })
});


const geocoder = new MapboxGeocoder({
    // Initialize the geocoder
    accessToken: mapboxgl.accessToken, // Set the access token
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: false, // Do not use the default marker style
    placeholder: 'Search for places in San Antonio', // Placeholder text for the search bar
    bbox: [-98.8787, 29.3555, -97.9653, 29.5689], // Boundary for San Antonio
    proximity: {
        longitude: -98.4946,
        latitude: 29.4252
    } // Coordinates of San Antonio
});
29.35554277897762, -98.87873296826862
// Add the geocoder to the map
map.addControl(geocoder);

// After the map style has loaded on the page,
// add a source layer and default styling for a single point
map.on('load', () => {
    map.addSource('single-point', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': []
        }
    });

    map.addLayer({
        'id': 'point',
        'source': 'single-point',
        'type': 'circle',
        'paint': {
            'circle-radius': 10,
            'circle-color': '#448ee4'
        }
    });

    // Listen for the `result` event from the Geocoder // `result` event is triggered when a user makes a selection
    //  Add a marker at the result's coordinates
    geocoder.on('result', (event) => {
        map.getSource('single-point').setData(event.result.geometry);
    });
});






