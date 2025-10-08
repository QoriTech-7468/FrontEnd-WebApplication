<script setup>
import { ref } from 'vue'
import LocationsTab from "../components/routes-edit/locations/locations-tab.vue";
import TeamsTab from "../components/routes-edit/teams/teams-tab.vue";

// Estado actual
const activeTab = ref('locations')

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
    setTimeout(() => window.location.href = '/routes/list', 1000)
  }
}

const saveDraft = () => {
  showToast('Draft saved successfully!', 'success')
  setTimeout(() => window.location.href = '/routes/list', 1000)
}

const publishDraft = () => {
  route.value.status = 'Published'
  showToast('Route published successfully!', 'success')
  setTimeout(() => window.location.href = '/routes/list', 1000)
}
</script>

<template>
  <section class="route-edit">
    <div class="header">
      <div class="left">
        <h2>{{ activeTab === 'locations' ? 'Locations' : 'Team' }}</h2>
        <p>Select your {{ activeTab }}</p>

        <div class="tabs">
          <button
              :class="{ active: activeTab === 'locations' }"
              @click="activeTab = 'locations'"
          >
            Locations
          </button>
          <button
              :class="{ active: activeTab === 'team' }"
              @click="activeTab = 'team'"
          >
            Team
          </button>
        </div>
      </div>

      <div class="right">
        <button class="delete" @click="deleteDraft">Delete Draft</button>
        <button class="save" @click="saveDraft">Save Draft</button>
        <button class="publish" @click="publishDraft">Publish</button>
      </div>
    </div>

    <!-- Contenido dinámico -->
    <div v-if="activeTab === 'locations'">
      <LocationsTab :route="route" />
    </div>
    <div v-else>
      <TeamsTab :route="route" />
    </div>

    <!-- Toast flotante -->
    <transition name="toast-fade">
      <div v-if="toast.visible" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </transition>
  </section>
</template>

<style scoped>
.route-edit {
  padding: 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tabs button {
  background: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.tabs button.active {
  background: #003087;
  color: white;
}

.right {
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
}

button.delete {
  background: #ffe5e5;
  color: #d33;
}

button.save {
  background: #eaffea;
  color: #27ae60;
}

button.publish {
  background: #fff6a0;
  color: #000;
}

button {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
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
