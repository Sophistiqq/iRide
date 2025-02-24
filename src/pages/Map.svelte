<script lang="ts">
  import { Loader } from "@googlemaps/js-api-loader";
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";
  import mapMarker from "../assets/icon.png";
  //import { mapStyle } from "../components/mapStyles";
  let map: google.maps.Map;
  let eventSource: EventSource | null = null;
  let markerInfoWindow: google.maps.InfoWindow;
  const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;
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

    // Initialize map
    map = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 14.7289, lng: 121.1441 },
      zoom: 16,
      zoomControl: false,
      //styles: mapStyle,
      streetViewControl: true,
      rotateControl: true,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: ["roadmap", "satellite", "terrain", "hybrid"],
      },
      mapId: "f1b7b3e3b1b3b7f",
    });
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    // Initialize InfoWindow after map is created
    markerInfoWindow = new InfoWindow();

    // Only start SSE after map is fully initialized
    listenFromSSE();
  }

  function listenFromSSE() {
    if (eventSource) {
      eventSource.close();
    }

    eventSource = new EventSource(`${SERVER_URL}/events`);

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

      // Function to generate the InfoWindow content
      const getContentString = (data: any) => {
        return (
          `<div style="font-family: Arial, sans-serif; font-size: 14px;" id="content">` +
          `<h2 style="margin: 0; padding: 0;">${data.device_id}</h2>` +
          `<div style="margin-top: 5px;">` +
          `<b>Latitude:</b> ${data.latitude}<br>` +
          `<b>Longitude:</b> ${data.longitude}<br>` +
          `<b>Timestamp:</b> ${new Date(data.timestamp).toLocaleString()}<br>` +
          `</div>` +
          `</div>`
        );
      };

      if (marker) {
        // Update the marker's position
        marker.position = position;
        (marker as any).myData = data;

        // Update the InfoWindow content if it's currently open for this marker
        if (
          markerInfoWindow.get("map") &&
          markerInfoWindow.get("anchor") === marker
        ) {
          markerInfoWindow.setContent(getContentString(data));
        }
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

        // Add a click listener to open the InfoWindow
        marker.addListener("click", () => {
          markerInfoWindow.setContent(getContentString(data));
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
      height: 92.5svh;
      margin-bottom: 7.5vh;
    }
    #map {
      height: 100%;
    }
  }
</style>
