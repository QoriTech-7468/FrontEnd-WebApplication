<script setup>
import { ref } from 'vue'
import LocationsTab from "../components/routes-edit/locations/locations-tab.vue";
import TeamsTab from "../components/routes-edit/teams/teams-tab.vue";

// Estado actual
const activeTabIndex = ref(0)

// Estado de ruta (simulado)
const route = ref({
  id: '',
  status: '',
  locations: []
})

// Estado del toast
const toast = ref({
  visible: false,
  message: '',
  type: '' // success | error | info
})

// Mostrar toast temporal (no bloqueante)
const showToast = (message, type = 'info') => {
  toast.value = { visible: true, message, type }
  setTimeout(() => (toast.value.visible = false), 1000)
}

// Acciones
const deleteDraft = () => {
  if (confirm('Are you sure you want to delete this draft?')) {
    showToast('Draft deleted. Returning to routes list...', 'info')
    setTimeout(() => window.location.href = '/management/routes/list', 1000)
  }
}

const saveDraft = () => {
  showToast('Draft saved successfully!', 'success')
  setTimeout(() => window.location.href = '/management/routes/list', 1000)
}

const publishDraft = () => {
  route.value.status = 'Published'
  showToast('Route published successfully!', 'success')
  setTimeout(() => window.location.href = '/management/routes/list', 1000)
}
</script>

<template>
  <div class="route-edit">
    <!-- Header -->
    <div class="flex align-items-center justify-content-between mb-4">
      <div>
        <div class="text-900 text-3xl font-semibold mb-1">Edit Route</div>
        <div class="text-600 mb-3">Configure locations and team for your route</div>
        
        <!-- Tab Buttons -->
        <div class="flex gap-2">
          <pv-button 
            :label="'Locations'" 
            :icon="'pi pi-map-marker'"
            :class="{ 'p-button-outlined': activeTabIndex !== 0 }"
            @click="activeTabIndex = 0" 
          />
          <pv-button 
            :label="'Team'" 
            :icon="'pi pi-users'"
            :class="{ 'p-button-outlined': activeTabIndex !== 1 }"
            @click="activeTabIndex = 1" 
          />
        </div>
      </div>
      
      <div class="flex gap-2">
        <pv-button label="Delete Draft" severity="danger" outlined @click="deleteDraft" />
        <pv-button label="Save Draft" severity="secondary" outlined @click="saveDraft" />
        <pv-button label="Publish" @click="publishDraft" />
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <LocationsTab v-if="activeTabIndex === 0" :route="route" />
      <TeamsTab v-else :route="route" />
    </div>
  </div>
</template>

<style scoped>
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

/* ===== TABS STYLES ===== */
:deep(.p-tabs) {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.p-tabview-nav) {
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-tabview-nav-link) {
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.p-tabview-nav-link:hover) {
  color: #043873;
  background: #f8fafc;
}

:deep(.p-tabview-nav-link.p-highlight) {
  color: #043873;
  background: white;
  border-bottom: 2px solid #043873;
}

:deep(.p-tabview-panels) {
  padding: 1.5rem;
}


/* --- Toast styling --- */
.toast {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  min-width: 240px;
  text-align: center;
}

.toast.info {
  background-color: #007bff;
}

.toast.success {
  background-color: #28a745;
}

.toast.error {
  background-color: #dc3545;
}

/* --- Animación toast --- */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
