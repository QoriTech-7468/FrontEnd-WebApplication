<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  route: {
    type: Object,
    default: null
  },
  deliveries: {
    type: Array,
    default: () => []
  },
  filter: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:filter'])

const { t } = useI18n()

const totalDeliveries = computed(() => props.deliveries.length)

const completedDeliveries = computed(() => {
  return props.deliveries.filter(d => d.state === 'completed').length
})

const progressPercentage = computed(() => {
  if (totalDeliveries.value === 0) return 0
  return Math.round((completedDeliveries.value / totalDeliveries.value) * 100)
})

const formattedDate = computed(() => {
  if (!props.route?.createdAt) return 'N/A'
  const date = new Date(props.route.createdAt)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const filterOptions = [
  { value: 'all', label: 'transportist.filters.all' },
  { value: 'in_progress', label: 'transportist.filters.inProgress' },
  { value: 'completed', label: 'transportist.filters.completed' },
  { value: 'rejected', label: 'transportist.filters.rejected' }
]

const handleFilterChange = (event) => {
  emit('update:filter', event.value)
}
</script>

<template>
  <div class="progress-card">
    <div class="card-header">
      <div>
        <h2 class="route-title">{{ t('transportist.title') }}</h2>
        <p class="route-date">{{ formattedDate }}</p>
      </div>
      <pv-badge
          :value="`${totalDeliveries} ${t('transportist.stops')}`"
          severity="warning"
          class="stops-badge"
      />
    </div>

    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">{{ t('transportist.progress') }}</span>
        <span class="progress-value">{{ completedDeliveries }}/{{ totalDeliveries }} {{ t('transportist.done') }}</span>
      </div>
      <pv-progress-bar
          :value="progressPercentage"
          :show-value="false"
          class="custom-progress"
      />
    </div>

    <div class="filter-section">
      <pv-select
          :model-value="filter"
          :options="filterOptions"
          option-label="label"
          option-value="value"
          @update:model-value="handleFilterChange"
          class="filter-select"
      >
        <template #value="slotProps">
          <span v-if="slotProps.value">{{ t(filterOptions.find(o => o.value === slotProps.value)?.label) }}</span>
        </template>
        <template #option="slotProps">
          <span>{{ t(slotProps.option.label) }}</span>
        </template>
      </pv-select>
    </div>
  </div>
</template>

<style scoped>
.progress-card {
  background: linear-gradient(135deg, #FFC700 0%, #FFD700 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: #1a202c;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.route-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #1a202c;
}

.route-date {
  font-size: 0.9rem;
  margin: 0;
  color: #4a5568;
}

.stops-badge {
  background: white !important;
  color: #1a202c !important;
  font-weight: 700;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border-radius: 20px;
}

.progress-section {
  margin-bottom: 1.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a202c;
}

.progress-value {
  font-size: 1rem;
  font-weight: 700;
  color: #1a202c;
}

.custom-progress {
  height: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.4);
}

:deep(.p-progressbar-value) {
  background: #043873;
  border-radius: 10px;
}

.filter-section {
  margin-top: 1.5rem;
}

.filter-select {
  width: 100%;
}

:deep(.p-select) {
  background: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  font-weight: 600;
}

:deep(.p-select:hover) {
  border-color: rgba(255, 255, 255, 0.8);
}

:deep(.p-select-label) {
  color: #1a202c;
}
</style>