<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  locations: { type: Array, default: () => [] },
  selectedLocation: { type: Object, default: null }
})

const emits = defineEmits(['select'])

const handleSelect = (location) => {
  emits('select', location)
}
</script>

<template>
  <div class="selected-list">
    <h4 class="title p-3">
      Selected Locations ({{ locations.length }})
    </h4>

    <!-- Empty state -->
    <div v-if="!locations || locations.length === 0" class="empty">
      No locations assigned to this route.
    </div>

    <!-- List of locations -->
    <div v-else class="list">
      <div
          v-for="loc in locations"
          :key="loc.id"
          class="location-item"
          :class="{ 'has-accent': selectedLocation && selectedLocation.id === loc.id }"
          @click="handleSelect(loc)"
      >
        <div class="location-content">
          <div class="location-name">{{ loc.address || loc.name || ('Location ' + loc.id) }}</div>
          <div v-if="loc.client" class="location-client">{{ loc.client }}</div>
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

/* Title header */
.title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.75rem 0;
  padding-left: 1rem;
}

/* List container */
.list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Location item */
.location-item {
  position: relative;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.location-item:hover {
  background: #f9fafb;
}

/* Accent highlight for selected item */
.location-item.has-accent {
  background: #f0f6ff;
  padding-left: 1.25rem;
  border-left: 4px solid #003087;
}

/* Inner content */
.location-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.location-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.location-client {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Empty state */
.empty {
  color: #9ca3af;
  font-style: italic;
  text-align: center;
  padding: 2rem 1rem;
  font-size: 0.9rem;
}
</style>
