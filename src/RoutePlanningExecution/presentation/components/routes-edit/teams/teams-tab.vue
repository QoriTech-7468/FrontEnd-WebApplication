<script setup>
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia' 
import TeamCard from './team-card.vue'

import useFleetStore from '../../../../../FleetAndResourceManagement/application/fleet-resource-management.store.js'

const { t } = useI18n()

const props = defineProps({
  route: {
    type: Object,
    required: true
  }
})

const fleetStore = useFleetStore()
const { vehicles, users, vehiclesLoaded, usersLoaded } = storeToRefs(fleetStore)

//  cargamos AMBOS, vehículos Y usuarios
onMounted(() => {
  if (!vehiclesLoaded.value) {
    fleetStore.fetchVehicles()
  }
  if (!usersLoaded.value) {
    fleetStore.fetchUsers() 
  }
})

// Creamos 'teams' uniendo los vehículos con sus respectivos usuarios
const teams = computed(() => {
  return vehicles.value.map(vehicle => {
    // Para cada vehículo, filtramos la lista de usuarios
    const vehicleMembers = users.value.filter(user => user.vehicleId === vehicle.id)

    // Devolvemos el objeto del vehículo con sus miembros ya asignados
    return {
      ...vehicle,
      members: vehicleMembers
    }
  })
})


const selectedTeamId = computed(() => props.route.vehicleId)

const handleSelect = (team) => {
  props.route.vehicleId = team.id
}

const handleUnselect = () => {
  props.route.vehicleId = null
}
</script>

<template>
  <div class="teams-tab">
    <div class="header">
      <h2 class="title">{{ t('teams.title') }}</h2>
    </div>

    <div class="teams-grid">
      <TeamCard
          v-for="team in teams"
          :key="team.id"
          :team="team"

          :isSelected="selectedTeamId && selectedTeamId === team.id"

          :isAvailable="team.status?.toLowerCase() === 'enabled'"

          @select="handleSelect"
          @unselect="handleUnselect"
      />
    </div>
  </div>
</template>

<style scoped>
.teams-tab {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.title {
  font-size: 1.25rem;
  font-weight:500;
  color: #111827;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .teams-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>
