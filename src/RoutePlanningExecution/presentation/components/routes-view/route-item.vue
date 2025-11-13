<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue' //  computed

import useFleetStore from '../../../../FleetAndResourceManagement/application/fleet-resource-management.store.js'

import RouteStatusBadge from './route-status-badge.vue'

const props = defineProps({
  route: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const { t } = useI18n()

//  Inicializar el store
const fleetStore = useFleetStore()

const assignedVehicle = computed(() => {
  if (!props.route.vehicleId) return null
  
  return fleetStore.vehicles.find(v => v.id === props.route.vehicleId)
})

const handleClick = () => {
  if (props.route.state === 'draft') {
    router.push({ name: 'route-edit', params: { routeId: props.route.id } })
  }
  else if (props.route.state === 'published') {
    router.push({ name: 'route-monitor', params: { routeId: props.route.id } })
  }
  else {
    alert(t('routes.item.error'))
  }
}
</script>

<template>
  <button class="route-item" @click="handleClick">
    <div class="route-info">
      <div class="flex align-items-center gap-2 mb-2">
        <div class="text-900 text-lg font-semibold">
          {{ route.id }}
        </div>
        <RouteStatusBadge :status="route.state" />
      </div>

      <div class="text-600 text-sm mb-1">
        <span v-if="assignedVehicle">
          <i class="pi pi-truck text-xs mr-1"></i>
          {{ assignedVehicle.plate }}
        </span>
        <span v-else class="italic text-500">
          {{ t('routes.item.noVehicle') }}
        </span>
      </div>
    </div>

    <div class="route-meta">
      <div class="text-500 text-sm">{{ t('routes.item.created') }}</div>
      <div class="text-700 font-medium">
        {{ new Date(route.createdAt).toLocaleDateString() }}
      </div>
    </div>
  </button>
</template>

<style scoped>
.route-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #ffffff;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  text-align: left;
}

.route-item:hover {
  box-shadow: 0 4px 12px rgba(4, 56, 115, 0.1);
  transform: translateY(-2px);
}

.route-item:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(4, 56, 115, 0.15);
}

.route-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.route-meta {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

button {
  all: unset;
  box-sizing: border-box;
}

/* Estado enfocado (accesibilidad) */
.route-item:focus {
  outline: 2px solid #043873;
  outline-offset: 2px;
}
</style>
