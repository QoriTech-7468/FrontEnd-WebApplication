<script setup>
import RouteItem from './route-item.vue'
defineProps({ routes: Array })
</script>

<template>
  <div class="route-list">
    <h4>Routes</h4>
    <p class="total">Total routes: {{ routes.length }}</p>

    <div class="list">
      <RouteItem
          v-for="route in routes"
          :key="route.id"
          :route="route"
      />
    </div>
  </div>
</template>

<style scoped>
.route-list {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;
}
.total {
  font-size: 0.9rem;
  color: #666;
}
</style>
