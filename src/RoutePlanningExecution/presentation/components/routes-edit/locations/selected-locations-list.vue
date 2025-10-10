<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  locations: { type: Array, default: () => [] },
  selectedLocation: { type: Object, default: null }
})

const emits = defineEmits(['select'])

const handleSelect = (loc) => {
  emits('select', loc)
}
</script>

<template>
  <div class="selected-locations-list">
    <div v-if="!locations || locations.length === 0" class="empty text-sm text-muted p-4">
      No locations assigned to this route.
    </div>

    <ul v-else class="list p-2">
      <li
          v-for="loc in locations"
          :key="loc.id"
          :class="['location-item p-2 rounded cursor-pointer', { 'selected': selectedLocation && selectedLocation.id === loc.id }]"
          @click="handleSelect(loc)"
      >
        <div class="font-medium">{{ loc.address || loc.name || ('Location ' + loc.id) }}</div>
        <div class="text-sm text-muted">{{ loc.client ?? '' }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list { display:flex; flex-direction:column; gap:0.5rem; }
.location-item { border: 1px solid #e5e7eb; background: #fff; }
.location-item.selected { border-color: #003087; box-shadow: 0 2px 6px rgba(0,48,135,0.08); }
.empty { color: #6b7280; }
</style>
