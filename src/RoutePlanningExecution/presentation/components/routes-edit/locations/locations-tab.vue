<script setup>
import { ref, onMounted, watch } from 'vue'
import SelectedLocationsList from './selected-locations-list.vue'
import LocationDetails from './location-details.vue'
import InteractiveMap from './interactive-map.vue'
import { useRoutePlanningStore } from '../../../../application/routeplanning.store.js'

const props = defineProps({
  route: { type: Object, required: false, default: null }
})

const store = useRoutePlanningStore()
const loading = ref(false)
const selectedLocation = ref(null)
const locations = ref([]) // locations asociadas a la ruta
const allLocations = ref([]) // todas las posibles ubicaciones

// 📦 Cargar locations asociadas a la ruta
const loadLocations = async () => {
  if (!props.route) {
    locations.value = []
    return
  }

  loading.value = true
  try {
    // fetchLocationsByRoute devuelve entities (array normalizado)
    const data = await store.fetchLocationsByRoute(props.route.id)
    locations.value = data ?? []
  } catch (err) {
    console.error('Error loading locations by route:', err)
    // fallback si el store falla
    locations.value = props.route.locations ?? []
  } finally {
    loading.value = false
  }
}

// 🗺️ Cargar todas las ubicaciones disponibles (para mostrar en el mapa)
const loadAllLocations = async () => {
  try {
    allLocations.value = await store.fetchAllLocations?.() ?? []
  } catch (err) {
    console.warn('No se pudieron cargar todas las ubicaciones:', err)
    allLocations.value = []
  }
}

onMounted(async () => {
  await Promise.all([loadLocations(), loadAllLocations()])
})

// 🔁 Reaccionar a cambios en la ruta actual
watch(() => props.route?.id, async (newVal, oldVal) => {
  if (newVal !== oldVal) await loadLocations()
})

// 📍 Seleccionar ubicación
const handleSelectLocation = (loc) => {
  selectedLocation.value = loc
}

// ➕ Agregar ubicación a la ruta
const handleAddToSelected = (loc) => {
  if (!locations.value.some(l => l.id === loc.id)) {
    locations.value.push(loc)
  }
}

// ➖ Quitar ubicación de la ruta
const handleRemoveFromSelected = (loc) => {
  locations.value = locations.value.filter(l => l.id !== loc.id)
  if (selectedLocation.value && selectedLocation.value.id === loc.id) {
    selectedLocation.value = null
  }
}
</script>

<template>
  <div class="locations-tab">
    <!-- 📋 Lista de ubicaciones asignadas -->
    <SelectedLocationsList
        :locations="locations"
        :selectedLocation="selectedLocation"
        @select="handleSelectLocation"
    />

    <!-- 🔍 Zona central con detalles y mapa -->
    <div class="search-locations-section">
      <LocationDetails
          :location="selectedLocation"
          :isSelected="selectedLocation && locations.some(l => l.id === selectedLocation.id)"
          :isReadOnly="false"
          @select="handleAddToSelected"
          @unselect="handleRemoveFromSelected"
      />

      <InteractiveMap
          :locations="allLocations"
          :selectedLocation="selectedLocation"
          @select="handleSelectLocation"
      />
    </div>
  </div>
</template>

<style scoped>
.locations-tab {
  display: flex;
  gap: 1.2rem;
  min-height: 420px;
}

/* Contenedor de la sección derecha (detalles + mapa) */
.search-locations-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
}

/* Diseño limpio para estructura consistente */
.selected-list,
.location-details,
.interactive-map {
  border-radius: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
