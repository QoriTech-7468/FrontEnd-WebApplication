<script setup>
defineProps({
  team: Object,
  isSelected: Boolean,
  isAvailable: Boolean
})
const emits = defineEmits(['select', 'unselect'])
</script>

<template>
  <div class="team-card">
    <div class="team-id">
      <span class="icon">🚚</span>
      <strong>{{ team.id }}</strong>
    </div>

    <div class="team-members">
      <strong>Team members</strong>
      <ul>
        <li v-for="member in team.members" :key="member">{{ member }}</li>
      </ul>
    </div>

    <div class="team-action">
      <button
          v-if="!isAvailable"
          class="not-available"
          disabled
      >
        {{ $t('teams.notAvailable') }}
      </button>

      <button
          v-else-if="isSelected"
          class="unselect"
          @click="$emit('unselect', team)"
      >
        {{ $t('teams.unselect') }}
      </button>

      <button
          v-else
          class="select"
          @click="$emit('select', team)"
      >
        {{ $t('teams.select') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.team-card {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  align-items: center;
  gap: 1rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  background-color: #fff;
}

.team-id {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  gap: 0.5rem;
}

.team-members ul {
  margin: 0.3rem 0 0;
  padding-left: 1.2rem;
  color: #333;
}

button {
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

button.select {
  background-color: #22c55e;
  color: #fff;
}

button.unselect {
  background-color: #fca5a5;
  color: #fff;
}

button.not-available {
  background-color: #ccc;
  color: #555;
  cursor: not-allowed;
}
</style>
