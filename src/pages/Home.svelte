<script lang="ts">
  import { Loader } from "@googlemaps/js-api-loader";
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import mapMarker from "../assets/icon.png";
  let map: google.maps.Map;
  let eventSource: EventSource | null = null;
  let markerInfoWindow: google.maps.InfoWindow;
  const markers = writable(
    new Map<string, google.maps.marker.AdvancedMarkerElement>(),
  );

  // Add a Set to track active device IDs
  let activeDevices = new Set<string>();

  async function initializeMap() {
    const loader = new Loader({
      apiKey: "AIzaSyBTVoAYJ7vxQ5cSiIRYDc7_b0nJB-X6QR8",
      version: "weekly",
      libraries: ["places", "marker"],
    });

    // Load all required libraries first
    const { Map } = await loader.importLibrary("maps");
    const { InfoWindow } = (await loader.importLibrary(
      "maps",
    )) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = (await loader.importLibrary(
      "marker",
    )) as google.maps.MarkerLibrary;

    // Initialize map
    map = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 14.7289, lng: 121.1441 },
      zoom: 16,
      zoomControl: false,
      streetViewControl: false,
      rotateControl: true,
      //mapTypeControl: false,
      mapId: "f1b7b3e3b1b3b7f",
    });

    // Initialize InfoWindow after map is created
    markerInfoWindow = new InfoWindow();

    // Create initial marker
    const initialMarker = new AdvancedMarkerElement({
      map,
      position: { lat: 14.7289, lng: 121.1441 },
      title: "Current",
    });

    initialMarker.addListener("click", () => {
      markerInfoWindow.setContent(`
          <b>Initial Marker</b><br>
          <b>Latitude:</b> 14.7289<br>
          <b>Longitude:</b> 121.1441
      `);
      markerInfoWindow.open(map, initialMarker);
    });

    // Only start SSE after map is fully initialized
    listenFromSSE();
  }

  function listenFromSSE() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource("http://192.168.1.31:3000/events");

    let updateTimeout: number;
    eventSource.onmessage = (event) => {
      if (updateTimeout) {
        window.clearTimeout(updateTimeout);
      }

      updateTimeout = window.setTimeout(() => {
        // Clear the active devices set before processing new data
        activeDevices.clear();

        const locationsArray = JSON.parse(event.data);
        locationsArray.forEach((location: any) => {
          // Add each device ID to the active set
          activeDevices.add(location.device_id);
          updateMarker(location);
        });

        // Remove markers for devices not in the current update
        removeStaleMarkers();
      }, 100);
    };
  }

  // New function to remove stale markers
  function removeStaleMarkers() {
    markers.update((markersMap) => {
      for (const [deviceId, marker] of markersMap.entries()) {
        if (!activeDevices.has(deviceId)) {
          // Remove the marker from the map
          marker.map = null;
          // Delete the marker from our collection
          markersMap.delete(deviceId);
        }
      }
      return markersMap;
    });
  }

  async function updateMarker(data: any) {
    if (!map) return;

    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker",
    )) as google.maps.MarkerLibrary;

    markers.update((markersMap) => {
      const position = { lat: data.latitude, lng: data.longitude };
      let marker = markersMap.get(data.device_id);

      if (marker) {
        marker.position = position;
        (marker as any).myData = data;
      } else {
        // Create an img element for the custom marker
        const markerImg = document.createElement("img");
        markerImg.src = mapMarker;
        markerImg.style.width = "30px"; // Adjust the size as needed
        markerImg.style.height = "40px";

        // Create the AdvancedMarkerElement with the custom image as content
        marker = new AdvancedMarkerElement({
          position,
          map,
          title: `Device ${data.device_id}`,
          content: markerImg, // Set the custom image as the content
        });

        (marker as any).myData = data;

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

  onDestroy(() => {
    if (eventSource) {
      eventSource.close();
    }
  });

  onMount(() => {
    initializeMap();
  });
</script>

<div class="container">
  <div id="map"></div>
</div>

<style>
  .container {
    width: 100vw;
  }
  /* Fullscreen map container */
  #map {
    height: 100vh;
    width: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
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
