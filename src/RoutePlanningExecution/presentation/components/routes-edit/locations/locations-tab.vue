<script setup>
import { ref, onMounted, watch } from 'vue'
import SelectedLocationsList from './selected-locations-list.vue'
import InteractiveMap from './interactive-map.vue'
import LocationDetails from './location-details.vue'
import { useRoutePlanningStore } from '../../../../application/routeplanning.store.js'

const props = defineProps({
  route: { type: Object, required: false, default: null }
})

const store = useRoutePlanningStore()
const loading = ref(false)
const locations = ref([])
const selectedLocation = ref(null)

// Cargar locations basadas en route.id (si existe)
const loadLocations = async () => {
  if (!props.route || !props.route.id) {
    locations.value = props.route?.locations ?? []
    return
  }

  loading.value = true
  try {
    // store.fetchLocationsByRoute devuelve array normalizado
    const data = await store.fetchLocationsByRoute(props.route.id)
    // fetchLocationsByRoute en tu store ya devuelve entities (o array vacio)
    locations.value = data ?? []
  } catch (err) {
    console.error('Error loading locations by route:', err)
    // fallback: si route trae un campo locations, lo usamos
    locations.value = props.route.locations ?? []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLocations()
})

// Si la prop route cambia (por ejemplo al navegar), recargamos
watch(() => props.route && props.route.id, (newVal, oldVal) => {
  if (newVal !== oldVal) loadLocations()
})

const handleSelectLocation = (loc) => {
  selectedLocation.value = loc
}
</script>

<template>
  <div class="locations-tab grid grid-cols-3 gap-4">
    <!-- Left: selected locations list -->
    <div class="col-span-1">
      <selected-locations-list
          :locations="locations"
          :selectedLocation="selectedLocation"
          @select="handleSelectLocation"
      />
    </div>

    <!-- Middle: map -->
    <div class="col-span-1">
      <interactive-map
          :locations="locations"
          :selectedLocation="selectedLocation"
          @select="handleSelectLocation"
      />
    </div>

    <!-- Right: details -->
    <div class="col-span-1">
      <location-details :location="selectedLocation" :isReadOnly="false" />
    </div>
  </div>
</template>

<style scoped>
.locations-tab { min-height: 420px; }
</style>
