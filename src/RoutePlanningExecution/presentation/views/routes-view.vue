<script setup>
import { ref } from 'vue'
import RouteList from '../components/routes-view/route-list.vue'
import NewRouteModal from '../components/routes-view/new-route-modal.vue'
import TopActions from '../components/routes-view/top-actions.vue'

// Estado general
const plannedDate = ref(null)
const showModal = ref(false)

// Lista reactiva de rutas
const routes = ref([
  { id: 'R-2025-001', vehicle: 'ABC-123', status: 'Published', locations: 3, color: '#008000' },
  { id: 'R-2025-002', vehicle: 'XYZ-125', status: 'Draft', locations: 3, color: '#ff0000' }
])

// Nueva ruta
const handleAddRoute = (routeData) => {
  routes.value.push({
    id: `R-2025-${String(routes.value.length + 1).padStart(3, '0')}`,
    vehicle: routeData.vehicle || 'Unassigned',
    status: 'Draft',
    locations: 0,
    color: routeData.color
  })
}
</script>

<template>
  <section class="routes-container">
    <!-- Header -->
    <h2>Routes</h2>
    <p class="subtitle">Add or edit your routes for the delivery</p>

    <!-- Top Actions -->
    <TopActions
        v-model="plannedDate"
        @create-route="showModal = true"
    />

    <!-- Lista -->
    <RouteList :routes="routes" />

    <!-- Modal -->
    <NewRouteModal
        v-if="showModal"
        @close="showModal = false"
        @create="handleAddRoute"
    />
  </section>
</template>

<style scoped>
.routes-container {
  max-width: 900px;
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.subtitle {
  color: #555;
  margin-bottom: 0.5rem;
}
</style>
