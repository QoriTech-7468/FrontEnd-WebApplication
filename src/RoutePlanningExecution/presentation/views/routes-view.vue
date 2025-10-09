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
  <div class="flex align-items-center justify-content-between mb-2">
    <div class="mb-3">
      <div class="text-900 text-3xl font-semibold">Routes</div>
      <div class="text-600">Add or edit your routes for the delivery</div>
    </div>
    <pv-button label="New route" icon="pi pi-plus-circle" class="font-medium" @click="showModal = true" />
  </div>

  <!-- Top Actions -->
  <TopActions
      v-model="plannedDate"
  />

  <!-- Lista -->
  <RouteList :routes="routes" />

  <!-- Modal -->
  <NewRouteModal
      v-if="showModal"
      @close="showModal = false"
      @create="handleAddRoute"
  />
</template>

<style scoped>
/* ===== BUTTON STYLES ===== */
:deep(.p-button) {
  padding: 12px 20px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(4, 56, 115, 0.2) !important;
}

:deep(.p-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(4, 56, 115, 0.3) !important;
}

:deep(.p-button:active) {
  transform: translateY(0) !important;
}
</style>
