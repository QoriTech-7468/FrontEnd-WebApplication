<script setup>
// @TODO USAR UN COMPONENTE REUTILIZADO DE MAPA INTERACTIVO

import { ref, computed } from 'vue'
const props = defineProps({ locations: Array })
const emits = defineEmits(['select'])
const search = ref('')

const filteredLocations = computed(() =>
    props.locations.filter(loc =>
        loc.client.toLowerCase().includes(search.value.toLowerCase())
    )
)
</script>

<template>
  <div class="map-container">
    <div class="search-bar">
      <input
          v-model="search"
          placeholder="Search client"
      />
    </div>

    <div class="map">
      <div v-for="loc in filteredLocations"
           :key="loc.id"
           class="mock-marker"
           @click="$emit('select', loc)">
        📍 {{ loc.client }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}
.search-bar input {
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 1rem;
}
.map {
  height: 200px;
  background: #fafafa;
  border: 1px dashed #ccc;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}
.mock-marker {
  cursor: pointer;
  background: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}
</style>
