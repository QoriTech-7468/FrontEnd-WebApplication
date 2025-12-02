<template>
  <div class="locations-map-view">
    <div ref="mapRef" class="map-container"></div>
    
    <div v-if="loading" class="map-loading-overlay">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
      <p>Cargando mapa...</p>
    </div>
    
    <div v-if="error" class="map-error-overlay">
      <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #ef4444;"></i>
      <p>{{ error }}</p>
    </div>

    <div v-if="!loading && !error && validLocations.length === 0" class="map-empty-state">
      <div class="text-center text-600">
        <i class="pi pi-map-marker text-4xl mb-3" />
        <p>No locations with coordinates available</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { loadGoogleMaps, loadMarkerLibrary } from "../../../shared/infrastructure/useGoogleMapsLoader.js";

const props = defineProps({
  locations: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["marker-click"]);

const mapRef = ref(null);
const loading = ref(true);
const error = ref(null);

let map = null;
let markers = [];

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || null;

/**
 * Filter locations to only include those with valid coordinates
 */
const validLocations = computed(() => {
  if (!Array.isArray(props.locations)) {
    return [];
  }
  
  return props.locations.filter(loc => {
    const lat = loc.latitude;
    const lng = loc.longitude;
    
    // Check if both latitude and longitude exist and are valid numbers
    if (lat === null || lat === undefined || lat === "" || isNaN(Number(lat))) {
      return false;
    }
    if (lng === null || lng === undefined || lng === "" || isNaN(Number(lng))) {
      return false;
    }
    
    // Convert to numbers and validate ranges
    const latNum = Number(lat);
    const lngNum = Number(lng);
    
    return latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180;
  });
});

/**
 * Calculate bounds from all valid locations
 */
function calculateBounds(google, locations) {
  if (locations.length === 0) {
    return null;
  }
  
  const bounds = new google.maps.LatLngBounds();
  
  locations.forEach(loc => {
    const lat = Number(loc.latitude);
    const lng = Number(loc.longitude);
    bounds.extend(new google.maps.LatLng(lat, lng));
  });
  
  return bounds;
}

/**
 * Clear all markers from the map
 */
function clearMarkers() {
  markers.forEach(marker => {
    if (marker.setMap) {
      marker.setMap(null);
    } else if (marker.map) {
      marker.map = null;
    }
  });
  markers = [];
}

/**
 * Create markers for all valid locations
 */
async function createMarkers(google, locations) {
  if (!map || locations.length === 0) {
    return;
  }
  
  // Clear existing markers
  clearMarkers();
  
  // Try to use AdvancedMarkerElement only if we have a valid mapId
  let AdvancedMarkerElement = null;
  if (mapId) {
    try {
      const markerLib = await loadMarkerLibrary(apiKey);
      AdvancedMarkerElement = markerLib.AdvancedMarkerElement;
    } catch (err) {
      console.warn("No se pudo cargar AdvancedMarkerElement, usando Marker legacy:", err);
      AdvancedMarkerElement = null;
    }
  }
  
  // Create a marker for each location
  locations.forEach(loc => {
    const lat = Number(loc.latitude);
    const lng = Number(loc.longitude);
    
    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.warn(`Invalid coordinates for location ${loc.id}: lat=${lat}, lng=${lng}`);
      return;
    }
    
    const position = { lat, lng };
    
    let marker = null;
    
    // Only use AdvancedMarkerElement if we have both a valid mapId and the library loaded
    if (AdvancedMarkerElement && mapId) {
      try {
        marker = new AdvancedMarkerElement({
          map,
          position,
          title: loc.address || `Location ${loc.id}`
        });
      } catch (err) {
        console.warn("Error creating AdvancedMarkerElement, falling back to legacy Marker:", err);
        marker = null;
      }
    }
    
    // Fallback to legacy Marker if AdvancedMarkerElement failed or is not available
    if (!marker) {
      marker = new google.maps.Marker({
        position,
        map,
        title: loc.address || `Location ${loc.id}`,
        draggable: false
      });
    }
    
    // Add click listener to emit marker-click event
    if (marker && marker.addListener) {
      marker.addListener("click", () => {
        emit("marker-click", loc);
      });
    } else if (marker && google.maps.event && google.maps.event.addListener) {
      google.maps.event.addListener(marker, "click", () => {
        emit("marker-click", loc);
      });
    }
    
    if (marker) {
      markers.push(marker);
    }
  });
}

