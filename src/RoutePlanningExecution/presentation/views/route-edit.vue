<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoutePlanningStore } from '../../application/routeplanning.store.js'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import LocationsTab from "../components/routes-edit/locations/locations-tab.vue"
import TeamsTab from "../components/routes-edit/teams/teams-tab.vue"

const { t } = useI18n()
const store = useRoutePlanningStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

// Estado local
const currentRoute = ref(null)
const activeTabIndex = ref(0)
const loading = ref(true)
const saving = ref(false)

const isDraft = computed(() => !!currentRoute.value && String(currentRoute.value.state).toLowerCase() === 'draft')
const isPublished = computed(() => !!currentRoute.value && String(currentRoute.value.state).toLowerCase() === 'published')

// Carga de ruta por ID
async function loadRoute() {
  loading.value = true
  try {
    const rid = route.params.routeId
    currentRoute.value = await store.getRouteById(rid)
    
    if (currentRoute.value && !Array.isArray(currentRoute.value.locations)) {
      currentRoute.value.locations = []
    }
    if (!currentRoute.value) {
      toast.add({
        severity: 'warn',
        summary: t('routes.errors.notFound'),
        detail: t('routes.errors.notFoundDetail'),
        life: 2500
      })
      await router.push('/management/routes/list')
    }
  } catch (err) {
    console.error('loadRoute error', err)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('routes.errors.loadError'),
      life: 2500
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRoute()
})

const publishDraft = async () => {
  if (!currentRoute.value || !isDraft.value) return
  saving.value = true
  try {
    await store.saveDraftRoute(currentRoute.value);
    
    await store.publishRoute(currentRoute.value.id);

    toast.add({
      severity: 'success',
      summary: t('routes.notifications.published'),
      detail: t('routes.notifications.publishSuccess'),
      life: 2500
    })
    await router.push('/management/routes/list') 
  } catch (err) {
    // ...
  } finally {
    saving.value = false
  }
}

const deleteDraft = async () => {
  if (!currentRoute.value || !isDraft.value) return
  if (!confirm(t('routes.confirmDelete'))) return
  saving.value = true
  try {
    await store.deleteDraftRoute(currentRoute.value.id)
    toast.add({
      severity: 'success',
      summary: t('routes.notifications.deleted'),
      detail: t('routes.notifications.deleteSuccess'),
      life: 2500
    })
    await router.push('/management/routes/list')
  } catch (err) {
    console.error('deleteDraft error', err)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('routes.errors.deleteError'),
      life: 2500
    })
  } finally {
    saving.value = false
  }
}

const saveDraft = async () => {
  if (!currentRoute.value) return
  saving.value = true
  try {
    await store.saveDraftRoute(currentRoute.value)
    toast.add({
      severity: 'success',
      summary: t('routes.notifications.saved'),
      detail: t('routes.notifications.draftSaved'),
      life: 2500
    })
    await router.push('/management/routes/list') 
  } catch (err) {
    // ...
  } finally {
    saving.value = false
  }
}
</script>


<template>
  <div class="route-edit">
    <div v-if="loading" class="p-4 text-center text-gray-500">
      {{ t('routes.loading') }}
    </div>

    <div v-else-if="currentRoute">
      <!-- Encabezado -->
      <div class="flex align-items-center justify-content-between mb-4">
        <div>
          <div class="text-900 text-3xl font-semibold mb-1">
            {{ t('routes.editTitle') }} #{{ currentRoute.id }}
          </div>
          <div class="text-600 mb-3">
            {{ t('routes.vehicleLabel') }}: {{ currentRoute.vehicleId ?? t('routes.unassigned') }}
          </div>

          <div class="flex gap-2">
            <pv-button
                v-if="isDraft"
                :label="t('routes.buttons.saveDraft')"
                icon="pi pi-save"
                :loading="saving"
                :disabled="saving"
                class="p-button-outlined"
                @click="saveDraft"
            />
            <pv-button
                v-if="isDraft"
                :label="t('routes.buttons.publish')"
                icon="pi pi-upload"
                :loading="saving"
                :disabled="saving"
                class="p-button-success"
                @click="publishDraft"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <pv-button
              v-if="isDraft"
              :label="t('routes.buttons.deleteDraft')"
              severity="danger"
              outlined
              :disabled="saving"
              @click="deleteDraft"
          />
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-content">
        <div class="tabs flex gap-2 mb-4">
          <pv-button
              class="p-button-text"
              :class="{ 'p-button-outlined': activeTabIndex !== 0 }"
              icon="pi pi-map-marker"
              @click="activeTabIndex = 0"
          >
            {{ t('routes.tabs.locationsTab') }}
          </pv-button>

          <pv-button
              class="p-button-text"
              :class="{ 'p-button-outlined': activeTabIndex !== 1 }"
              icon="pi pi-users"
              @click="activeTabIndex = 1"
          >
            {{ t('routes.tabs.teamTab') }}
          </pv-button>
        </div>

        <div>
          <LocationsTab v-if="activeTabIndex === 0" :route="currentRoute" />
          <TeamsTab v-else :route="currentRoute" />
        </div>
      </div>
    </div>

    <div v-else class="p-4 text-center text-gray-500">
      {{ t('routes.notFound') }}
    </div>
  </div>
</template>

<style scoped>
.route-edit {
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
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

/* ===== TAB BUTTONS ===== */
.tabs :deep(.p-button-text) {
  border-radius: 8px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease-in-out;
  width: auto;
}

.tabs :deep(.p-button-text:hover) {
  background: #f8fafc !important;
  color: #043873 !important;
}
</style>
