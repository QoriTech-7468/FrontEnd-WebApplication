<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  locations: Array,
  selectedLocation: Object
});
const emits = defineEmits(['select']);

const selectedClient = ref(null);
const clients = computed(() => {
  if (!props.locations) return [];
  const clientNames = props.locations.map(loc => loc.client?.name || loc.clientsId || `Client ${loc.customerId}` || 'Unknown');
  const uniqueClients = [...new Set(clientNames)];
  return uniqueClients.map(client => ({ label: client, value: client }));
});
const filteredLocations = computed(() => {
  if (!selectedClient.value) {
    return props.locations || [];
  }
  const clientKey = selectedClient.value.value;
  return props.locations.filter(loc => {
    const name = loc.client?.name || loc.clientsId || `Client ${loc.customerId}` || 'Unknown';
    return name === clientKey;
  });
});
const handleClientSelect = (event) => {
};

// --- Lógica de Google Maps ---
const mapContainer = ref(null);
const loading = ref(true);
const error = ref(null);

let map, geocoder;
let activeMarkers = [];

async function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      return resolve(window.google.maps);
    }
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      existingScript.addEventListener('error', reject);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Función principal para inicializar el mapa 
 */
async function initializeMap() {
  try {
    const googleMaps = await loadGoogleMaps();
    loading.value = false;
    
    const defaultCenter = { lat: -12.0464, lng: -77.0428 };

    map = new googleMaps.Map(mapContainer.value, {
      center: defaultCenter,
      zoom: 12, // Zoom para ver la ciudad
      mapTypeControl: false,
      streetViewControl: false,
    });

    geocoder = new googleMaps.Geocoder();
    
    drawMarkers(googleMaps, true);

  } catch (err) {
    console.error("Error cargando Google Maps en InteractiveMap:", err);
    error.value = "No se pudo cargar Google Maps. Revisa la API Key y la conexión.";
    loading.value = false;
  }
}

/**
 * Dibuja los pines en el mapa 
 */
function drawMarkers(googleMaps, isInitialLoad = false) { // 3. Nuevo parámetro
  if (!map) return;

  activeMarkers.forEach(marker => marker.setMap(null));
  activeMarkers = [];

  if (filteredLocations.value.length === 0) return;

  const bounds = new googleMaps.LatLngBounds();
  let hasValidPins = false; 

  filteredLocations.value.forEach(loc => {
    if (loc.latitude && loc.longitude) { // Solo si tiene coords
      hasValidPins = true;
      const latLng = { lat: loc.latitude, lng: loc.longitude };
      const isSelected = props.selectedLocation && props.selectedLocation.id === loc.id;

      const marker = new googleMaps.Marker({
        position: latLng,
        map: map,
        title: loc.address,
        icon: isSelected
            ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Pin azul
            : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'  // Pin rojo
      });

      marker.addListener('click', () => {
        emits('select', loc);
      });

      activeMarkers.push(marker);
      bounds.extend(latLng);
    }
  });
  
  if (hasValidPins && !isInitialLoad) {
    map.fitBounds(bounds);
    if (activeMarkers.length === 1) map.setZoom(15);
  }
}

watch([filteredLocations, () => props.selectedLocation], () => {
  if (window.google && window.google.maps) {
    // 5. Avisar que NO es la carga inicial
    drawMarkers(window.google.maps, false);
  }
});

// Ciclo de Vida (Sin cambios)
onMounted(() => {
  initializeMap();
});

onUnmounted(() => {
  if (window.google && window.google.maps) {
    activeMarkers.forEach(marker => window.google.maps.event.clearInstanceListeners(marker));
  }
});
</script>

<template>
  <div class="map-container">

    <div class="search-bar">
      <pv-auto-complete
          v-model="selectedClient"
          :suggestions="clients"
          placeholder="Search client"
          optionLabel="label"
          @complete="handleClientSelect"
          class="w-full"
      />
    </div>

    <div v-if="error" class="overlay error-overlay">
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>
    <div v-if="loading" class="overlay loading-overlay">
      <i class="pi pi-spin pi-spinner"></i>
      <span>Cargando Mapa...</span>
    </div>

    <div ref="mapContainer" class="map"></div>

  </div>
</template>

<style scoped>
.map-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative; /* Para los overlays */
}

.search-bar {
  margin-bottom: 1rem;
  z-index: 2; /* Por encima del mapa */
}

/* El contenedor del mapa real */
.map {
  flex: 1;
  background: #f8fafc;
  border-radius: 8px;
  min-height: 400px;
  width: 100%;
}

/* --- Superposiciones --- */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 1rem;
  text-align: center;
  border-radius: 12px;
}
.loading-overlay .pi {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.error-overlay {
  background: rgba(240, 219, 219, 0.9);
  color: #721c24;
}
.error-overlay .pi {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
</style>