/**
 * Initialize the map
 */
async function initializeMap() {
  // Verify API key is available
  if (!apiKey) {
    error.value = "Google Maps API key no configurada. Por favor, configura VITE_GOOGLE_MAPS_API_KEY en tu archivo .env.development";
    loading.value = false;
    return;
  }

  if (!mapRef.value) {
    error.value = "Elemento del mapa no encontrado";
    loading.value = false;
    return;
  }

  try {
    // Load Google Maps
    const google = await loadGoogleMaps(apiKey);

    // Default center (Lima)
    const defaultCenter = { lat: -12.046374, lng: -77.042793 };
    const defaultZoom = 14;

    // Initialize map - only use mapId if it's a valid Map ID from env
    // If no valid mapId, we'll use legacy Marker instead of AdvancedMarkerElement
    const mapOptions = {
      center: defaultCenter,
      zoom: defaultZoom,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    };
    
    // Only add mapId if we have a valid one (from env, not generated)
    if (mapId) {
      mapOptions.mapId = mapId;
    }
    
    map = new google.maps.Map(mapRef.value, mapOptions);

    // Wait for map to be ready
    await new Promise((resolve) => {
      if (map) {
        google.maps.event.addListenerOnce(map, 'idle', resolve);
      } else {
        resolve();
      }
    });

    // Get valid locations
    const locations = validLocations.value;

    if (locations.length > 0) {
      // Create markers
      await createMarkers(google, locations);

      // Calculate bounds and fit map to show all markers
      const bounds = calculateBounds(google, locations);
      if (bounds) {
        if (locations.length === 1) {
          // If only one location, center on it with a reasonable zoom
          const loc = locations[0];
          map.setCenter({
            lat: Number(loc.latitude),
            lng: Number(loc.longitude)
          });
          map.setZoom(15);
        } else {
          // Fit bounds to show all markers
          map.fitBounds(bounds);
          // Add some padding to prevent markers from being at the edge
          const padding = 50;
          map.fitBounds(bounds, padding);
        }
      }
    }

    loading.value = false;
  } catch (err) {
    console.error("Error initializing map:", err);
    error.value = err.message || "Error al cargar el mapa";
    loading.value = false;
  }
}

/**
 * Update markers when locations change
 */
async function updateMarkers() {
  if (!map || !window.google) {
    return;
  }

  const locations = validLocations.value;
  
  if (locations.length === 0) {
    clearMarkers();
    // Reset to default center
    map.setCenter({ lat: -12.046374, lng: -77.042793 });
    map.setZoom(14);
    return;
  }

  // Create new markers
  await createMarkers(window.google, locations);

  // Update bounds
  const bounds = calculateBounds(window.google, locations);
  if (bounds) {
    if (locations.length === 1) {
      const loc = locations[0];
      map.setCenter({
        lat: Number(loc.latitude),
        lng: Number(loc.longitude)
      });
      map.setZoom(15);
    } else {
      map.fitBounds(bounds, 50);
    }
  }
}

onMounted(() => {
  initializeMap();
});

onBeforeUnmount(() => {
  // Cleanup
  clearMarkers();
  if (map) {
    if (window.google && window.google.maps && window.google.maps.event) {
      window.google.maps.event.clearInstanceListeners(map);
    }
    map = null;
  }
});

// Watch for changes in locations
watch(
  () => props.locations,
  (newLocations) => {
    console.log('Locations changed in LocationsMap:', {
      count: newLocations?.length || 0,
      locations: newLocations,
      validLocations: validLocations.value.length
    });
    if (map && !loading.value && !error.value) {
      updateMarkers();
    }
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
.locations-map-view {
  position: relative;
  width: 100%;
  min-height: 400px;
  height: 500px;
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.map-loading-overlay,
.map-error-overlay,
.map-empty-state {
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

.map-empty-state {
  padding: 2rem;
}
</style>