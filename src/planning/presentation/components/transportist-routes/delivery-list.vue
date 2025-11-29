<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DeliveryCard from './delivery-card.vue'

const props = defineProps({
  deliveries: {
    type: Array,
    required: true
  },
  locations: {
    type: Array,
    default: () => []
  },
  filter: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['complete', 'reject'])

const { t } = useI18n()

// ✅ FIX: Mejorar la lógica de filtros
const filteredDeliveries = computed(() => {
  if (props.filter === 'all') {
    return props.deliveries
  }

  if (props.filter === 'in_progress') {
    // Mostrar pending e in_progress (todo lo que no está completado ni rechazado)
    return props.deliveries.filter(d =>
        d.state === 'pending' || d.state === 'in_progress'
    )
  }

  if (props.filter === 'rejected') {
    return props.deliveries.filter(d => d.state === 'rejected')
  }

  if (props.filter === 'completed') {
    return props.deliveries.filter(d => d.state === 'completed')
  }

  return props.deliveries
})

const getLocationForDelivery = (delivery) => {
  return props.locations.find(loc => loc.id === delivery.locationId)
}

const handleComplete = (deliveryId) => {
  emit('complete', deliveryId)
}

const handleReject = (deliveryId) => {
  emit('reject', deliveryId)
}
</script>

<template>
  <div class="delivery-list">
    <div v-if="filteredDeliveries.length === 0" class="empty-state">
      <i class="pi pi-inbox empty-icon"></i>
      <p class="empty-text">{{ t('transportist.delivery.noDeliveries') }}</p>
    </div>

    <DeliveryCard
        v-for="delivery in filteredDeliveries"
        :key="delivery.id"
        :delivery="delivery"
        :location="getLocationForDelivery(delivery)"
        @complete="handleComplete"
        @reject="handleReject"
    />
  </div>
</template>

<style scoped>
.delivery-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #a0aec0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 1rem;
  margin: 0;
}
</style>