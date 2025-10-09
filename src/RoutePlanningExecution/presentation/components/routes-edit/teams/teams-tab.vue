<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TeamCard from './team-card.vue'

const { t } = useI18n()

const teams = ref([
  {
    id: 'XYZ-123',
    members: ['Juan Perez', 'Juan Vargas', 'Pedro Pablo'],
    available: true
  },
  {
    id: 'XYZ-456',
    members: ['Maria Lopez', 'Carlos Díaz', 'Luis Ramos'],
    available: true
  },
  {
    id: 'XYZ-789',
    members: ['Miguel Torres', 'Rosa Perez', 'Ana Gómez'],
    available: false
  },
  {
    id: 'XYZ-999',
    members: ['Jorge Silva', 'Ana Ruiz', 'Marcos León'],
    available: true
  }
])

const selectedTeam = ref(null)

const handleSelect = (team) => {
  selectedTeam.value = team
}

const handleUnselect = () => {
  selectedTeam.value = null
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
          :isSelected="selectedTeam && selectedTeam.id === team.id"
          :isAvailable="team.available"
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
