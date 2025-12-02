<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { importLibrary, setOptions } from '@googlemaps/js-api-loader'

const props = defineProps({
  deliveries: {
    type: Array,
    default: () => []
  },
  locations: {
    type: Array,
    default: () => []
  },
  currentRoute: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['delivery-click'])
const { t } = useI18n()

const mapRef = ref(null)
const loading = ref(true)
const error = ref(null)

let map = null
let markers = []
let polyline = null
let infoWindows = []

// Configurar Google Maps API
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_KEY;
if (apiKey) {
  setOptions({
    apiKey: apiKey,
    version: 'weekly'
  });
}

// Colores de pines según estado
const PIN_COLORS = {
  pending: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  in_progress: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  completed: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  rejected: 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png'
}

// Combinar deliveries con locations
const deliveryLocations = computed(() => {
  return props.deliveries
      .map(delivery => {
        const location = props.locations.find(loc => loc.id === delivery.locationId)
        return {
          ...delivery,
          location: location || null
        }
      })
      .filter(d => d.location && d.location.latitude && d.location.longitude)
})

onMounted(async () => {
  try {
    loading.value = true

    // Cargar librerías necesarias
    const { Map } = await importLibrary('maps')
    const { Marker } = await importLibrary('marker')

    // Centro por defecto: Lima, Perú
    map = new Map(mapRef.value, {
      center: { lat: -12.0464, lng: -77.0428 },
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    })

    loading.value = false
    await renderMarkersAndRoute(Marker)
  } catch (err) {
    console.error('Error loading Google Maps:', err)
    error.value = 'No se pudo cargar Google Maps. Revisa la API Key y la conexión.'
    loading.value = false
  }
})

watch(
    () => [props.deliveries, props.locations],
    async () => {
      if (map) {
        const { Marker } = await importLibrary('marker')
        await renderMarkersAndRoute(Marker)
      }
    },
    { deep: true }
)

async function renderMarkersAndRoute(Marker) {
  if (!map) return

  // Limpiar markers anteriores
  markers.forEach(m => m.setMap(null))
  markers = []

  // Cerrar todos los infoWindows
  infoWindows.forEach(iw => iw.close())
  infoWindows = []

  // Limpiar polyline anterior
  if (polyline) {
    polyline.setMap(null)
    polyline = null
  }

  if (deliveryLocations.value.length === 0) return

  const bounds = new google.maps.LatLngBounds()
  const routePath = []

  // Crear markers
  deliveryLocations.value.forEach((delivery, index) => {
    const loc = delivery.location
    const position = { lat: Number(loc.latitude), lng: Number(loc.longitude) }

    const marker = new Marker({
      position,
      map,
      title: loc.address,
      label: {
        text: String(index + 1),
        color: 'white',
        fontWeight: 'bold'
      },
      icon: {
        url: PIN_COLORS[delivery.state] || PIN_COLORS.pending,
        scaledSize: new google.maps.Size(40, 40)
      }
    })

    // Info window al hacer click
    const infoWindow = new google.maps.InfoWindow({
      content: createInfoWindowContent(delivery, loc, index + 1)
    })

    marker.addListener('click', () => {
      // Cerrar otros infoWindows
      infoWindows.forEach(iw => iw.close())

      infoWindow.open(map, marker)
      emit('delivery-click', delivery)
    })

    markers.push(marker)
    infoWindows.push(infoWindow)
    bounds.extend(position)
    routePath.push(position)
  })

  // Dibujar línea de ruta conectando las ubicaciones
  if (routePath.length > 1) {
    polyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: props.currentRoute?.color || '#FFC700',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map
    })
  }

  // Ajustar zoom para ver todos los markers
  if (deliveryLocations.value.length === 1) {
    map.setCenter(bounds.getCenter())
    map.setZoom(15)
  } else if (deliveryLocations.value.length > 1) {
    map.fitBounds(bounds)
  }
}

