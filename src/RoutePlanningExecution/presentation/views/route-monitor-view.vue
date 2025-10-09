<script setup>
import { ref } from 'vue'
import InteractiveMap from "../components/routes-edit/locations/interactive-map.vue"
import LocationDetails from "../components/routes-edit/locations/location-details.vue"
import TeamCard from "../components/routes-edit/teams/team-card.vue"

const routeStats = ref({
  completed: 8,
  total: 12,
  effectiveness: 87
})

const selectedLocation = ref(null)

// Mock data for monitoring
const allLocations = ref([
  {
    id: 'P-001',
    address: 'Av. Industrial 123, Lima',
    client: 'ACME Corp',
    latitude: -12.0464,
    longitude: -77.0428,
    status: 'Active'
  },
  {
    id: 'P-002',
    address: 'Jr. Los Olivos 456, Lima',
    client: 'ACME Corp',
    latitude: -12.055,
    longitude: -77.05,
    status: 'Active'
  },
  {
    id: 'P-003',
    address: 'Av. Pachacutec 789, Callao',
    client: 'Distribuidora Lima',
    latitude: -12.07,
    longitude: -77.1,
    status: 'Active'
  }
])

const team = ref({
  id: 'XYZ-123',
  members: [
    'Jhon Doe Carrera Nuñez',
    'José Huaman Perez',
    'Eduardo Swart Smith'
  ],
  available: true
})

const location = ref({
  id: 'P-001',
  client: 'ACME Corp',
  address: 'Av. Industrial 123, Lima',
  latitude: -12.0464,
  longitude: -77.0428,
  status: 'Active'
})

const handleLocationSelect = (location) => {
  selectedLocation.value = location
}
</script>

<template>
  <div class="route-monitor">
    <!-- Header -->
    <div class="header">
      <h1 class="title">Route Monitor</h1>
      <p class="subtitle">Monitor active routes and delivery progress</p>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-check-circle text-2xl"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ routeStats.completed }}/{{ routeStats.total }}</div>
          <div class="stat-label">Completed Routes</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-chart-line text-2xl"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ routeStats.effectiveness }}%</div>
          <div class="stat-label">Effectiveness Rate</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-clock text-2xl"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ routeStats.total - routeStats.completed }}</div>
          <div class="stat-label">Pending Routes</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-grid">
      <div class="map-section">
        <InteractiveMap 
          :locations="allLocations"
          :selectedLocation="selectedLocation"
          @select="handleLocationSelect" 
        />
      </div>

      <div class="side-section">
        <div class="details-section">
          <LocationDetails 
            :location="selectedLocation || location"
            :isSelected="true"
            :isReadOnly="true"
          />
        </div>
        <div class="team-section">
          <TeamCard 
            :team="team"
            :isSelected="true"
            :isAvailable="team.available"
            :isReadOnly="true"
          />
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
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.header {
  margin-bottom: 1rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.subtitle {
  font-size: 1rem;
  font-weight: 400;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #f8fafc;
  border-radius: 10px;
  color: #043873;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.4;
}

/* Main Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

/* Map Section */
.map-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 600px;
  overflow: hidden;
}

/* Side Section */
.side-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.details-section,
.team-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .map-section {
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .route-monitor {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .title {
    font-size: 1.75rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .route-monitor {
    padding: 0.75rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .subtitle {
    font-size: 0.875rem;
  }
}
</style>
