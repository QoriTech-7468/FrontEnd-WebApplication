<script setup>
const props = defineProps({ location: Object, isSelected: Boolean })
const emits = defineEmits(['select', 'unselect'])
</script>

<template>
  <div class="details">
    <h4 class="title">Location Details</h4>

    <div v-if="location" class="info">
      <div class="info-grid">
        <div class="info-item">
          <span class="label">ID:</span>
          <span class="value">{{ location.id }}</span>
        </div>
        <div class="info-item">
          <span class="label">Address:</span>
          <span class="value">{{ location.address }}</span>
        </div>
        <div class="info-item">
          <span class="label">Client:</span>
          <span class="value">{{ location.client }}</span>
        </div>
        <div class="info-item">
          <span class="label">Latitude:</span>
          <span class="value">{{ location.latitude }}</span>
        </div>
        <div class="info-item">
          <span class="label">Longitude:</span>
          <span class="value">{{ location.longitude }}</span>
        </div>
      </div>

      <div class="actions">
        <pv-button
            v-if="!isSelected"
            label="Select Location"
            icon="pi pi-plus"
            @click="$emit('select', location)"
            class="w-full"
        />
        <pv-button
            v-else
            label="Remove Location"
            icon="pi pi-minus"
            severity="danger"
            outlined
            @click="$emit('unselect', location)"
            class="w-full"
        />
      </div>
    </div>

    <div v-else class="empty">
      <i class="pi pi-map-marker text-4xl text-400 mb-3"></i>
      <p>Select a location to view details</p>
    </div>
  </div>
</template>

<style scoped>
.details {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 250px;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  word-break: break-word;
}

.actions {
  margin-top: 1rem;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  color: #9ca3af;
  min-height: 200px;
}

.empty p {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
