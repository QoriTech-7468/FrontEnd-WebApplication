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
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
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
const lat = ref(null);
const lng = ref(null);
const loading = ref(true);
const error = ref(null);

let map = null;
let marker = null;
let AdvancedMarkerElement = null;

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Check if coordinates are valid
 */
function isValidCoordinate(value) {
  if (value === null || value === undefined || value === "") return false;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && isFinite(num);
}

/**
 * Parse coordinate value
 */
function parseCoordinate(value) {
  if (!isValidCoordinate(value)) return null;
  return typeof value === 'string' ? parseFloat(value) : value;
}

// Initialize coordinates from props
const initialLat = parseCoordinate(props.latitude);
const initialLng = parseCoordinate(props.longitude);

if (initialLat !== null && initialLng !== null) {
  lat.value = initialLat;
  lng.value = initialLng;
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
    // Determine initial center: use props coordinates if available, otherwise default to Lima
    let initialCenter = { lat: -12.046374, lng: -77.042793 }; // Lima default
    let initialZoom = 14;
    let hasInitialCoordinates = false;

    if (initialLat !== null && initialLng !== null) {
      initialCenter = { lat: initialLat, lng: initialLng };
      initialZoom = 15; // Zoom closer if we have initial coordinates
      hasInitialCoordinates = true;
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
      zoom: initialZoom,
      mapId: mapId, // Required for AdvancedMarkerElement
    });

    // Wait for map to be ready
    await new Promise((resolve) => {
      google.maps.event.addListenerOnce(map, 'idle', resolve);
    });

    // Load marker library for AdvancedMarkerElement
    try {
      const markerLib = await loadMarkerLibrary(apiKey);
      AdvancedMarkerElement = markerLib.AdvancedMarkerElement;
    } catch (err) {
      console.warn("No se pudo cargar AdvancedMarkerElement, usando Marker legacy:", err);
      // Fallback to legacy Marker if AdvancedMarkerElement is not available
      AdvancedMarkerElement = null;
    }

    // Place marker if we have initial coordinates
    if (hasInitialCoordinates && initialCenter) {
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

// Watch for changes in props to update marker position
watch(
  () => [props.latitude, props.longitude],
  ([newLat, newLng]) => {
    if (!map) return;
    
    const parsedLat = parseCoordinate(newLat);
    const parsedLng = parseCoordinate(newLng);
    
    if (parsedLat !== null && parsedLng !== null) {
      const position = { lat: parsedLat, lng: parsedLng };
      
      // Update local refs
      lat.value = parsedLat;
      lng.value = parsedLng;
      
      // Update or create marker
      if (marker) {
        if (AdvancedMarkerElement && marker instanceof AdvancedMarkerElement) {
          marker.position = position;
        } else {
          marker.setPosition(position);
        }
      } else {
        // Create marker if it doesn't exist
        if (AdvancedMarkerElement) {
          marker = new AdvancedMarkerElement({
            map,
            position,
          });
        } else {
          marker = new google.maps.Marker({
            position,
            map,
            draggable: false,
          });
        }
      }
      
      // Center map on the new position
      map.setCenter(position);
      map.setZoom(15);
    }
  }
);

onBeforeUnmount(() => {
  // Cleanup
  if (marker) {
    if (marker.setMap) {
      marker.setMap(null);
    } else if (marker.map) {
      marker.map = null;
    }
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

