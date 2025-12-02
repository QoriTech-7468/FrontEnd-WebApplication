<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import RouteDraftCard from './route-draft-card.vue'
import RouteCard from './route-card.vue'

const props = defineProps({
  routeDrafts: {
    type: Array,
    default: () => []
  },
  routes: {
    type: Array,
    default: () => []
  },
  plannedDate: {
    type: [String, Date],
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['create-route', 'fetch-route-drafts', 'fetch-routes'])

const { t } = useI18n()
const activeTab = ref(0) // 0 = Route Drafts, 1 = Routes

const isButtonDisabled = computed(() => {
  if (!props.plannedDate) return true
  if (props.plannedDate instanceof Date) return false
  if (typeof props.plannedDate === 'string') {
    const trimmed = props.plannedDate.trim()
    return trimmed === '' || trimmed === null || trimmed === undefined
  }
  return true
})

const handleTabChange = (index) => {
  activeTab.value = index
  // Fetch data when switching tabs
  if (index === 0 && props.plannedDate) {
    emit('fetch-route-drafts')
  } else if (index === 1 && props.plannedDate) {
    emit('fetch-routes')
  }
}

const handleNewRoute = () => {
  if (!isButtonDisabled.value) {
    emit('create-route')
  }
}
</script>

<template>
  <div class="routes-tabs">
    <!-- Tabs Header -->
    <div class="tabs-header">
      <div class="tabs-nav">
        <button
            :class="['tab-button', { active: activeTab === 0 }]"
            @click="handleTabChange(0)"
        >
          {{ t('routes.tabs.drafts') || 'Route Drafts' }}
        </button>
        <button
            :class="['tab-button', { active: activeTab === 1 }]"
            @click="handleTabChange(1)"
        >
          {{ t('routes.tabs.published') || 'Published Routes' }}
        </button>
      </div>
      <pv-button
          v-if="activeTab === 0"
          label="New Route"
          icon="pi pi-plus-circle"
          class="font-medium"
          :disabled="isButtonDisabled"
          @click="handleNewRoute"
      />
    </div>

    <!-- Tab Content -->
    <div class="tabs-content">
      <!-- Route Drafts Tab -->
      <div v-if="activeTab === 0" class="tab-panel">
        <div class="panel-header">
          <div>
            <div class="text-900 text-2xl font-semibold mb-1">
              {{ t('routes.list.title') || 'List of Routes' }}
            </div>
            <div class="text-600 text-sm">
              {{ t('routes.list.total', { count: routeDrafts.length }) || `Total: ${routeDrafts.length}` }}
            </div>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
          <p class="text-600">{{ t('common.loading') || 'Loading...' }}</p>
        </div>

        <div v-else-if="routeDrafts.length" class="list">
          <RouteDraftCard
              v-for="draft in routeDrafts"
              :key="draft.id"
              :routeDraft="draft"
          />
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-file-edit text-400 text-4xl mb-3"></i>
          <p class="text-600 text-base">{{ t('routes.list.emptyDrafts') || 'No route drafts available' }}</p>
        </div>
      </div>

      <!-- Routes Tab -->
      <div v-if="activeTab === 1" class="tab-panel">
        <div class="panel-header">
          <div>
            <div class="text-900 text-2xl font-semibold mb-1">
              {{ t('routes.list.published') || 'Published Routes' }}
            </div>
            <div class="text-600 text-sm">
              {{ t('routes.list.total', { count: routes.length }) || `Total: ${routes.length}` }}
            </div>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
          <p class="text-600">{{ t('common.loading') || 'Loading...' }}</p>
        </div>

        <div v-else-if="routes.length" class="list">
          <RouteCard
              v-for="route in routes"
              :key="route.id"
              :route="route"
          />
        </div>

        <div v-else class="empty-state">
          <i class="pi pi-road text-400 text-4xl mb-3"></i>
          <p class="text-600 text-base">{{ t('routes.list.empty') || 'No routes available' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.routes-tabs {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.tabs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.tabs-nav {
  display: flex;
  gap: 0.5rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  margin-bottom: -1rem;
}

.tab-button:hover {
  color: #043873;
}

.tab-button.active {
  color: #043873;
  border-bottom-color: #043873;
}

.tabs-content {
  flex: 1;
}

.tab-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  margin-bottom: 1rem;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 1rem;
}

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

