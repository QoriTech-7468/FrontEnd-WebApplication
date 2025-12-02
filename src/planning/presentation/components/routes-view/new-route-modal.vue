<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import useFleetStore from '../../../../fleets/application/fleets.store.js'

const { t } = useI18n()
const emits = defineEmits(['close', 'create'])
const color = ref('#003087')
const vehicleId = ref('')
const loading = ref(true)

const colorInputRef = ref(null)

const fleetStore = useFleetStore()
const { vehicles } = storeToRefs(fleetStore)

// Cargar vehículos activos
const loadVehicles = async () => {
  try {
    if (!vehicles.value || vehicles.value.length === 0) {
      await fleetStore.fetchVehicles()
    }
  } catch (error) {
    console.error('Error loading vehicles:', error)
  } finally {
    loading.value = false
  }
}

// Computed para vehículos activos
const activeVehicles = computed(() => {
  return vehicles.value.filter(v => v.state === 'Enabled' || v.isActive === 'Enabled')
})

// Crear ruta
const createRoute = () => {
  emits('create', {
    color: color.value,
    ...(vehicleId.value && { vehicleId: Number(vehicleId.value) })
  })
  emits('close')
}

// Abre el selector de color
const openColorPicker = () => {
  colorInputRef.value?.click()
}

onMounted(loadVehicles)
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>{{ t('modals.newRoute.title') }}</h3>

      <label>{{ t('modals.newRoute.color') }}</label>
      <div class="color-wrapper" @click="openColorPicker">
        <div class="color-preview" :style="{ backgroundColor: color }"></div>
        <input
            ref="colorInputRef"
            type="color"
            v-model="color"
            class="color-hidden"
        />
      </div>

      <div class="actions">
        <button class="cancel" @click="$emit('close')">{{ t('modals.newRoute.cancel') }}</button>
        <button class="create" @click="createRoute">{{ t('modals.newRoute.create') }}</button>
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
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

h3 {
  margin-top: 0;
  color: #003087;
  font-size: 1.1rem;
}

label {
  font-weight: 600;
  font-size: 0.9rem;
}

/* ✅ Cuadro compacto pero funcional */
.color-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  width: 4em;
}

.color-preview {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.color-preview:hover {
  outline: 2px solid #003087;
}

.color-hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* 🔹 Select */
select {
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}

/* 🔹 Botones */
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
  transition: background 0.2s ease;
}

.create:hover {
  background: #002060;
}
</style>
