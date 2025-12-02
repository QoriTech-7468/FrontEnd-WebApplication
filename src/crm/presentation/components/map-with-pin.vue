<template>
  <div class="map-page">
    <div ref="mapRef" class="map"></div>
    
    <div v-if="loading" class="map-loading-overlay">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
      <p>Cargando mapa...</p>
    </div>
    
    <div v-if="error" class="map-error-overlay">
      <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #ef4444;"></i>
      <p>{{ error }}</p>
    </div>
    
    <div class="info-panel">
      <p><strong>Lat:</strong> {{ lat || 'N/A' }}</p>
      <p><strong>Lng:</strong> {{ lng || 'N/A' }}</p>
      <p><strong>Dirección:</strong> Haz click en el mapa para seleccionar ubicación</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { loadGoogleMaps, loadMarkerLibrary } from "../../../shared/infrastructure/useGoogleMapsLoader.js";

const props = defineProps({
  latitude: {
    type: [Number, String],
    default: null
  },
  longitude: {
    type: [Number, String],
    default: null
  },
});

const emit = defineEmits(["update:latitude", "update:longitude"]);

const mapRef = ref(null);
const lat = ref(props.latitude);
const lng = ref(props.longitude);
const loading = ref(true);
const error = ref(null);

let map = null;
let marker = null;

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Sync props with local refs
if (props.latitude !== null && props.latitude !== undefined) {
  lat.value = typeof props.latitude === 'string' ? parseFloat(props.latitude) : props.latitude;
}
if (props.longitude !== null && props.longitude !== undefined) {
  lng.value = typeof props.longitude === 'string' ? parseFloat(props.longitude) : props.longitude;
}

onMounted(async () => {
  // Verify API key is available
  if (!apiKey) {
    error.value = "Google Maps API key no configurada. Por favor, configura VITE_GOOGLE_MAPS_API_KEY en tu archivo .env.development";
    loading.value = false;
    console.error("VITE_GOOGLE_MAPS_API_KEY no encontrada. Variables disponibles:", 
      Object.keys(import.meta.env).filter(k => k.includes("GOOGLE") || k.includes("MAPS")));
    return;
  }

  // Log API key status (first 10 chars only for security)
  console.log("Google Maps API Key encontrada:", apiKey.substring(0, 10) + "...");

  try {
    // Ask user if they want to use current location
    const useCurrentLocation = window.confirm("¿Deseas usar tu ubicación actual?");
    
    let initialCenter = { lat: -12.046374, lng: -77.042793 }; // Lima default
    let shouldPlaceMarker = false;

    if (useCurrentLocation) {
      try {
        const position = await getCurrentPosition();
        initialCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        shouldPlaceMarker = true;
      } catch (err) {
        console.warn("No se pudo obtener la ubicación actual:", err);
        // Continue with default center
      }
    }

    // Load Google Maps
    // Note: You may see ERR_BLOCKED_BY_CLIENT errors for gen_204 endpoint
    // This is usually caused by ad blockers and doesn't affect map functionality
    const google = await loadGoogleMaps(apiKey);

    // mapRef.value should always exist now since the div is always rendered
    if (!mapRef.value) {
      error.value = "Elemento del mapa no encontrado";
      loading.value = false;
      return;
    }

    // Initialize map with mapId (required for AdvancedMarkerElement)
    // Generate a unique mapId or use a default one
    const mapId = `map-${Date.now()}`;
    map = new google.maps.Map(mapRef.value, {
      center: initialCenter,
      zoom: shouldPlaceMarker ? 15 : 14,
      mapId: mapId, // Required for AdvancedMarkerElement
    });

    // Load marker library for AdvancedMarkerElement
    let AdvancedMarkerElement = null;
    try {
      const markerLib = await loadMarkerLibrary(apiKey);
      AdvancedMarkerElement = markerLib.AdvancedMarkerElement;
    } catch (err) {
      console.warn("No se pudo cargar AdvancedMarkerElement, usando Marker legacy:", err);
      // Fallback to legacy Marker if AdvancedMarkerElement is not available
      AdvancedMarkerElement = null;
    }

    // Place marker if using current location
    if (shouldPlaceMarker) {
      if (AdvancedMarkerElement) {
        marker = new AdvancedMarkerElement({
          map,
          position: initialCenter,
        });
      } else {
        // Fallback to legacy Marker
        marker = new google.maps.Marker({
          position: initialCenter,
          map,
          draggable: false,
        });
      }

      lat.value = initialCenter.lat;
      lng.value = initialCenter.lng;
      emit("update:latitude", initialCenter.lat);
      emit("update:longitude", initialCenter.lng);
    }

    // Click listener for map
    map.addListener("click", (e) => {
      const position = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      // Update or create marker
      if (marker) {
        if (AdvancedMarkerElement && marker instanceof AdvancedMarkerElement) {
          marker.position = position;
        } else {
          // Legacy Marker
          marker.setPosition(position);
        }
      } else {
        if (AdvancedMarkerElement) {
          marker = new AdvancedMarkerElement({
            map,
            position,
          });
        } else {
          // Fallback to legacy Marker
          marker = new google.maps.Marker({
            position,
            map,
            draggable: false,
          });
        }
      }

      lat.value = position.lat;
      lng.value = position.lng;
      emit("update:latitude", position.lat);
      emit("update:longitude", position.lng);
    });

    loading.value = false;
  } catch (err) {
    console.error("Error initializing map:", err);
    error.value = err.message || "Error al cargar el mapa";
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  // Cleanup
  if (marker) {
    marker.setMap(null);
    marker = null;
  }
  if (map) {
    // Clear all listeners
    if (window.google && window.google.maps && window.google.maps.event) {
      window.google.maps.event.clearInstanceListeners(map);
    }
    map = null;
  }
});

/**
 * Get current position using Geolocation API
 */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation no está soportado por este navegador"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (err) => {
        reject(new Error("No se pudo obtener la ubicación: " + err.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}
</script>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
}

.map {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  position: relative;
}

.map-loading-overlay,
.map-error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  z-index: 10;
  border-radius: 8px;
  pointer-events: none;
}

.map-loading-overlay {
  color: #6b7280;
}

.map-loading-overlay p {
  margin-top: 1rem;
}

.map-error-overlay {
  color: #ef4444;
  text-align: center;
  padding: 1rem;
}

.map-error-overlay p {
  margin-top: 1rem;
}

.info-panel {
  font-size: 0.9rem;
  background: #f5f5f5;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.info-panel p {
  margin: 0.25rem 0;
  color: #374151;
}

.info-panel strong {
  color: #111827;
}
</style>

