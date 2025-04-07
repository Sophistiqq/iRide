<script lang="ts">
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { onMount, onDestroy } from "svelte";
  import { ServerDataListener } from "../lib/ServerDataListener";
  import mapMarker from "../assets/marker.png";
  // Map and marker references
  let map: any;
  let markers: any = new Map();

  // Server data listener
  let dataListener: ServerDataListener;

  // Custom marker icon
  let deviceIcon: any;

  onMount(() => {
    // Initialize map
    map = L.map("map", {
      center: [14.735802391023922, 121.15087217180371],
      zoom: 13,
      zoomControl: false,
    });

    // onclick event
    map.on("click", handleMapClick);

    // Add tile layer
    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.{ext}",
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: "png",
      },
    ).addTo(map);

    // Initialize custom icon (optional)
    deviceIcon = L.icon({
      iconUrl: mapMarker, // Replace with your icon path or use default
      iconSize: [50, 50],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    // Add zoom control in a custom position if needed
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Initialize the data listener
    dataListener = new ServerDataListener();

    // Subscribe to device data updates
    const unsubscribe = dataListener.deviceData.subscribe((deviceMap) => {
      updateMarkers(deviceMap);
    });

    // Start listening for data
    dataListener.start();

    return () => {
      unsubscribe();
    };
  });

  onDestroy(() => {
    if (dataListener) {
      dataListener.stop();
    }

    // Clean up map if needed
    if (map) {
      map.remove();
    }
  });

  // Function to update markers based on device data
  function updateMarkers(deviceMap: Map<string, any>): void {
    // Track current device IDs to remove stale markers
    const currentDeviceIds = new Set(deviceMap.keys());

    // Add/update markers for each device
    deviceMap.forEach((device, deviceId) => {
      const position = L.latLng(device.latitude, device.longitude);

      // Create popup content
      const popupContent = `
        <div class="popup-content">
          <h3>${deviceId}</h3>
          <p><b>Latitude:</b> ${device.latitude}</p>
          <p><b>Longitude:</b> ${device.longitude}</p>
          <p><b>Timestamp:</b> ${new Date(device.timestamp).toLocaleString()}</p>
        </div>
      `;

      if (markers.has(deviceId)) {
        // Update existing marker
        const marker = markers.get(deviceId)!;
        marker.setLatLng(position);

        // Update popup content if it exists
        const popup = marker.getPopup();
        if (popup) {
          popup.setContent(popupContent);
        }
      } else {
        // Create new marker
        const markerOptions = deviceIcon ? { icon: deviceIcon } : {};
        const marker = L.marker(position, markerOptions)
          .bindPopup(popupContent)
          .bindTooltip(deviceId)
          .addTo(map);

        markers.set(deviceId, marker);
      }
    });

    // Remove stale markers
    markers.forEach((marker: any, deviceId: string) => {
      if (!currentDeviceIds.has(deviceId)) {
        map.removeLayer(marker);
        markers.delete(deviceId);
      }
    });

    // Auto-fit bounds if we have markers and this is the first update
    if (markers.size > 0 && currentDeviceIds.size !== markers.size) {
      const bounds = L.latLngBounds(
        Array.from(markers.values()).map((marker) => marker.getLatLng()),
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  // Handle map click event (from your original code)
  function handleMapClick(event: any) {
    const { lat, lng } = event.latlng;
    alert(`Clicked at: ${lat}, ${lng}`);
    // Add any additional click handling logic here
  }
</script>

<div class="container">
  <div id="map"></div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100svh;
    width: 100%;
    gap: 2rem;
  }
  #map {
    width: 100%;
    height: 100%;
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

  /* Additional styles for popups - these will be applied globally */
  :global(.popup-content) {
    font-family: Arial, sans-serif;
    font-size: 14px;
  }

  :global(.popup-content h3) {
    margin: 0 0 8px 0;
    font-size: 16px;
  }

  :global(.popup-content p) {
    margin: 4px 0;
  }
</style>
