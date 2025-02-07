<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import { Loader } from "@googlemaps/js-api-loader";

  // A Svelte store to track markers by device ID.
  const markers = writable(new Map<string, google.maps.Marker>());
  let map: google.maps.Map;
  let eventSource: EventSource | null = null;
  let markerInfoWindow: google.maps.InfoWindow;

  /**
   * Loads the Google Maps API and initializes the map.
   */
  async function initializeMap() {
    // Load the Google Maps API with the Places library (for search)
    const loader = new Loader({
      apiKey: "AIzaSyBTVoAYJ7vxQ5cSiIRYDc7_b0nJB-X6QR8", // Replace with your API key
      version: "weekly",
      libraries: ["places"],
    });
    await loader.load();

    // Initialize the map
    const mapDiv = document.getElementById("map") as HTMLElement;
    map = new google.maps.Map(mapDiv, {
      center: { lat: 14.73531212665073, lng: 121.15222623045906 },
      zoom: 13,
      mapTypeControl: true, // Enables the base map type control
    });

    // Create and add a search box (mimicking your Leaflet GeoSearch control)
    const input = document.getElementById("pac-input") as HTMLInputElement;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    const searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results toward the map's current viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });

    // When the user selects a place, zoom to its bounds.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (!places || places.length === 0) return;

      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) return;
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

  /**
   * Listens to server-sent events (SSE) and updates markers.
   */
  function listenFromSSE() {
    if (eventSource) {
      eventSource.close();
    }
    // Uncomment and change the URL as needed.
    // eventSource = new EventSource("https://ipick-server.onrender.com/events");
    eventSource = new EventSource("http://192.168.1.31:3000/events");

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
      }, 100);
    };
  }

  /**
   * Updates an existing marker or creates a new one.
   * @param data - The location data containing device_id, latitude, longitude, and timestamp.
   */
  function updateMarker(data: any) {
    if (!map) return;

    markers.update((markersMap) => {
      const existingMarker = markersMap.get(data.device_id);
      const position = { lat: data.latitude, lng: data.longitude };

      if (existingMarker) {
        // Update the marker position and store the new data.
        existingMarker.setPosition(position);
        // Save the latest data in a custom property.
        (existingMarker as any).myData = data;
      } else {
        // Create a new marker.
        const marker = new google.maps.Marker({
          position,
          map,
          title: `Device ${data.device_id}`,
        });
        // Store the location data on the marker.
        (marker as any).myData = data;

        // When the marker is clicked, show an info window with device details.
        marker.addListener("click", () => {
          const d = (marker as any).myData;
          markerInfoWindow.setContent(`
            <div>
              <b>Device ID:</b> ${d.device_id}<br>
              <b>Latitude:</b> ${d.latitude}<br>
              <b>Longitude:</b> ${d.longitude}<br>
              <b>Timestamp:</b> ${new Date(d.timestamp).toLocaleString()}
            </div>
          `);
          markerInfoWindow.open(map, marker);
        });
        markersMap.set(data.device_id, marker);
      }
      return markersMap;
    });
  }

  // Cleanup when the component is destroyed.
  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
  });

  // Initialize the map and start listening for events when the component mounts.
  onMount(async () => {
    await initializeMap();
    markerInfoWindow = new google.maps.InfoWindow();
    listenFromSSE();
  });
</script>

<!--
  The container includes an input element for the search box and a div for the map.
-->
<div class="container">
  <input id="pac-input" class="controls" type="text" placeholder="Search Box" />
  <div id="map"></div>
</div>

<style>
  .container {
    position: relative;
    padding: 1rem;
  }

  /* Fullscreen map container */
  #map {
    height: 100vh;
    width: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  /* Styles for the search input */
  .controls {
    margin-top: 10px;
    border: 1px solid transparent;
    border-radius: 2px 0 0 2px;
    box-sizing: border-box;
    height: 32px;
    outline: none;
    padding: 0 12px;
    width: 300px;
  }

  @media (max-width: 768px) {
    .container {
      width: 100vw;
      height: 90vh;
    }
    #map {
      height: 100%;
    }
  }
</style>