function createInfoWindowContent(delivery, location, number) {
  const statusColors = {
    pending: '#ef4444',
    in_progress: '#f59e0b',
    completed: '#10b981',
    rejected: '#6b7280'
  }

  const statusLabels = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completada',
    rejected: 'Rechazada'
  }

  const clientName = location.customerId
      ? `Cliente ${location.customerId}`
      : 'Cliente desconocido'

  return `
    <div style="padding: 0.75rem; min-width: 220px; font-family: system-ui;">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
        <div style="
          background: ${statusColors[delivery.state]};
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        ">${number}</div>
        <strong style="font-size: 1.05rem; color: #1a202c;">${clientName}</strong>
      </div>

      <div style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem;">
        <span style="font-size: 0.95rem;">📍</span>
        <p style="margin: 0; font-size: 0.9rem; color: #4b5563; line-height: 1.4;">
          ${location.address}
        </p>
      </div>

      <div style="
        margin-top: 0.75rem;
        padding: 0.4rem 0.85rem;
        background: ${statusColors[delivery.state]};
        color: white;
        border-radius: 16px;
        display: inline-block;
        font-size: 0.8rem;
        font-weight: 600;
      ">
        ${statusLabels[delivery.state]}
      </div>

      ${delivery.rejectionReason ? `
        <p style="margin: 0.75rem 0 0 0; font-size: 0.8rem; color: #6b7280; font-style: italic;">
          Razón: ${getRejectionReasonLabel(delivery.rejectionReason)}
        </p>
      ` : ''}

      ${delivery.rejectionNote ? `
        <p style="margin: 0.5rem 0 0 0; font-size: 0.75rem; color: #9ca3af;">
          "${delivery.rejectionNote}"
        </p>
      ` : ''}
    </div>
  `
}

function getRejectionReasonLabel(reason) {
  const labels = {
    absent_customer: 'Cliente ausente',
    wrong_address: 'Dirección incorrecta',
    customer_refused: 'Cliente rechazó la entrega',
    other: 'Otro'
  }
  return labels[reason] || reason
}
</script>

<template>
  <div class="map-container">
    <!-- Overlay de carga -->
    <div v-if="loading" class="overlay loading-overlay">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
      <span>Cargando Mapa...</span>
    </div>

    <!-- Overlay de error -->
    <div v-if="error" class="overlay error-overlay">
      <i class="pi pi-exclamation-triangle" style="font-size: 2rem;"></i>
      <span>{{ error }}</span>
    </div>

    <!-- Contenedor del mapa -->
    <div
        ref="mapRef"
        class="google-map"
    ></div>

    <!-- Leyenda de estados -->
    <div v-if="!loading && !error" class="map-legend">
      <div class="legend-title">Estados:</div>
      <div class="legend-item">
        <div class="legend-dot pending"></div>
        <span>Pendiente</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot in-progress"></div>
        <span>En progreso</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot completed"></div>
        <span>Completada</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot rejected"></div>
        <span>Rechazada</span>
      </div>
    </div>

    <!-- Contador de entregas -->
    <div v-if="!loading && !error && deliveryLocations.length > 0" class="delivery-counter">
      <i class="pi pi-map-marker"></i>
      <span>{{ deliveryLocations.length }} paradas</span>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
}

.google-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 12px;
  background: #f8fafc;
}

/* Overlays (igual que interactive-map.vue) */
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
  gap: 0.75rem;
}

.loading-overlay .pi {
  font-size: 2rem;
  color: #043873;
}

.error-overlay {
  background: rgba(240, 219, 219, 0.9);
  color: #721c24;
}

.error-overlay .pi {
  font-size: 2rem;
}

/* Leyenda */
.map-legend {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
}

.legend-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #2d3748;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.85rem;
  color: #4b5563;
}

.legend-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.legend-dot.pending {
  background: #ef4444;
}

.legend-dot.in-progress {
  background: #f59e0b;
}

.legend-dot.completed {
  background: #10b981;
}

.legend-dot.rejected {
  background: #6b7280;
}

/* Contador de entregas */
.delivery-counter {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: white;
  padding: 0.5rem 0.85rem;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a202c;
}

.delivery-counter .pi {
  color: #043873;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .map-legend {
    bottom: 0.75rem;
    left: 0.75rem;
    padding: 0.5rem 0.75rem;
    min-width: 130px;
  }

  .legend-title {
    font-size: 0.7rem;
  }

  .legend-item {
    font-size: 0.8rem;
    gap: 0.5rem;
  }

  .legend-dot {
    width: 12px;
    height: 12px;
  }

  .delivery-counter {
    top: 0.75rem;
    left: 0.75rem;
    font-size: 0.85rem;
    padding: 0.4rem 0.7rem;
  }
}
</style>