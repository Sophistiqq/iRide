<script lang="ts">
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import { onMount, onDestroy } from "svelte";
  import { ServerDataListener } from "../lib/ServerDataListener";
  import { baseLayers } from "../lib/MapStyles";
  import { RotateCcw, Settings } from "lucide-svelte";

  // Map and marker references
  let map: any;
  let markers: any = new Map();
  let initialView = { center: [14.5995, 120.9842], zoom: 13 };

  // Server data listener
  let dataListener: ServerDataListener;

  // UI state
  let showControls = false;

  onMount(() => {
    // Initialize map
    map = L.map("map", {
      center: initialView.center,
      zoom: initialView.zoom,
      zoomControl: false,
    });

    // Add default tile layer to map
    baseLayers["OpenStreetMap"].addTo(map);

    // Add custom controls
    addMapControls();

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

    if (map) {
      map.remove();
    }
  });

  // Add custom map controls
  function addMapControls() {
    // Add zoom control
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add scale control
    L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);
  }

  // Reset map view
  function resetMapView() {
    map.setView(initialView.center, initialView.zoom);
  }

  // Toggle map controls panel
  function toggleControls() {
    showControls = !showControls;
  }

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
        <h3>${device.device_id}</h3>
        <h5>Device Name: ${device.device_name || "N/A"}</h5>
        <small>Body No.: ${device.body_number || "N/A"}</small>

        <div class="popup-section">
          <h4>Coordinates</h4>
          <div class="popup-grid">
            <div><b>Lat:</b> ${device.latitude.toFixed(6)}</div>
            <div><b>Lng:</b> ${device.longitude.toFixed(6)}</div>
          </div>
        </div>

        <div class="popup-section">
          <h4>Telemetry</h4>
          <div class="popup-grid">
            <div><b>Speed:</b> ${device.speed != null ? device.speed + " km/h" : "N/A"}</div>
            <div><b>Altitude:</b> ${device.altitude != null ? device.altitude + " m" : "N/A"}</div>
            <div><b>Course:</b> ${device.course != null ? device.course + "°" : "N/A"}</div>
            <div><b>HDOP:</b> ${device.hdop ?? "N/A"}</div>
          </div>
        </div>

        <div class="popup-section">
          <h4>Satellites</h4>
          <div class="popup-grid">
            <div><b>Count:</b> ${device.satellites ?? "N/A"}</div>
            <div><b>GPS Time:</b> ${device.gps_date ?? ""} ${device.gps_time ?? ""}</div>
          </div>
        </div>

        <div class="popup-section">
          <h4>Status</h4>
          <div class="popup-grid">
            <div><b>Last Update:</b></div>
            <div>${new Date(device.timestamp).toLocaleString()}</div>
          </div>
        </div>
      </div>
    `;

      if (markers.has(deviceId)) {
        // Update existing marker
        const marker = markers.get(deviceId)!;
        marker.setLatLng(position);

        // Update popup content if popup exists
        const popup = marker.getPopup();
        if (popup) {
          popup.setContent(popupContent);
        }
      } else {
        // Create new marker with pulse effect for newest devices
        const marker = L.marker(position, {
          title: deviceId,
        })
          .bindPopup(popupContent)
          .bindTooltip(deviceId)
          .addTo(map);

        // Add pulse animation to new markers
        addPulseEffect(marker);

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

    // Auto-fit bounds if we have markers and this is the first update or we have new devices
    if (markers.size > 0 && currentDeviceIds.size !== markers.size) {
      const bounds = L.latLngBounds(
        Array.from(markers.values()).map((marker: any) => marker.getLatLng()),
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  // Add pulse effect to new markers
  function addPulseEffect(marker: any) {
    const icon = marker.getElement();
    if (icon) {
      icon.classList.add("new-marker");
      // Remove animation after 3 seconds
      setTimeout(() => {
        icon.classList.remove("new-marker");
      }, 3000);
    }
  }

  // Find device by ID
  function findDevice(deviceId: unknown) {
    const marker = markers.get(deviceId);
    if (marker) {
      map.setView(marker.getLatLng(), 17);
      marker.openPopup();
    }
  }
</script>

<div class="map-container">
  <div id="map"></div>

  <!-- Fixed control buttons -->
  <div class="map-buttons">
    <button class="map-button" onclick={toggleControls} title="More Controls">
      <Settings />
    </button>
    <button class="map-button" onclick={resetMapView} title="Reset View">
      <RotateCcw />
    </button>
  </div>

  <!-- Map controls panel -->
  {#if showControls}
    <div class="controls-panel">
      <h3>Map Controls</h3>
      <div class="control-group">
        <h4>Map Style</h4>
        <div class="style-options">
          {#each Object.keys(baseLayers) as style}
            <button
              class="style-button"
              onclick={() => {
                Object.values(baseLayers).forEach((layer) =>
                  map.removeLayer(layer),
                );
                baseLayers[style].addTo(map);
              }}
            >
              {style}
            </button>
          {/each}
        </div>
      </div>

      <div class="control-group">
        <h4>Devices ({markers.size})</h4>
        <div class="device-list">
          {#if markers.size === 0}
            <p class="no-devices">No active devices</p>
          {:else}
            {#each Array.from(markers.keys()).slice(0, 5) as deviceId}
              <button
                class="device-button"
                onclick={() => findDevice(deviceId)}
              >
                {deviceId}
              </button>
            {/each}
            {#if markers.size > 5}
              <small>+ {markers.size - 5} more</small>
            {/if}
          {/if}
        </div>
      </div>

      <button class="close-button" onclick={toggleControls}>Close</button>
    </div>
  {/if}
</div>

<style>
  .map-container {
    position: relative;
    width: 100%;
    height: 100svh;
  }

  #map {
    width: 100%;
    height: 100%;
  }

  .map-buttons {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .map-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    transition: all 0.2s ease;
  }

  .map-button:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }

  .controls-panel {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 250px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    padding: 15px;
    z-index: 1000;
    max-height: calc(100% - 40px);
    overflow-y: auto;
  }

  .controls-panel h3 {
    margin: 0 0 15px 0;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
    font-size: 16px;
  }

  .control-group {
    margin-bottom: 20px;
  }

  .control-group h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #666;
  }

  .style-options {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .style-button {
    padding: 5px 10px;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .style-button:hover {
    background: #e0e0e0;
  }

  .device-list {
    max-height: 150px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .device-button {
    text-align: left;
    padding: 6px 10px;
    background: #f7f7f7;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .device-button:hover {
    background: #e9f4ff;
    border-color: #b0d2ff;
  }

  .no-devices {
    color: #999;
    font-size: 12px;
    font-style: italic;
    margin: 5px 0;
  }

  .close-button {
    width: 100%;
    padding: 8px;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }

  .close-button:hover {
    background: #e0e0e0;
  }

  /* Additional styles for responsive design */
  @media (max-width: 768px) {
    .map-container {
      height: 92.5svh;
      margin-bottom: 7.5vh;
    }

    .controls-panel {
      width: 200px;
    }
  }

  /* Animation for new markers */
  :global(.new-marker) {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      filter: drop-shadow(0 0 0 rgba(74, 144, 226, 0.8));
      transform: scale(1);
    }
    50% {
      filter: drop-shadow(0 0 10px rgba(74, 144, 226, 0.5));
      transform: scale(1.2);
    }
    100% {
      filter: drop-shadow(0 0 0 rgba(74, 144, 226, 0.8));
      transform: scale(1);
    }
  }

  /* Pop-up styling */
  :global(.popup-content) {
    font-family: sans-serif;
    font-size: 0.85rem;
    line-height: 1.4;

    h3 {
      font-size: 1.1rem;
      margin: 0 0 2px;
    }

    small {
      display: block;
      margin-bottom: 8px;
      color: #666;
    }
  }

  :global(.popup-section) {
    margin-bottom: 10px;

    h4 {
      margin: 4px 0;
      font-size: 0.9rem;
      color: #333;
      border-bottom: 1px solid #ddd;
    }

    :global(.popup-grid) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 8px;

      div {
        white-space: nowrap;
      }
    }
  }
</style>
