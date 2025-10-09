<script setup>
// @TODO USAR UN COMPONENTE REUTILIZADO DE MAPA INTERACTIVO
defineProps({
  team: Object,
  isSelected: Boolean,
  isAvailable: Boolean,
  isReadOnly: Boolean
})
const emits = defineEmits(['select', 'unselect'])
</script>

<template>
  <div class="team-card" :class="{ 'selected': isSelected, 'unavailable': !isAvailable }">
    <div class="team-header">
      <div class="team-id">
        <i class="pi pi-truck text-xl"></i>
        <span class="team-code">{{ team.id }}</span>
      </div>
      <div class="status-badge" :class="{ 'available': isAvailable, 'unavailable': !isAvailable }">
        <i class="pi" :class="isAvailable ? 'pi-check-circle' : 'pi-times-circle'"></i>
        <span>{{ isAvailable ? 'Available' : 'Unavailable' }}</span>
      </div>
    </div>

    <div class="team-members">
      <h4 class="members-title">Team Members</h4>
      <div class="members-list">
        <div v-for="member in team.members" :key="member" class="member-item">
          <i class="pi pi-user text-sm"></i>
          <span>{{ member }}</span>
        </div>
      </div>
    </div>

    <div v-if="!isReadOnly" class="team-action">
      <pv-button
          v-if="!isAvailable"
          label="Not Available"
          icon="pi pi-times"
          severity="secondary"
          outlined
          disabled
          class="w-full"
      />
      <pv-button
          v-else-if="isSelected"
          label="Selected"
          icon="pi pi-check"
          severity="success"
          outlined
          @click="$emit('unselect', team)"
          class="w-full"
      />
      <pv-button
          v-else
          label="Select Team"
          icon="pi pi-plus"
          @click="$emit('select', team)"
          class="w-full"
      />
    </div>
  </div>
</template>

<style scoped>
.team-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 280px;
}


.team-card.selected {
  border-color: #043873;
  box-shadow: 0 0 0 2px rgba(4, 56, 115, 0.1);
}

.team-card.unavailable {
  opacity: 0.6;
  background: #f8fafc;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.team-id {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.team-code {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.available {
  background: #dcfce7;
  color: #166534;
}

.status-badge.unavailable {
  background: #fee2e2;
  color: #991b1b;
}

.team-members {
  flex: 1;
}

.members-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.member-item span {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.team-action {
  margin-top: auto;
}
</style>
