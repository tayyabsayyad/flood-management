// Logic for Earthquake Map


// Function to handle marker change colors
function markerColor(mag) {
  if (mag <= 1) {
      return "#ADFF2F";
  } else if (mag <= 2) {
      return "#9ACD32";
  } else if (mag <= 3) {
      return "#FFFF00";
  } else if (mag <= 4) {
      return "#ffd700";
  } else if (mag <= 5) {
      return "#FFA500";
  } else {
      return "#FF0000";
  };
}


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


API_plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"



var plateBoundary = new L.LayerGroup();

d3.json(API_plates, function (geoJson) {
   L.geoJSON(geoJson.features, {
       style: function (geoJsonFeature) {
           return {
               weight: 2,
               color: 'Red '
           }
       },
   }).addTo(plateBoundary);
})


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  

  var earthquakeMarkers = [];

  for (var i = 0; i < earthquakeData.length; i++) {
    //markerColor(earthquakeData[i].properties.mag);
    earthquakeMarkers.push(L.circle([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: markerColor(earthquakeData[i].properties.mag),
      fillColor: markerColor(earthquakeData[i].properties.mag),
      // Adjust radius
      radius: earthquakeData[i].properties.mag * 30000 
    }).bindPopup("<h1>Hello</h3>") 
    )

    // Now we can handle them as one group instead of referencing each individually
    var earthquakeLayer = L.layerGroup(earthquakeMarkers);
  }

    
    // Sending our earthquakes layer to the createMap function  
    createMap(earthquakeLayer);
  }
    

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var satellite = L.tileLayer("", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite"
  });

 var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

 var googleMap = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  })

  var googleSat = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });


  var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={pk.eyJ1IjoidGF5eWFic2F5eWFkMjM2IiwiYSI6ImNsOWpxbWRkaDBheWgzd3A5a21hdjZ3dWoifQ.aXSE2qC-HuyTCW3V8MO52Q}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: "pk.eyJ1IjoidGF5eWFic2F5eWFkMjM2IiwiYSI6ImNsOWpxbWRkaDBheWgzd3A5a21hdjZ3dWoifQ.aXSE2qC-HuyTCW3V8MO52Q"
  });

  var outdors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={pk.eyJ1IjoidGF5eWFic2F5eWFkMjM2IiwiYSI6ImNsOWpxbWRkaDBheWgzd3A5a21hdjZ3dWoifQ.aXSE2qC-HuyTCW3V8MO52Q}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: "pk.eyJ1IjoidGF5eWFic2F5eWFkMjM2IiwiYSI6ImNsOWpxbWRkaDBheWgzd3A5a21hdjZ3dWoifQ.aXSE2qC-HuyTCW3V8MO52Q"
  });

  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite Map": satellite,
    "Gray Scale Map": grayscale,
    "Outdors Map": outdors,
    "Open Street Map":osm,
    "Google Map":googleMap,
    "Google Sattelite":googleSat,
    "Open Topo Map": OpenTopoMap,

  };

  // Create Bounds so that user can only zoon in and out but not to move anywhere in the map except mumbai
  // Specify the South West and North East Lat Longs to specify the bounds 

  var southWest = L.latLng(18.90669641357299, 72.75066699108694);
  var northEast = L.latLng(19.315880192287736, 73.00941602698519);
  bounds = L.latLngBounds(southWest, northEast);


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Plates Boundary": plateBoundary,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      19.16523806696106, 72.88392128085071
    ],
    zoom: 11,
    layers: [osm, googleMap, googleSat],
    maxBounds: bounds,
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}




