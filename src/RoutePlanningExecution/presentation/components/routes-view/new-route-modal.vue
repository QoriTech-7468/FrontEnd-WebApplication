<script setup>
import { ref } from 'vue'

const emits = defineEmits(['close', 'create'])
const color = ref('#0000ff')
const vehicle = ref('')

const createRoute = () => {
  emits('create', { color: color.value, vehicle: vehicle.value })
  emits('close')
}
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>Create New Route</h3>

      <label>Route color</label>
      <input type="color" v-model="color" />

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
  background: rgba(0,0,0,0.4);
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
