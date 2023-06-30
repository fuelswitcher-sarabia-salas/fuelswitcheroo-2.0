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
    .setLngLat([-98.491142, 29.424349])// Marker [lng, lat] coordinates
    .addTo(map); // Add the marker to the map

const fuelType = document.getElementById('fuel-type');

function searchStation(searchString) {
    let html = "";
    geocode(searchString, mapBoxKey).then(function (results) {
        let myOptionsObj = {
            center: results,
            zoom: 12
        };
        map.flyTo(myOptionsObj);
        marker.setLngLat(results);

        let ELEC = ELEC;

        $.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.geojson?api_key=${stationKey}&longitude=${results[0]}&latitude=${results[1]}&type=GAS_STATION&fuel_type_code=ELEC`).done(function (data) {
            for(let i = 0; i <= 4; i++) {
                const station = data.features[i];
                const lngLat = station.geometry.coordinates;
                const name = station.properties.station_name;
                const address = station.properties.street_address;
                const fuelType = station.properties.fuel_type_code;
                const distance = station.properties.distance;

                if(fuelType === "CNG") {
                    //Create a marker for the station
                    const stationCNG = new mapboxgl.Marker({
                        color: '#43ff43'
                    })
                        .setLngLat(lngLat)
                        .addTo(map);


                    // Create a popup for the station
                    const popup = new mapboxgl.Popup()
                        .setHTML(`<h4>${name}</h4>
                              <p>Address: ${address}</p>
                              <p>Fuel type: Compressed Natural Gas, ${fuelType}</p>
                              <p>Distance From You: ${distance.toFixed(2)} miles</p>`);

                    // Attach the popup to the marker
                    stationCNG.setPopup(popup);
                }else if(fuelType === "ELEC") {
                    const stationELEC = new mapboxgl.Marker({
                        color: '#2b4881'
                    })
                        .setLngLat(lngLat)
                        .addTo(map);


                    // Create a popup for the station
                    const popup = new mapboxgl.Popup()
                        .setHTML(`<h4>${name}</h4>
                              <p>Address: ${address}</p>
                              <p>Fuel type: Electrical Gas, ${fuelType}</p>
                              <p>Distance From You: ${distance.toFixed(2)} miles</p>`);

                    // Attach the popup to the marker
                    stationELEC.setPopup(popup);
                }else if(fuelType === "HY") {
                    const stationHY = new mapboxgl.Marker({
                        color: '#ff0000',
                    })
                        .setLngLat(lngLat)
                        .addTo(map);


                    // Create a popup for the station
                    const popup = new mapboxgl.Popup()
                        .setHTML(`<h4>${name}</h4>
                              <p>Address: ${address}</p>
                              <p>Fuel type: Hydrogen, ${fuelType}</p>
                              <p>Distance From You: ${distance.toFixed(2)} miles</p>`);

                    // Attach the popup to the marker
                    stationHY.setPopup(popup);
                }
            }
        })
    })
}

$("#myBtn").on("click", function(e){
    e.preventDefault();
    searchStation($("#searchInput").val());
})


let toggleLegend = document.querySelector("#toggleLegend");

marker.on('dragend', function(e){
    let html = "";
    let longlat = e.target._lngLat;

    $.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.geojson?api_key=${stationKey}&longitude=${longlat.lng}&latitude=${longlat.lat}&type=GAS_STATION`).done(function (data) {
        for(let i = 0; i <= 10; i++) {
            const station = data.features[i];
            const lngLat = station.geometry.coordinates;
            const name = station.properties.station_name;
            const address = station.properties.street_address;
            const fuelType = station.properties.fuel_type_code;
            const distance = station.properties.distance;


            if(fuelType === "CNG") {
                //Create a marker for the station
                const stationCNG = new mapboxgl.Marker({
                    color: '#43ff43'
                })
                    .setLngLat(lngLat)
                    .addTo(map);


                // Create a popup for the station
                const popup = new mapboxgl.Popup()
                    .setHTML(`<h4>${name}</h4>
                              <p>Address: ${address}</p>
                              <p>Fuel type: Compressed Natural Gas, ${fuelType}</p>
                              <p>Distance From You: ${distance.toFixed(2)} miles</p>`);

                // Attach the popup to the marker
                stationCNG.setPopup(popup);
            }else if(fuelType === "ELEC") {
                const stationELEC = new mapboxgl.Marker({
                    color: '#2b4881'
                })
                    .setLngLat(lngLat)
                    .addTo(map);


                // Create a popup for the station
                const popup = new mapboxgl.Popup()
                    .setHTML(`<h4>${name}</h4>
                              <p>Address: ${address}</p>
                              <p>Fuel type: Electrical Gas, ${fuelType}</p>
                              <p>Distance From You: ${distance.toFixed(2)} miles</p>`);

                // Attach the popup to the marker
                stationELEC.setPopup(popup);
            }else if(fuelType === "HY") {
                const stationHY = new mapboxgl.Marker({
                    color: '#ff0000',
                })
                    .setLngLat(lngLat)
                    .addTo(map);


                // Create a popup for the station
                const popup = new mapboxgl.Popup()
                    .setHTML(`<h4>${name}</h4>
                              <p>Address: ${address}</p>
                              <p>Fuel type: Hydrogen, ${fuelType}</p>
                              <p>Distance From You: ${distance.toFixed(2)} miles</p>`);

                // Attach the popup to the marker
                stationHY.setPopup(popup);
            }
        }
    });

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
                'circle-color': '#d641ff'
            }
        });


        // Listen for the `result` event from the Geocoder // `result` event is triggered when a user makes a selection
        //  Add a marker at the result's coordinates
    })});


