<script setup>
import { ref, onMounted } from 'vue'
import { useRoutePlanningStore } from '../../application/routeplanning.store.js'
import RouteList from '../components/routes-view/route-list.vue'
import NewRouteModal from '../components/routes-view/new-route-modal.vue'
import TopActions from '../components/routes-view/top-actions.vue'

const store = useRoutePlanningStore()
const plannedDate = ref(null)
const showModal = ref(false)

onMounted(async () => {
  await store.fetchAllRoutes()
})

const handleAddRoute = async (routeData) => {
  try {
    await store.createDraftRoute({
      color: routeData.color,
      vehicleId: routeData.vehicleId ?? null,
      date: plannedDate.value ?? null
    });
  } catch (err) {
    console.error('Error creating draft route:', err)
  } finally {
    showModal.value = false
  }
}

const handleCreateClick = () => {
  showModal.value = true
}
</script>

<template>
  <div class="routes-view">
    <!-- Encabezado -->
    <div class="mb-3">
      <div class="text-900 text-3xl font-semibold">Routes</div>
      <div class="text-600">Add or edit your routes for the delivery</div>
    </div>

    <!-- Acciones Superiores -->
    <TopActions
        v-model="plannedDate"
        @create-route="handleCreateClick"
    />

    <!-- Lista de Rutas -->
    <RouteList :routes="store.routes" />

    <!-- Modal Nueva Ruta -->
    <NewRouteModal
        v-if="showModal"
        @close="showModal = false"
        @create="handleAddRoute"
    />
  </div>
</template>

<style scoped>
.routes-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Botones uniformes */
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
