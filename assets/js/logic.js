
// Function to handle marker change colors
function markerColor(intensity) {
  if (intensity <= 1) {
      return "#ADFF2F";
  } else if (intensity <= 2) {
      return "#9ACD32";
  } else if (intensity <= 3) {
      return "#FFFF00";
  } else if (intensity <= 4) {
      return "#ffd700";
  } else if (intensity <= 5) {
      return "#FFA500";
  } else {
      return "#FF0000";
  };
}


// Store our API endpoint inside queryUrl
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var queryUrl = "https://raw.githubusercontent.com/tayyabsayyad/flood-management/main/assets/geojson/flooded_areas.geojson"

Mumbai_Wards = "https://raw.githubusercontent.com/tayyabsayyad/flood-management/main/assets/geojson/BMC_Wards_New.geojson";

var mapOverLayes = new L.LayerGroup();

d3.json(Mumbai_Wards, function (geoJson) {
   L.geoJSON(geoJson.features, {
       style: function (geoJsonFeature) {
           return {
               weight: 2,
               color: 'Red '
           }
       },
   }).addTo(mapOverLayes);
})


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(floodData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.name +
      "</h3><hr><p>" + feature.properties.intensity + "</p>");
  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var flood = L.geoJSON(floodData, {
    onEachFeature: onEachFeature
  });
  

  var floodMarkers = [];

  for (var i = 0; i < floodData.length; i++) {
    floodMarkers.push(L.circle([floodData[i].geometry.coordinates[1],floodData[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: markerColor(floodData[i].properties.intensity),
      fillColor: markerColor(floodData[i].properties.intensity),
      // Adjust radius
      radius: floodData[i].properties.intensity * 100 
    }).bindPopup("Area :"+ floodData[i].properties.name+ "<br>"+"Intensity :"+floodData[i].properties.intensity) 
    )

    // Now we can handle them as one group instead of referencing each individually
    var floodLayer = L.layerGroup(floodMarkers);
    }

    
    // Sending our earthquakes layer to the createMap function  
    createMap(floodLayer);
  }
    

function createMap(flood) {

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


 
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
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
     "Flood Areas": flood,
    "Wards Boundary": mapOverLayes,
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




