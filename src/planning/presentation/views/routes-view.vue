<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia' 
import { useRoutePlanningStore } from '../../application/routing.store.js'

//  Importar el store de vehículos
import useFleetStore from '../../../fleets/application/fleet-resource-management.store.js'

import RouteList from '../components/routes-view/route-list.vue'
import NewRouteModal from '../components/routes-view/new-route-modal.vue'
import TopActions from '../components/routes-view/top-actions.vue'

const { t } = useI18n()

const store = useRoutePlanningStore()

const fleetStore = useFleetStore()
const { vehiclesLoaded } = storeToRefs(fleetStore) 

const plannedDate = ref(null)
const showModal = ref(false)

onMounted(async () => {
  await store.fetchAllRoutes()

  //  Cargar los vehículos para que los 'route-item' puedan mostrar la placa
  if (!vehiclesLoaded.value) {
    await fleetStore.fetchVehicles()
  }
})

const handleAddRoute = async (routeData) => {
  try {
    await store.createDraftRoute({
      color: routeData.color,
      vehicleId: routeData.vehicleId ?? null,
      date: plannedDate.value ?? null
    })
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
    <div class="flex align-items-center justify-content-between mb-3">
      <div>
        <div class="text-900 text-3xl font-semibold">{{ t('routes.title') }}</div>
        <div class="text-600">{{ t('routes.subtitle') }}</div>
      </div>

      <pv-button
          label="New Route"
          icon="pi pi-plus-circle"
          class="font-medium"
          @click="handleCreateClick"
      />
    </div>

    <!-- Acciones Superiores -->
    <TopActions
        v-model="plannedDate"
        @create-route="handleCreateClick"
    />

    <!-- Lista de Rutas -->
    <RouteList :routes="store.routes" />
    
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
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

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
