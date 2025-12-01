<template>
  <div class="map-picker">
    <div class="field mb-2">
      <label class="block text-700 mb-1">Search Address</label>
      <input
          :id="autocompleteId"
          v-model="localAddress"
          type="text"
          placeholder="Type address..."
          class="p-inputtext p-component w-full"
      />
    </div>

    <div :id="mapId" style="height: 250px; border-radius: 10px;"></div>
    
    <div v-if="error" class="text-red-500 text-sm mt-2">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick, watch } from "vue";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

const props = defineProps({
  address: String,
  latitude: Number,
  longitude: Number,
});

const emit = defineEmits(["update:address", "update:latitude", "update:longitude"]);

const localAddress = ref(props.address || "");
const error = ref(null);
const loading = ref(true);

// Sincronizar localAddress con props.address cuando cambie desde el padre
watch(() => props.address, (newAddress) => {
  if (newAddress !== undefined && newAddress !== null && newAddress !== localAddress.value) {
    localAddress.value = newAddress;
  }
});

// Emitir cambios cuando el usuario escribe en el input (no solo cuando selecciona del autocomplete)
watch(localAddress, (newValue) => {
  emit("update:address", newValue);
});

// IDs únicos para evitar conflictos cuando hay múltiples instancias
const componentId = `map-picker-${Math.random().toString(36).substr(2, 9)}`;
const mapId = `${componentId}-map`;
const autocompleteId = `${componentId}-autocomplete`;

let map = null;
let marker = null;
let geocoder = null;
let autocomplete = null;

// Configurar Google Maps API
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_KEY;
if (apiKey) {
  setOptions({
    apiKey: apiKey,
    version: "weekly",
  });
}

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!apiKey) {
      throw new Error("Google Maps API key is not configured. Please set VITE_GOOGLE_MAPS_API_KEY or VITE_GOOGLE_MAPS_KEY");
    }

    // Esperar a que el DOM esté completamente renderizado
    await nextTick();

    // Cargar librerías necesarias
    const { Map } = await importLibrary("maps");
    const { Marker } = await importLibrary("marker");
    const { Geocoder } = await importLibrary("geocoding");
    const { Autocomplete } = await importLibrary("places");

    // Verificar que los elementos DOM existan
    const mapElement = document.getElementById(mapId);
    const inputElement = document.getElementById(autocompleteId);

    if (!mapElement || !inputElement) {
      throw new Error("Required DOM elements not found");
    }

    const center = {
      lat: props.latitude ?? -12.0464,
      lng: props.longitude ?? -77.0428,
    };

    // Inicializar mapa
    map = new Map(mapElement, {
      center,
      zoom: props.latitude && props.longitude ? 15 : 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    // Inicializar marcador
    marker = new Marker({
      map,
      position: center,
      draggable: true,
    });

    // Inicializar geocoder
    geocoder = new Geocoder();

    // Inicializar autocomplete
    autocomplete = new Autocomplete(inputElement, {
      fields: ["formatted_address", "geometry"],
    });

    // Listener para cuando se selecciona un lugar del autocomplete
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.warn("No geometry found for selected place");
        return;
      }
      const loc = place.geometry.location;
      map.setCenter(loc);
      map.setZoom(15);
      marker.setPosition(loc);
      updateValues(place.formatted_address || "", loc.lat(), loc.lng());
    });

    // Listener para cuando se hace click en el mapa
    map.addListener("click", async (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      marker.setPosition(event.latLng);

      try {
        const results = await geocoder.geocode({ location: { lat, lng } });
        const formatted = results.results[0]?.formatted_address || "";
        updateValues(formatted, lat, lng);
      } catch (err) {
        console.error("Geocoding error:", err);
        // Aún actualizar las coordenadas aunque falle el geocoding
        updateValues("", lat, lng);
      }
    });

    // Listener para cuando se arrastra el marcador
    marker.addListener("dragend", async (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      try {
        const results = await geocoder.geocode({ location: { lat, lng } });
        const formatted = results.results[0]?.formatted_address || "";
        updateValues(formatted, lat, lng);
      } catch (err) {
        console.error("Geocoding error:", err);
        updateValues("", lat, lng);
      }
    });

    loading.value = false;
  } catch (err) {
    console.error("Error initializing Google Maps:", err);
    error.value = err.message || "Failed to load Google Maps. Please check your API key configuration.";
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  // Limpiar listeners y referencias
  if (autocomplete) {
    window.google?.maps?.event?.clearInstanceListeners?.(autocomplete);
  }
  if (marker) {
    window.google?.maps?.event?.clearInstanceListeners?.(marker);
  }
  if (map) {
    window.google?.maps?.event?.clearInstanceListeners?.(map);
  }
  map = null;
  marker = null;
  geocoder = null;
  autocomplete = null;
});

function updateValues(address, lat, lng) {
  localAddress.value = address;
  emit("update:address", address);
  emit("update:latitude", lat);
  emit("update:longitude", lng);
}
</script>

<style scoped>
.map-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
