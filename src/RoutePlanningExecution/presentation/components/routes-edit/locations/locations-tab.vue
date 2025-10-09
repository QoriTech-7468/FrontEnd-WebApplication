<script setup>
import { ref } from 'vue'
import SelectedLocationsList from './selected-locations-list.vue'
import LocationDetails from './location-details.vue'
import InteractiveMap from './interactive-map.vue'

const props = defineProps({ route: Object })
const selectedLocation = ref(null)

const allLocations = ref([
  {
    id: 'P-001',
    address: 'Av. Industrial 123, Lima',
    client: 'ACME Corp',
    latitude: -12.0464,
    longitude: -77.0428,
    status: 'Active'
  },
  {
    id: 'P-002',
    address: 'Jr. Los Olivos 456, Lima',
    client: 'ACME Corp',
    latitude: -12.055,
    longitude: -77.05,
    status: 'Active'
  },
  {
    id: 'P-003',
    address: 'Av. Pachacutec 789, Callao',
    client: 'Distribuidora Lima',
    latitude: -12.07,
    longitude: -77.1,
    status: 'Active'
  }
])

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
}
</script>

<template>
  <div class="locations-tab">
      <SelectedLocationsList :locations="route.locations" />

      <div class="search-locations-section">
      <LocationDetails
          :location="selectedLocation"
          :isSelected="selectedLocation && route.locations.some(l => l.id === selectedLocation.id)"
          @select="handleAddToSelected"
          @unselect="handleRemoveFromSelected"
      />

      <InteractiveMap
          :locations="allLocations"
          @select="handleSelectLocation"
      />
      </div>
  </div>
</template>

<style scoped>
.locations-tab {
  display: flex;
  gap: 1rem;
}

.search-locations-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
}

.bottom-section {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
