<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  delivery: {
    type: Object,
    required: true
  },
  location: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['complete', 'reject'])

const { t } = useI18n()

const isCompleted = computed(() => props.delivery.state === 'completed')
const isRejected = computed(() => props.delivery.state === 'rejected')
const isPending = computed(() => !isCompleted.value && !isRejected.value)

const handleComplete = () => {
  if (!isCompleted.value && !isRejected.value) {
    emit('complete', props.delivery.id)
  }
}

const handleReject = () => {
  if (!isCompleted.value && !isRejected.value) {
    emit('reject', props.delivery.id)
  }
}

const clientName = computed(() => {
  return props.location?.customerId
      ? `Client ${props.location.customerId}`
      : t('transportist.delivery.unknownClient')
})

const address = computed(() => {
  return props.location?.address || t('transportist.delivery.noAddress')
})

const locationType = computed(() => {
  return props.location?.type || 'store'
})
</script>

<template>
  <div class="delivery-card" :class="{ completed: isCompleted, rejected: isRejected }">
    <div class="card-header">
      <div class="client-info">
        <h3 class="client-name">{{ clientName }}</h3>
        <div class="address">
          <i class="pi pi-map-marker"></i>
          <span>{{ address }}</span>
        </div>
      </div>
      <pv-badge
          :value="locationType"
          severity="info"
          class="type-badge"
      />
    </div>

    <div v-if="isPending" class="card-actions">
      <button class="action-btn complete-btn" @click="handleComplete">
        <i class="pi pi-check"></i>
        {{ t('transportist.delivery.complete') }}
      </button>
      <button class="action-btn reject-btn" @click="handleReject">
        <i class="pi pi-times"></i>
        {{ t('transportist.delivery.reject') }}
      </button>
    </div>

    <div v-else-if="isCompleted" class="status-message completed-message">
      <i class="pi pi-check-circle"></i>
      {{ t('transportist.delivery.completedStatus') }}
    </div>

    <div v-else-if="isRejected" class="status-message rejected-message">
      <i class="pi pi-times-circle"></i>
      {{ t('transportist.delivery.rejectedStatus') }}
    </div>
  </div>
</template>

<style scoped>
.delivery-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.delivery-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.delivery-card.completed {
  background: #f0fdf4;
  border-color: #86efac;
}

.delivery-card.rejected {
  background: #fef2f2;
  border-color: #fca5a5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.client-info {
  flex: 1;
}

.client-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.address {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #718096;
}

.address i {
  font-size: 0.85rem;
}

.type-badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.action-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.complete-btn {
  background: #10b981;
  color: white;
}

.complete-btn:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.reject-btn {
  background: #ef4444;
  color: white;
}

.reject-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.status-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 1rem;
}

.completed-message {
  background: #d1fae5;
  color: #065f46;
}

.rejected-message {
  background: #fee2e2;
  color: #991b1b;
}

.status-message i {
  font-size: 1.1rem;
}
</style>