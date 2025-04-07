<script lang="ts">
  import maplibregl from "maplibre-gl";
  import { MapLibre, Marker, Popup } from "svelte-maplibre-gl";

  let lnglat = $state({ lng: 121.1441, lat: 14.7289 });
  let lngLatText = $derived(
    `(${lnglat.lat.toFixed(3)}, ${lnglat.lng.toFixed(3)})`,
  );
  let popupOpen = $state(true);
  let offset = $state(24);

  let offsets: maplibregl.Offset = $derived({
    top: [0, offset],
    bottom: [0, -offset],
    left: [offset + 12, 0],
    right: [-offset - 12, 0],
    center: [0, 0],
    "top-left": [offset, offset],
    "top-right": [-offset, offset],
    "bottom-left": [offset, -offset],
    "bottom-right": [-offset, -offset],
  });
</script>

<div class="flex items-center gap-x-4 text-sm">
  <label><input type="checkbox" bind:checked={popupOpen} /> Popup Open</label>
  <label
    >Offset ({offset}):
    <input type="range" min="0" max="30" bind:value={offset} /></label
  >
  <pre class="my-1 grow">marker: {lngLatText}</pre>
</div>

<MapLibre
  class="map-container"
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  center={[121.1441, 14.7289]}
  zoom={16}
  attributionControl={false}
>
  <Marker bind:lnglat draggable>
    {#snippet content()}
      <div class="text-center leading-none">
        <div class="text-3xl">🐶</div>
        <div class="font-bold text-white drop-shadow-xs">{lngLatText}</div>
      </div>
    {/snippet}
    <Popup class="text-black" bind:open={popupOpen} offset={offsets}>
      <span class="text-lg">{lngLatText}</span>
    </Popup>
  </Marker>
</MapLibre>
