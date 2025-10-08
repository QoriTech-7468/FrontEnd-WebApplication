<script setup>
const props = defineProps({
  modelValue: String
})
const emits = defineEmits(['update:modelValue', 'create-route'])
</script>

<template>
  <div class="top-actions">
    <div class="date-input">
      <label>Planned date</label>
      <input
          type="date"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>

    <button class="new-route-btn" @click="$emit('create-route')">
      + New route
    </button>
  </div>
</template>

<style scoped>
.top-actions {
  display: flex;
  justify-content: space-between;
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
