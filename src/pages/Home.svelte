<script lang="ts">
  import { logout } from "../lib/auth";
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  import { onMount } from "svelte";

  onMount(() => {
    initializeMap();
  });

  function initializeMap() {
    const map = L.map("map", {
      // Center on Rodriguez Rizal
      center: [14.73531212665073, 121.15222623045906],
      zoom: 13,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {
      foo: "bar",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Zoom to user's location on load or the default center
    map.locate({ setView: true, maxZoom: 25 });
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
