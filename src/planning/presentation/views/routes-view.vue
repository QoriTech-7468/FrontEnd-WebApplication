<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia' 
import { usePlanningStore } from '../../application/planning.store.js'

//  Importar el store de vehículos
import useFleetStore from '../../../fleets/application/fleets.store.js'

import RouteList from '../components/routes-view/route-list.vue'
import TopActions from '../components/routes-view/top-actions.vue'
import NewRouteModal from '../components/routes-view/new-route-modal.vue'

const { t } = useI18n()

const store = usePlanningStore()

const fleetStore = useFleetStore()
const { vehiclesLoaded } = storeToRefs(fleetStore) 

const plannedDate = ref(null)
const loading = ref(false)
const showModal = ref(false)

// Helper to normalize date (handle both Date objects and strings)
const normalizeDate = (dateValue) => {
  if (!dateValue) return null
  // If it's a Date object, convert to string
  if (dateValue instanceof Date) {
    const year = dateValue.getFullYear()
    const month = String(dateValue.getMonth() + 1).padStart(2, '0')
    const day = String(dateValue.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  // If it's already a string, return it
  if (typeof dateValue === 'string') {
    return dateValue.trim()
  }
  return null
}

// Convert date string (yyyy-mm-dd) to ISO date-time format
const convertDateToISO = (dateValue) => {
  const dateString = normalizeDate(dateValue)
  if (!dateString) return null
  // If date is in format yyyy-mm-dd, convert to ISO
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(dateString + 'T00:00:00.000Z').toISOString()
  }
  return dateString
}

// Helper to check if date is valid
const isValidDate = (dateValue) => {
  const normalized = normalizeDate(dateValue)
  return normalized !== null && normalized !== '' && normalized.trim() !== ''
}

// Watch for date changes and fetch route drafts
watch(plannedDate, async (newDate) => {
  if (isValidDate(newDate)) {
    try {
      const isoDate = convertDateToISO(newDate)
      if (isoDate) {
        await store.fetchRouteDrafts(isoDate)
      }
    } catch (err) {
      console.error('Error fetching route drafts:', err)
    }
  } else {
    // Clear route drafts when date is cleared
    store.routeDrafts = []
  }
})

onMounted(async () => {
  await store.fetchAllRoutes()

  //  Cargar los vehículos para que los 'route-item' puedan mostrar la placa
  if (!vehiclesLoaded.value) {
    await fleetStore.fetchVehicles()
  }
})

const handleCreateRoute = () => {
  // Open the modal
  showModal.value = true
}

const handleAddRoute = async (routeData) => {
  // Double check that we have a valid date
  if (!isValidDate(plannedDate.value)) {
    console.warn('Cannot create route draft: no date selected')
    showModal.value = false
    return
  }

  try {
    loading.value = true
    const isoDate = convertDateToISO(plannedDate.value)
    
    if (!isoDate) {
      console.error('Invalid date format')
      showModal.value = false
      return
    }

    console.log('Creating route draft with:', {
      colorCode: routeData.color || '#003087',
      executionDate: isoDate
    })

    await store.createRouteDraft({
      colorCode: routeData.color || '#003087', // Use color from modal or default
      executionDate: isoDate
    })
    
    // Refresh route drafts after creation
    await store.fetchRouteDrafts(isoDate)
  } catch (err) {
    console.error('Error creating route draft:', err)
  } finally {
    loading.value = false
    showModal.value = false
  }
}
</script>

<template>
  <div class="routes-view">
    <div class="flex align-items-center justify-content-between mb-3">
      <div>
        <div class="text-900 text-3xl font-semibold">{{ t('routes.title') }}</div>
        <div class="text-600">{{ t('routes.subtitle') }}</div>
      </div>
    </div>

    <!-- Acciones Superiores -->
    <TopActions
        v-model="plannedDate"
    />

    <!-- Lista de Rutas -->
    <RouteList 
        :routes="store.routeDrafts" 
        :plannedDate="plannedDate"
        @create-route="handleCreateRoute"
    />

    <!-- Modal para crear nueva ruta -->
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
