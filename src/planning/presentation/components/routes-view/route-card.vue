<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const props = defineProps({
  route: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const { t } = useI18n()

const handleClick = () => {
  // Navigate to route monitor
  router.push({ name: 'route-monitor', params: { routeId: props.route.id } })
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return 'Invalid Date'
  }
}

const statusSeverity = computed(() => {
  const status = props.route.status?.toLowerCase() || ''
  if (status === 'completed' || status === 'delivered') return 'success'
  if (status === 'in_progress' || status === 'in transit') return 'info'
  if (status === 'cancelled' || status === 'rejected') return 'danger'
  return 'warning'
})
</script>

<template>
  <button class="route-card" @click="handleClick">
    <div class="route-info">
      <div class="flex align-items-center gap-2 mb-2">
        <div class="text-900 text-lg font-semibold">
          {{ route.id }}
        </div>
        <div 
            class="color-badge" 
            :style="{ backgroundColor: route.colorCode || '#003087' }"
            :title="route.colorCode"
        ></div>
        <span 
            class="status-badge"
            :class="`status-${statusSeverity}`"
        >
          {{ route.status || 'Unknown' }}
        </span>
      </div>
    </div>

    <div class="route-meta">
      <div v-if="route.startedAt" class="meta-item">
        <div class="text-500 text-xs">{{ t('routes.item.started') }}</div>
        <div class="text-700 text-sm font-medium">
          {{ formatDate(route.startedAt) }}
        </div>
      </div>
      <div v-if="route.endedAt" class="meta-item">
        <div class="text-500 text-xs">{{ t('routes.item.ended') }}</div>
        <div class="text-700 text-sm font-medium">
          {{ formatDate(route.endedAt) }}
        </div>
      </div>
    </div>
  </button>
</template>

<style scoped>
.route-card {
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

.route-card:hover {
  box-shadow: 0 4px 12px rgba(4, 56, 115, 0.1);
  transform: translateY(-2px);
}

.route-card:active {
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
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.color-badge {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-success {
  background-color: #d1fae5;
  color: #065f46;
}

.status-info {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-warning {
  background-color: #fef3c7;
  color: #92400e;
}

.status-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

button {
  all: unset;
  box-sizing: border-box;
}

.route-card:focus {
  outline: 2px solid #043873;
  outline-offset: 2px;
}
</style>

