<script setup>
import { ref } from 'vue'
import InteractiveMap from "../components/routes-edit/locations/interactive-map.vue"
import LocationDetails from "../components/routes-edit/locations/location-details.vue"
import TeamCard from "../components/routes-edit/teams/team-card.vue"

const routeStats = ref({
  completed: 0,
  total: 12,
  effectiveness: 0
})

const selectedLocation = ref(null)

const handleLocationSelect = (location) => {
  selectedLocation.value = location
}

// Datos mock
const team = ref({
  licensePlate: 'ABC-123',
  members: [
    'Jhon Doe Carrera Nuñez',
    'José Huaman Perez',
    'Eduardo Swart Smith'
  ],
  status: 'Active'
})

const location = ref({
  client: 'ACME Corp',
  type: 'Viajero',
  address: 'Av. Industrial 123, Lima',
  latitude: '-12.0464',
  longitude: '-77.0428',
  status: 'Active'
})
</script>

<template>
  <div class="route-monitor">
    <!-- Estadísticas superiores -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <strong>{{ routeStats.completed }}/{{ routeStats.total }}</strong>
          <p>Completed routes</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <strong>{{ routeStats.effectiveness }}%</strong>
          <p>Effective deliveries</p>
        </div>
      </div>
    </div>

    <!-- Layout principal -->
    <div class="content-grid">
      <div class="map-section">
<!--        <InteractiveMap @select-location="handleLocationSelect" />-->
      </div>

      <div class="side-section">
        <div class="details-section">
<!--          <LocationDetails v-if="selectedLocation" :location="selectedLocation" />-->
<!--          <LocationDetails v-else :location="location" />-->
        </div>
        <div class="team-section">
<!--          <TeamCard :team="team" />-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.route-monitor {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 10rem 6rem 0 6rem;
}

/* === Estadísticas superiores === */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  background-color: #fff;
}

.stat-icon {
  font-size: 1.8rem;
}

.stat-info strong {
  font-size: 1.3rem;
  display: block;
  color: #000;
}

.stat-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

/* === Grid principal === */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  align-items: stretch;
}

/* Mapa */
.map-section {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Panel lateral */
.side-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  height: 600px;
}

/* Alturas proporcionales */
.details-section {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  flex: 1;
}

.team-section {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  flex: 1;
}

/* Responsivo */
@media (max-width: 900px) {
  .route-monitor {
    margin: 2rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .side-section {
    height: auto;
  }
}
</style>
