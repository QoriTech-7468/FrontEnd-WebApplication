<script setup>
import RouteItem from './route-item.vue'
defineProps({ routes: Array })
</script>

<template>
  <div class="route-list">
    <div class="flex align-items-center justify-content-between mb-3">
      <div>
        <div class="text-900 text-2xl font-semibold mb-1">Routes</div>
        <div class="text-600 text-sm">Total routes: {{ routes.length }}</div>
      </div>
    </div>

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
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Empty state styling */
.list:empty::before {
  content: "No routes found";
  display: block;
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-style: italic;
}
</style>
