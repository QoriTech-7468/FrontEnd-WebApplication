<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: String
})
const emits = defineEmits(['update:modelValue', 'create-route'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})
</script>

<template>
  <div class="top-actions bg-white shadow-sm">
    <div class="flex align-items-center justify-content-between gap-4 w-full flex-wrap">
      <!-- Fecha planificada -->
      <div class="date-input flex flex-column">
        <label class="text-700 mb-2 font-medium text-base">
          {{ t('routes.plannedDate') }}
        </label>

        <pv-date-picker
            v-model="modelValue"
            dateFormat="yy-mm-dd"
            showIcon
            icon="pi pi-calendar"
            class="w-full"
            placeholder="yyyy-mm-dd"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-actions {
  padding: 1rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

/* === Input === */
:deep(.p-inputtext) {
  padding: 10px 12px !important;
  border-radius: 8px !important;
  font-size: 14px !important;
}

/* === Button === */
:deep(.p-button) {
  padding: 12px 20px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(4, 56, 115, 0.15) !important;
}

:deep(.p-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(4, 56, 115, 0.25) !important;
}

:deep(.p-button:active) {
  transform: translateY(0) !important;
}
</style>
