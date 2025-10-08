<script setup>
defineProps({ locations: Array })
</script>

<template>
  <div class="selected-list">
    <h4>Selected Locations (#)</h4>
    <div v-if="locations.length === 0" class="empty">
      No locations selected yet.
    </div>
    <div v-else class="list">
      <div v-for="loc in locations" :key="loc.id" class="location-item">
        <strong>{{ loc.address }}</strong>
        <p>{{ loc.client }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected-list {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}
.location-item {
  margin-bottom: 0.8rem;
}
.empty {
  color: #777;
  font-style: italic;
}
</style>
