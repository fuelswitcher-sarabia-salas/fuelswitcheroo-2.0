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

        let elec = 'ELEC';

    // &fuel_type_code=ELEC

        $.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.geojson?api_key=${stationKey}&longitude=${results[0]}&latitude=${results[1]}&type=GAS_STATION`).done(function (data) {
            for(let i = 0; i <= 4; i++) {
                //for all the stations
                const station = data.features[i];
                const lngLat = station.geometry.coordinates;
                const name = station.properties.station_name;
                const address = station.properties.street_address;
                const fuelType = station.properties.fuel_type_code;
                const distance = station.properties.distance;

                //for cng stations
                const cng_dispenser_num = station.properties.cng_dispenser_num;
                const cng_fill_type_code = station.properties.cng_fill_type_code;
                const cng_has_rng = station.properties.cng_has_rng;
                const cng_psi = station.properties.cng_psi;
                const cng_renewable_source = station.properties.cng_renewable_source;
                const cng_total_compression = station.properties.cng_total_compression;
                const cng_total_storage = station.properties.cng_total_storage;
                const cng_vehicle_class = station.properties.cng_vehicle_class;

                //for hydrogen stations
                const hy_is_retail = station.properties.hy_is_retail;

                if (fuelType === "CNG") {
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
                              <p>Distance From You: ${distance.toFixed(2)} miles</p>
                              <p>CNG dispensers installed: ${(cng_dispenser_num === null) ? "Unknown" : cng_dispenser_num}</p>
                              <p>Dispensing capability available: ${(cng_fill_type_code === "F") ? "Fast-fill" : (cng_fill_type_code === "T") ? "Time-fill" : (cng_fill_type_code === "B") ? "Fast-fill and time-fill" : "Unknown"}</p>
                              <p>Does the station sell renewable natural gas?: ${(cng_has_rng === "Y") ? "Yes" : "No"}</p>
                              <p>PSI pressures available: ${(cng_psi === null) ? "Unkown" : cng_psi } PSI</p>
                              <p>Type of renewable energy used to generate CNG: ${(cng_renewable_source === null) ? "Unkown" : cng_renewable_source }</p>
                              <p>Total compressor capacity per compresso (in standard cubic feet per minute (scfm)): ${(cng_total_compression === null) ? "Unkown" : cng_total_compression }</p>
                              <p>Total storage capacity (in standard cubic feet (scf)): ${(cng_total_storage === null) ? "Unkown" : cng_total_storage} </p>
                              <p>Maximum vehicle size: ${(cng_total_storage === "LD") ? "Passenger vehicles (class 1-2)" : (cng_total_storage === "MD") ? "Medium-duty (class 3-5)" : (cng_total_storage === "HD") ? "Heavy-duty (class 6-8)" : "Unknown"}</p>`);

                    // Attach the popup to the marker
                    stationCNG.setPopup(popup);
                } else if (fuelType === "ELEC") {
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
                } else if (fuelType === "HY") {
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
                              <p>Distance From You: ${distance.toFixed(2)} miles</p>
                              <p>Is hydrogen for sale at this stations: ${hy_is_retail ? 'Yes' : 'No'} </p>`);

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


marker.on('dragend', function(e){
    let html = "";
    let longlat = e.target._lngLat;

    $.get(`https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.geojson?api_key=${stationKey}&longitude=${longlat.lng}&latitude=${longlat.lat}&type=GAS_STATION`).done(function (data) {
        for(let i = 0; i <= 10; i++) {
            for(let i = 0; i <= 4; i++) {
                //for all the stations
                const station = data.features[i];
                const lngLat = station.geometry.coordinates;
                const name = station.properties.station_name;
                const address = station.properties.street_address;
                const fuelType = station.properties.fuel_type_code;
                const distance = station.properties.distance;

                //for cng stations
                const cng_dispenser_num = station.properties.cng_dispenser_num;
                const cng_fill_type_code = station.properties.cng_fill_type_code;

                //for hydrogen stations
                const hy_is_retail = station.properties.hy_is_retail;

                if (fuelType === "CNG") {
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
                              <p>Distance From You: ${distance.toFixed(2)} miles</p>
                              <p>CNG dispensers installed: ${(cng_dispenser_num === null) ? "Unknown" : cng_dispenser_num}</p>
                              <p>Dispensing capability available: ${(cng_fill_type_code === "F") ? "Fast-fill" : (cng_fill_type_code === "T") ? "Time-fill" : (cng_fill_type_code === "B") ? "Fast-fill and time-fill" : "Unknown"}</p>`);

                    // Attach the popup to the marker
                    stationCNG.setPopup(popup);
                } else if (fuelType === "ELEC") {
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
                } else if (fuelType === "HY") {
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
                              <p>Distance From You: ${distance.toFixed(2)} miles</p>
                              <p>Is hydrogen for sale at this stations: ${hy_is_retail ? 'Yes' : 'No'} </p>`);

                    // Attach the popup to the marker
                    stationHY.setPopup(popup);
                }
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


