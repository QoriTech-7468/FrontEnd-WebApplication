<script setup>
const props = defineProps({ status: String })

const colorMap = {
  Draft: '#e74c3c',
  Published: '#f1c40f'
}
</script>

<template>
  <span
      class="status-badge"
      :style="{ backgroundColor: colorMap[status] || '#bbb' }"
  >
    {{ status }}
  </span>
</template>

<style scoped>
.status-badge {
  font-size: 0.7rem;
  color: black;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-weight: 600;
  text-transform: uppercase;
}
</style>
