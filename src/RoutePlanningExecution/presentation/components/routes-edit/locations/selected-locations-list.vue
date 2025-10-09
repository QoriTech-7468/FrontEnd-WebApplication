<script setup>
import { computed } from 'vue'

const props = defineProps({ locations: Array })

// Example data for demonstration
const exampleLocations = [
  {
    id: 1,
    address: "Av. Industrial 123, Lima",
    client: "ACME Corp"
  },
  {
    id: 2,
    address: "Jr. Los Olivos 456, Lima", 
    client: "Distribuidora Lima"
  },
  {
    id: 3,
    address: "Av. Pachacutec 789, Callao",
    client: "North Branch"
  }
]

// Use provided locations or fall back to example data
const displayLocations = computed(() => {
  return props.locations && props.locations.length > 0 ? props.locations : exampleLocations
})
</script>

<template>
  <div class="selected-list">
    <h4 class="title">Selected Locations ({{ displayLocations.length }})</h4>
    <div v-if="displayLocations.length === 0" class="empty">
      No locations selected yet.
    </div>
    <div v-else class="list">
      <div v-for="(loc, index) in displayLocations" :key="loc.id" class="location-item" :class="{ 'has-accent': index === 0 }">
        <div class="location-content">
          <div class="location-address">{{ loc.address }}</div>
          <div class="location-client">{{ loc.client }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected-list {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1.5rem 0;
  padding-left: 0.5rem;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.location-item {
  position: relative;
  padding-left: 0.5rem;
}

.location-item.has-accent::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #FFD60A;
  border-radius: 2px;
}

.location-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.location-address {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
}

.location-client {
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.4;
}

.empty {
  color: #9ca3af;
  font-style: italic;
  text-align: center;
  padding: 2rem 1rem;
  font-size: 0.875rem;
}
</style>
