<script setup>
const props = defineProps({ location: Object, isSelected: Boolean })
const emits = defineEmits(['select', 'unselect'])
</script>

<template>
  <div class="details">
    <h4>Location Details</h4>

    <div v-if="location" class="info">
      <div><strong>ID:</strong> {{ location.id }}</div>
      <div><strong>Address:</strong> {{ location.address }}</div>
      <div><strong>Client:</strong> {{ location.client }}</div>
      <div><strong>Latitude:</strong> {{ location.latitude }}</div>
      <div><strong>Longitude:</strong> {{ location.longitude }}</div>

      <div class="actions">
        <button
            v-if="!isSelected"
            class="select"
            @click="$emit('select', location)"
        >
          Select
        </button>
        <button
            v-else
            class="unselect"
            @click="$emit('unselect', location)"
        >
          Unselect
        </button>
      </div>
    </div>

    <div v-else class="empty">Select a location to view details</div>
  </div>
</template>

<style scoped>
.details {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}
.actions {
  margin-top: 1rem;
}
button {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
button.select {
  background: #007bff;
  color: white;
}
button.unselect {
  background: #f44336;
  color: white;
}
.empty {
  color: #777;
  font-style: italic;
}
</style>
