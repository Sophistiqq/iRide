<script lang="ts">
  import { logout } from "../lib/auth";
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  import { onMount } from "svelte";

  onMount(() => {
    const map = L.map("map", {
      center: L.latLng(49.2125578, 16.62662018),
      zoom: 14,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution:
        '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  });
</script>

<div class="container">
  <button on:click={logout}>Logout</button>

  <div id="map"></div>
</div>

<style>
  .container {
    height: 92.5vh;
  }

  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    height: 92.5vh;
    width: 100%;
  }
</style>
