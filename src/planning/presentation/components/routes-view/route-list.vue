<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import RouteItem from './route-item.vue'

const props = defineProps({
  routes: {
    type: Array,
    default: () => []
  },
  plannedDate: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['create-route'])

const { t } = useI18n()

const isButtonDisabled = computed(() => {
  if (!props.plannedDate) return true
  // Handle both Date objects and strings
  if (props.plannedDate instanceof Date) {
    return false // Date object is valid
  }
  if (typeof props.plannedDate === 'string') {
    const trimmed = props.plannedDate.trim()
    return trimmed === '' || trimmed === null || trimmed === undefined
  }
  return true
})

const handleNewRoute = () => {
  if (!isButtonDisabled.value) {
    emit('create-route')
  }
}
</script>

<template>
  <div class="route-list">
    <!-- Encabezado -->
    <div class="flex align-items-center justify-content-between mb-3">
      <div>
        <div class="text-900 text-2xl font-semibold mb-1">
          {{ t('routes.list.title') }}
        </div>
        <div class="text-600 text-sm">
          {{ t('routes.list.total', { count: routes.length }) }}
        </div>
      </div>
      <pv-button
          label="New Route"
          icon="pi pi-plus-circle"
          class="font-medium"
          :disabled="isButtonDisabled"
          @click="handleNewRoute"
      />
    </div>

    <!-- Lista de rutas -->
    <div v-if="routes.length" class="list">
      <RouteItem
          v-for="route in routes"
          :key="route.id"
          :route="route"
      />
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <i class="pi pi-road text-400 text-4xl mb-3"></i>
      <p class="text-600 text-base">{{ $t('routes.list.empty') }}</p>
    </div>
  </div>
</template>

<style scoped>
.route-list {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Estado vacío */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  color: #9ca3af;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

.empty-state:hover {
  background-color: #f5f5f5;
}
</style>
