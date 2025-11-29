<template>
  <div
      ref="mapRef"
      style="width: 100%; height: 300px; border-radius: 8px;"
  ></div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";



const props = defineProps({
  locations: Array
});

const emit = defineEmits(["marker-click"]);

const mapRef = ref(null);
let map = null;
let markers = [];

// Configurar tu API KEY
setOptions({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  version: "weekly"
});

onMounted(async () => {
  // Cargar librerías necesarias
  const { Map } = await importLibrary("maps");
  const { Marker } = await importLibrary("marker");

  map = new Map(mapRef.value, {
    center: { lat: -12.046374, lng: -77.042793 }, // Lima
    zoom: 13,
  });

  renderMarkers(Marker);
});

watch(() => props.locations, async () => {
  const { Marker } = await importLibrary("marker");
  renderMarkers(Marker);
}, { deep: true });

function renderMarkers(Marker) {
  // limpiar los marcadores anteriores
  markers.forEach(m => m.setMap(null));
  markers = [];

  props.locations.forEach(loc => {
    const marker = new Marker({
      position: { lat: Number(loc.latitude), lng: Number(loc.longitude) },
      map,
      title: loc.address,
    });

    marker.addListener("click", () => emit("marker-click", loc));

    markers.push(marker);
  });
}
</script>