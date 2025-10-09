<script setup>
// @TODO USAR UN COMPONENTE REUTILIZADO DE MAPA INTERACTIVO

import { ref, computed } from 'vue'
const props = defineProps({ 
  locations: Array,
  selectedLocation: Object 
})
const emits = defineEmits(['select'])
const selectedClient = ref(null)

// Crear lista única de clientes para el autocomplete
const clients = computed(() => {
  const uniqueClients = [...new Set(props.locations.map(loc => loc.client))]
  return uniqueClients.map(client => ({ label: client, value: client }))
})

// Filtrar ubicaciones por cliente seleccionado
const filteredLocations = computed(() => {
  if (!selectedClient.value) {
    return props.locations
  }
  return props.locations.filter(loc => loc.client === selectedClient.value.value)
})

const handleClientSelect = (event) => {
  selectedClient.value = event.value
}
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

    <div class="map">
      <div v-for="loc in filteredLocations"
           :key="loc.id"
           class="mock-marker"
           :class="{ 'selected': selectedLocation && selectedLocation.id === loc.id }"
           @click="$emit('select', loc)">
        📍 {{ loc.client }}
      </div>
    </div>
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
}

.search-bar {
  margin-bottom: 1rem;
}

.map {
  flex: 1;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  min-height: 400px;
}

.mock-marker {
  cursor: pointer;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.mock-marker:hover {
  border-color: #043873;
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(4, 56, 115, 0.1);
}

.mock-marker.selected {
  border-color: #043873;
  background: #043873;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(4, 56, 115, 0.2);
}

.mock-marker.selected:hover {
  background: #032a5a;
}
</style>
