<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoutePlanningStore } from '../../application/routeplanning.store.js'
import { useToast } from 'primevue/usetoast'
import MapPlaceholder from '../components/transportist-routes/map-placeholder.vue'
import RouteProgressCard from '../components/transportist-routes/route-progress-card.vue'
import DeliveryList from '../components/transportist-routes/delivery-list.vue'
import RejectDeliveryModal from '../components/transportist-routes/reject-delivery-modal.vue'

const { t } = useI18n()
const store = useRoutePlanningStore()
const toast = useToast()

const loading = ref(true)
const showRejectModal = ref(false)
const selectedDeliveryId = ref(null)
const currentFilter = ref('all')

onMounted(async () => {
  try {
    loading.value = true
    await store.fetchTransportistRoute()

    // Cargar locations para mostrar detalles
    if (store.currentRoute) {
      await store.fetchLocationsByRoute(store.currentRoute.id)
    }
  } catch (err) {
    console.error('Error loading transportist route:', err)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('transportist.errors.loadError'),
      life: 3000
    })
  } finally {
    loading.value = false
  }
})

const handleCompleteDelivery = async (deliveryId) => {
  try {
    await store.completeDelivery(deliveryId)
    toast.add({
      severity: 'success',
      summary: t('transportist.notifications.completed'),
      detail: t('transportist.notifications.completedDetail'),
      life: 3000
    })
  } catch (err) {
    console.error('Error completing delivery:', err)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('transportist.errors.completeError'),
      life: 3000
    })
  }
}

const handleRejectDelivery = (deliveryId) => {
  selectedDeliveryId.value = deliveryId
  showRejectModal.value = true
}

const confirmReject = async (rejectionData) => {
  try {
    await store.rejectDelivery(
        selectedDeliveryId.value,
        rejectionData.reason,
        rejectionData.note
    )

    toast.add({
      severity: 'warn',
      summary: t('transportist.notifications.rejected'),
      detail: t('transportist.notifications.rejectedDetail'),
      life: 3000
    })

    showRejectModal.value = false
    selectedDeliveryId.value = null
  } catch (err) {
    console.error('Error rejecting delivery:', err)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('transportist.errors.rejectError'),
      life: 3000
    })
  }
}

const closeRejectModal = () => {
  showRejectModal.value = false
  selectedDeliveryId.value = null
}

const hasRoute = computed(() => !!store.currentRoute)
</script>

<template>
  <div class="transportist-view">
    <pv-toast />

    <div v-if="loading" class="loading-state">
      <pv-progress-spinner />
      <p>{{ t('common.loading') }}</p>
    </div>

    <div v-else-if="!hasRoute" class="no-route-state">
      <i class="pi pi-inbox no-route-icon"></i>
      <h2>{{ t('transportist.noRoute.title') }}</h2>
      <p>{{ t('transportist.noRoute.subtitle') }}</p>
    </div>

    <div v-else class="content-grid">
      <!-- Map Area -->
      <div class="map-area">
        <MapPlaceholder />
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        <RouteProgressCard
            :route="store.currentRoute"
            :deliveries="store.deliveries"
            v-model:filter="currentFilter"
        />

        <DeliveryList
            :deliveries="store.deliveries"
            :locations="store.locations"
            :filter="currentFilter"
            @complete="handleCompleteDelivery"
            @reject="handleRejectDelivery"
        />
      </div>
    </div>

    <!-- Reject Modal -->
    <RejectDeliveryModal
        v-if="showRejectModal"
        @close="closeRejectModal"
        @confirm="confirmReject"
    />
  </div>
</template>

<style scoped>
.transportist-view {
  width: 100%;
  height: calc(100vh - 80px);
  background: #f7fafc;
  padding: 0;
}

.loading-state,
.no-route-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #718096;
}

.loading-state p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.no-route-icon {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.no-route-state h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.no-route-state p {
  font-size: 1rem;
  color: #718096;
  margin: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 0;
  height: 100%;
}

.map-area {
  background: white;
  padding: 1.5rem;
  overflow: hidden;
}

.sidebar {
  background: #f7fafc;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-left: 1px solid #e2e8f0;
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 300px 1fr;
  }

  .sidebar {
    border-left: none;
    border-top: 1px solid #e2e8f0;
  }
}
</style>