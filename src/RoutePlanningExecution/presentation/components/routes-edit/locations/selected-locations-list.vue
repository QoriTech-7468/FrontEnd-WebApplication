<script setup>
const props = defineProps({ 
  locations: Array,
  selectedLocation: Object 
})
const emits = defineEmits(['select'])

const handleLocationClick = (location) => {
  emits('select', location)
}
</script>

<template>
  <div class="selected-list">
    <h4 class="title p-3">Selected Locations ({{ locations.length }})</h4>
    <div v-if="locations.length === 0" class="empty">
      No locations selected yet.
    </div>
    <div v-else class="list">
      <div v-for="(loc, index) in locations" 
           :key="loc.id" 
           class="location-item" 
           :class="{ 'has-accent': selectedLocation && selectedLocation.id === loc.id }"
           @click="handleLocationClick(loc)">
        <div class="location-content">
          <div class="location-name">{{ loc.address }}</div>
          <div class="location-client">{{ loc.client }}</div>
          <div v-if="loc.address" class="location-address">{{ loc.address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected-list {
  background: white;
  width: 300px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
  padding-left: 1rem;
}

.list {
  display: flex;
  flex-direction: column;
}

.location-item {
  position: relative;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.location-item.has-accent {
  padding-left: 1rem;
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

.location-item:hover {
  background: #f8fafc;
}

.location-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.location-name {
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

.location-address {
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
