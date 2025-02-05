<script lang="ts">
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  import { onMount } from "svelte";
  import { baseMaps, tileLayers } from "../lib/MapOptions";
  import * as GeoSearch from "leaflet-geosearch";
  import "leaflet-geosearch/dist/geosearch.css";
  import { run } from "svelte/legacy";
  const provider = new GeoSearch.OpenStreetMapProvider();
  // Run on mount or load
  onMount(() => {
    initializeMap();
    connectWebSocket();
  });

  let messages: any = [];
  let socket: WebSocket;

  function connectWebSocket() {
    // Establish WebSocket connection
    socket = new WebSocket("ws://192.168.1.31:3000/ws");

    // Handle incoming messages
    socket.addEventListener("message", (event) => {
      const message = event.data;
      messages = [...messages, message]; // Update the messages array
    });

    // Handle errors
    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Handle connection close
    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    // Cleanup on component destroy
    return () => {
      socket.close();
    };
  }

  function sendMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error("WebSocket is not open");
    }
  }

  // Initialize map
  function initializeMap() {
    const map = L.map("map", {
      center: [14.73531212665073, 121.15222623045906],
      zoom: 13,
    });

    // Initial tile layer
    L.tileLayer(tileLayers[0].url, tileLayers[0].options).addTo(map);

    // Add multi layers
    L.control.layers(baseMaps).addTo(map);

    // Multi markers
    const markers = [
      [14.73531212665073, 121.15222623045906],
      [14.750308756394281, 121.16546630859376],
      [14.734701940136672, 121.14675521850587],
    ];

    // Render markers
    markers.forEach((marker) => {
      L.marker(marker).addTo(map);
    });

    map.addControl(
      GeoSearch.GeoSearchControl({
        provider: provider,
        style: "bar",
      }),
    );
  }
</script>

<div class="container">
  <button onclick={() => sendMessage}>Click</button>
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
