<script lang="ts">
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { baseMaps, tileLayers } from "../lib/MapOptions";
  import * as GeoSearch from "leaflet-geosearch";
  import "leaflet-geosearch/dist/geosearch.css";
  const provider = new GeoSearch.OpenStreetMapProvider();
  // Run on mount or load
  onMount(() => {
    initializeMap();
    listenFromSSE();
  });

  let markers = writable([]);
  let map: any;
  // Initialize map
  function initializeMap() {
    map = L.map("map", {
      center: [14.73531212665073, 121.15222623045906],
      zoom: 13,
    });

    // Initial tile layer
    L.tileLayer(tileLayers[0].url, tileLayers[0].options).addTo(map);

    // Add multi layers
    L.control.layers(baseMaps).addTo(map);

    // Multi markers
    //const markers = [
    //  [14.73531212665073, 121.15222623045906],
    //  [14.750308756394281, 121.16546630859376],
    //  [14.734701940136672, 121.14675521850587],
    //];

    // Render markers
    $markers.forEach((marker: any) => {
      L.marker(marker).addTo(map);
    });

    map.addControl(
      GeoSearch.GeoSearchControl({
        provider: provider,
        style: "button",
      }),
    );
    //Alert the location on the map on clicking the map for testing
    map.on("click", (e: { latlng: any }) => {
      alert(`You clicked the map at ${e.latlng}`);
    });
  }
  let data: { latitude: any; longitude: any };

  async function listenFromSSE() {
    const eventSource = new EventSource(
      "https://ipick-server.onrender.com/events",
    );

    eventSource.onmessage = (event) => {
      // data contains {"_id":"67a3224d5d28fa21b24a7d09","device_id":"esp32-12345","latitude":14.7392596,"longitude":121.1558978,"timestamp":"2025-02-05T08:33:17.172Z"}
      // we will store it to the state and render it to the map
      data = JSON.parse(event.data);
      // Set the markers with the new data, replace the old location of the device
      updateMarker(data);
    };

    return () => {
      eventSource.close();
    };
  }

  async function updateMarker(data: any) {
    // Check if marker with the same device_id already exists
    let existingMarker = $markers.find(
      (marker: any) => marker.device_id === data.device_id,
    );

    if (existingMarker) {
      // Move the existing marker to the new location
      existingMarker.setLatLng([data.latitude, data.longitude]);
    } else {
      // Create a new marker if it doesn't exist
      const marker = L.marker([data.latitude, data.longitude]).addTo(map);
      marker.device_id = data.device_id;

      // Bind a popup with the device info
      marker.bindPopup(`
        <b>Device ID:</b> ${data.device_id}<br>
        <b>Latitude:</b> ${data.latitude}<br>
        <b>Longitude:</b> ${data.longitude}<br>
        <b>Timestamp:</b> ${new Date(data.timestamp).toLocaleString()}
      `);

      // Add the new marker to the markers store
      markers.update((currentMarkers) => [...currentMarkers, marker]);
    }
  }
</script>

<div class="container">
  <div id="map"></div>
</div>

<style>
  .container {
    width: 100svw;
  }

  #map {
    height: 100svh;
    width: auto;
  }

  @media (max-width: 768px) {
    .container {
      width: 100vw;
      height: 90svh;
    }
    #map {
      height: 100%;
    }
  }
</style>
