<script lang="ts">
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { baseMaps, tileLayers } from "../lib/MapOptions";
  import * as GeoSearch from "leaflet-geosearch";
  import "leaflet-geosearch/dist/geosearch.css";

  const provider = new GeoSearch.OpenStreetMapProvider();
  const markers = writable(new Map()); // Use Map instead of Array for O(1) lookups
  let map: any = null;
  let eventSource: EventSource | null = null;

  // Initialize map
  function initializeMap() {
    if (map) return; // Prevent multiple initializations

    map = L.map("map", {
      center: [14.73531212665073, 121.15222623045906],
      zoom: 13,
    });

    // Initial tile layer with better memory management
    const baseLayer = L.tileLayer(tileLayers[0].url, {
      ...tileLayers[0].options,
      keepBuffer: 2, // Reduce the number of tiles kept in memory
    });
    baseLayer.addTo(map);

    // Add multi layers
    L.control.layers(baseMaps).addTo(map);

    // Add search control
    map.addControl(
      GeoSearch.GeoSearchControl({
        provider: provider,
        style: "button",
      }),
    );

    // Debounced click handler
    let clickTimeout: number;
    map.on("click", (e: { latlng: any }) => {
      if (clickTimeout) {
        window.clearTimeout(clickTimeout);
      }
      clickTimeout = window.setTimeout(() => {
        alert(`You clicked the map at ${e.latlng}`);
      }, 300);
    });
  }

  function listenFromSSE() {
    if (eventSource) {
      eventSource.close();
    }

    //eventSource = new EventSource("https://ipick-server.onrender.com/events");
    eventSource = new EventSource("http://localhost:3000/events");
    // Use a debounced update function
    let updateTimeout: number;

    eventSource.onmessage = (event) => {
      if (updateTimeout) {
        window.clearTimeout(updateTimeout);
      }

      updateTimeout = window.setTimeout(() => {
        const locationsArray = JSON.parse(event.data);
        locationsArray.forEach((location: any) => {
          updateMarker(location);
        });
      }, 100); // Debounce updates to prevent excessive rendering
    };
  }

  function updateMarker(data: any) {
    if (!map) return;

    markers.update((markersMap) => {
      const existingMarker = markersMap.get(data.device_id);

      if (existingMarker) {
        existingMarker.setLatLng([data.latitude, data.longitude]);
        existingMarker.setPopupContent(`
          <b>Device ID:</b> ${data.device_id}<br>
          <b>Latitude:</b> ${data.latitude}<br>
          <b>Longitude:</b> ${data.longitude}<br>
          <b>Timestamp:</b> ${new Date(data.timestamp).toLocaleString()}
        `);
      } else {
        const marker = L.marker([data.latitude, data.longitude]).addTo(map);
        marker.bindPopup(`
          <b>Device ID:</b> ${data.device_id}<br>
          <b>Latitude:</b> ${data.latitude}<br>
          <b>Longitude:</b> ${data.longitude}<br>
          <b>Timestamp:</b> ${new Date(data.timestamp).toLocaleString()}
        `);
        markersMap.set(data.device_id, marker);
      }

      return markersMap;
    });
  }

  // Proper cleanup
  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
    if (map) {
      map.remove(); // Properly removes the map and all event listeners
      map = null;
    }
    markers.set(new Map()); // Clear all markers
  });

  onMount(() => {
    initializeMap();
    listenFromSSE();
  });
</script>

<div class="container">
  <div id="map"></div>
</div>

<style>
  .container {
    padding-left: 1rem;
  }
  #map {
    height: 100svh;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
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
