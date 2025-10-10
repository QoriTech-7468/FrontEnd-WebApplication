<script setup>
import { ref, onMounted } from 'vue'
import { FleetResourceManagementApi } from "../../../../FleetAndResourceManagement/infrastructure/fleet-resource-management-api.js"
import { VehicleAssembler } from "../../../../FleetAndResourceManagement/infrastructure/vehicle.assembler.js"

const emits = defineEmits(['close', 'create'])
const color = ref('#0000ff')
const vehicleId = ref('')
const vehicles = ref([])

const api = new FleetResourceManagementApi()

// Cargar vehículos activos
const loadVehicles = async () => {
  try {
    const response = await api.getVehicles()
    vehicles.value = VehicleAssembler.toEntitiesFromResponse(response)
        .filter(v => v.isActive === 'Enabled')
  } catch (error) {
    console.error('Error loading vehicles:', error)
  }
}

// Crear ruta (vehículo opcional)
const createRoute = () => {
  emits('create', {
    color: color.value,
    ...(vehicleId.value && { vehicleId: Number(vehicleId.value) })
  })
  emits('close')
}

onMounted(loadVehicles)
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>Create New Route</h3>

      <label>Route color</label>
      <input type="color" v-model="color" />

      <label>Select vehicle (optional)</label>
      <select v-model="vehicleId">
        <option value="">-- No vehicle assigned --</option>
        <option v-for="v in vehicles" :key="v.id" :value="v.id">
          {{ v.plate }} (Capacity: {{ v.capacity }})
        </option>
      </select>

      <div class="actions">
        <button class="cancel" @click="$emit('close')">Cancel</button>
        <button class="create" @click="createRoute">Create</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

select {
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel {
  background: #ddd;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.create {
  background: #003087;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>
