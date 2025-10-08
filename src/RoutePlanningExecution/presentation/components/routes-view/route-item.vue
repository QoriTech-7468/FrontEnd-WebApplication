<script setup>
import { useRouter } from 'vue-router'
import RouteStatusBadge from './route-status-badge.vue'

const props = defineProps({ route: Object })
const router = useRouter()

const handleClick = () => {
  if (props.route.status === 'Draft') {
    router.push({ name: 'route-edit', params: { routeId: props.route.id } })
  }
  else if (props.route.status === 'Published') {
    router.push({ name: 'route-monitor', params: { routeId: props.route.id } })
  }
  else {
    alert('This route cannot be edited or monitored.')
  }
}
</script>

<template>
  <button class="route-item" @click="handleClick">
    <div class="route-info">
      <h4>{{ route.id }}</h4>
      <RouteStatusBadge :status="route.status" />
      <p>{{ route.vehicle }}</p>
    </div>
    <p>Locations: {{ route.locations }}</p>
  </button>
</template>

<style scoped>
.route-item {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  cursor: pointer;
  max-width: 100%;
  transition: background 0.2s, box-shadow 0.2s;
}

.route-item:hover {
  background: #f7faff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.route-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

button {
  all: unset;
}
</style>
