import L from "leaflet";

// Define the base maps
const tileLayers = [
  {
    name: "OpenStreetMap",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}",
    options: {
      foo: "bar",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  {
    name: "OpenTopoMap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    options: {
      maxZoom: 17,
      attribution:
        'Map data: &copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> contributors',
    },
  },
  {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: {
      maxZoom: 17,
      attribution:
        'Map data: &copy; <a href="https://www.esri.com/en-us/home">Esri</a>',
    },
  },
];

// Create the base maps
let baseMaps = {
  OpenStreetMap: L.tileLayer(tileLayers[0].url, tileLayers[0].options),
  OpenTopoMap: L.tileLayer(tileLayers[1].url, tileLayers[1].options),
  Satellite: L.tileLayer(tileLayers[2].url, tileLayers[2].options),
};

// Export the base maps
export { baseMaps, tileLayers };
