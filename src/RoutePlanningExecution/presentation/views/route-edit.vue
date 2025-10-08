<script setup>
import { ref } from 'vue'
import LocationsTab from "../components/routes-edit/locations/locations-tab.vue";
import TeamsTab from "../components/routes-edit/teams/teams-tab.vue";


// Estado actual
const activeTab = ref('locations')

//ESTATICO esto cambia en base a la ruta elegida a editar
const route = ref({
  id: '',
  status: '',
  locations: []
})

// Acciones de los botones
const deleteDraft = () => {
  if (confirm('Are you sure you want to delete this draft?')) {
    // Aquí iría la lógica de borrado real
    alert('Draft deleted. Returning to routes list...')
    window.location.href = '/routes/list' // simula redirección
  }
}

const saveDraft = () => {
  alert('Draft saved successfully!')
  window.location.href = '/routes/list'
}

const publishDraft = () => {
  route.value.status = 'Published'
  alert('Route published successfully!')
  window.location.href = '/routes/list'
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
</style>
