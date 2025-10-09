<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String
})
const emits = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})
</script>

<template>
  <div class="top-actions mb-3 bg-white">
    <div class="date-input">
      <label class="text-700 mb-2 font-medium text-xl">Planned date</label>
      <pv-date-picker
          v-model="modelValue"
          @update:modelValue="$emit('update:modelValue', $event)"
          dateFormat="yy-mm-dd"
          placeholder="Choose a date"
          showIcon
          icon="pi pi-calendar"
      />
    </div>
  </div>
</template>

<style scoped>
.top-actions {
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.date-input {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}
.new-route-btn {
  background-color: #003087;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
</style>
