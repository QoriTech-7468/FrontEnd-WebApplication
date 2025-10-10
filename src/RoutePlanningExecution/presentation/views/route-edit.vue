<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoutePlanningStore } from '../../application/routeplanning.store.js'
import { useToast } from 'primevue/usetoast'
import LocationsTab from "../components/routes-edit/locations/locations-tab.vue"
import TeamsTab from "../components/routes-edit/teams/teams-tab.vue"

const store = useRoutePlanningStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

// estado local
const currentRoute = ref(null)
const activeTabIndex = ref(0)
const loading = ref(true)
const saving = ref(false)

// helpers
const isDraft = computed(() => !!currentRoute.value && String(currentRoute.value.state).toLowerCase() === 'draft')
const isPublished = computed(() => !!currentRoute.value && String(currentRoute.value.state).toLowerCase() === 'published')

// intenta cargar la ruta por id
async function loadRoute() {
  loading.value = true
  try {
    if (!store.routes || store.routes.length === 0) {
      await store.fetchAllRoutes()
    }

    const rid = route.params.routeId
    currentRoute.value = store.routes.find(r => String(r.id) === String(rid))

    if (!currentRoute.value) {
      toast.add({ severity: 'warn', summary: 'Not found', detail: 'Route not found', life: 2500 })
      await router.push('/management/routes/list')
    }
  } catch (err) {
    console.error('loadRoute error', err)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not load route', life: 2500 })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRoute()
})

// guardar borrador
// guardar borrador
const saveDraft = async () => {
  if (!currentRoute.value) return
  saving.value = true
  try {
    await store.saveDraftRoute(currentRoute.value)
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Draft saved successfully!', life: 2500 })

    // 👇 Redirección agregada para volver a la lista
    await router.push('/management/routes/list')
  } catch (err) {
    console.error('saveDraft error', err)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not save draft', life: 2500 })
  } finally {
    saving.value = false
  }
}

// publicar
const publishDraft = async () => {
  if (!currentRoute.value || !isDraft.value) return
  saving.value = true
  try {
    await store.publishRoute(currentRoute.value.id)
    toast.add({ severity: 'success', summary: 'Published', detail: 'Route published successfully!', life: 2500 })
    await router.push('/management/routes/list')
  } catch (err) {
    console.error('publishDraft error', err)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not publish route', life: 2500 })
  } finally {
    saving.value = false
  }
}

// eliminar borrador
const deleteDraft = async () => {
  if (!currentRoute.value || !isDraft.value) return
  if (!confirm('Are you sure you want to delete this draft route?')) return
  saving.value = true
  try {
    await store.deleteDraftRoute(currentRoute.value.id)
    toast.add({ severity: 'success', summary: 'Deleted', detail: 'Draft route deleted.', life: 2500 })
    await router.push('/management/routes/list')
  } catch (err) {
    console.error('deleteDraft error', err)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not delete draft route.', life: 2500 })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="route-edit">
    <div v-if="loading" class="p-4 text-center text-gray-500">Loading route...</div>

    <div v-else-if="currentRoute">
      <div class="flex align-items-center justify-content-between mb-4">
        <div>
          <div class="text-900 text-3xl font-semibold mb-1">Edit Route #{{ currentRoute.id }}</div>
          <div class="text-600 mb-3">Vehicle: {{ currentRoute.vehicleId ?? 'Unassigned' }}</div>

          <div class="flex gap-2">
            <pv-button
                v-if="isDraft"
                label="Save Draft"
                icon="pi pi-save"
                :loading="saving"
                :disabled="saving"
                class="p-button-outlined"
                @click="saveDraft"
            />
            <pv-button
                v-if="isDraft"
                label="Publish"
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
              label="Delete Draft"
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
              @click="activeTabIndex = 0"
          >Locations</pv-button>

          <pv-button
              class="p-button-text"
              :class="{ 'p-button-outlined': activeTabIndex !== 1 }"
              @click="activeTabIndex = 1"
          >Team</pv-button>
        </div>

        <div>
          <LocationsTab v-if="activeTabIndex === 0" :route="currentRoute" />
          <TeamsTab v-else :route="currentRoute" />
        </div>
      </div>
    </div>

    <div v-else class="p-4 text-center text-gray-500">
      Route not found
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
</style>
