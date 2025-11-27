<script setup>
import { ref, onMounted, computed } from 'vue' // Importar 'computed'
import { storeToRefs } from 'pinia'
import SelectedLocationsList from './selected-locations-list.vue'
import LocationDetails from './location-details.vue'
import InteractiveMap from './interactive-map.vue'

// Importar el store de FLOTA
import customerStore from '../../../../../crm/application/customer-location-management.store.js'

const props = defineProps({
  route: { type: Object, required: true }
})

const fleetStore = customerStore()

const { locations: allLocations, locationsLoaded } = storeToRefs(fleetStore)
const selectedLocation = ref(null)

// Cargar todas las locaciones disponibles (para el mapa)
onMounted(() => {
  if (!locationsLoaded.value) {
    fleetStore.fetchLocations()
  }
})

const isSelected = computed(() => {
  if (!selectedLocation.value || !props.route.locations) return false
  return props.route.locations.some(l => l.id === selectedLocation.value.id)
})

const handleSelectLocation = (loc) => {
  selectedLocation.value = loc
}

const handleAddToSelected = (loc) => {
  if (!props.route.locations.some(l => l.id === loc.id)) {
    props.route.locations.push(loc)
  }
}

const handleRemoveFromSelected = (loc) => {
  props.route.locations = props.route.locations.filter(l => l.id !== loc.id)
  
  if (selectedLocation.value && selectedLocation.value.id === loc.id) {
    selectedLocation.value = null
  }
}
</script>

<template>
  <div class="locations-tab">
    <SelectedLocationsList
        :locations="route.locations"
        :selectedLocation="selectedLocation"
        @select="handleSelectLocation"
    />

    <div class="search-locations-section">
      <LocationDetails
          :location="selectedLocation"
          :isSelected="isSelected" :isReadOnly="false"
          @select="handleAddToSelected"
          @unselect="handleRemoveFromSelected"
      />

      <InteractiveMap
          :locations="allLocations" :selectedLocation="selectedLocation"
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

.search-locations-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
}

.selected-list,
.location-details,
.interactive-map {
  border-radius: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
