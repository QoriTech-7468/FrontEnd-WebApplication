<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['close', 'confirm'])
const { t } = useI18n()

const selectedReason = ref('')
const details = ref('')

const reasons = [
  { value: 'absent_customer', label: 'transportist.rejectModal.reasons.absentCustomer' },
  { value: 'wrong_address', label: 'transportist.rejectModal.reasons.wrongAddress' },
  { value: 'customer_refused', label: 'transportist.rejectModal.reasons.customerRefused' },
  { value: 'other', label: 'transportist.rejectModal.reasons.other' }
]

const handleConfirm = () => {
  if (!selectedReason.value) {
    return
  }
  emit('confirm', {
    reason: selectedReason.value,
    note: details.value
  })
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title">{{ t('transportist.rejectModal.title') }}</h2>
      <p class="modal-subtitle">{{ t('transportist.rejectModal.subtitle') }}</p>

      <div class="reasons-group">
        <div
            v-for="reason in reasons"
            :key="reason.value"
            class="reason-option"
        >
          <pv-radio-button
              v-model="selectedReason"
              :input-id="reason.value"
              :value="reason.value"
          />
          <label :for="reason.value" class="reason-label">
            {{ t(reason.label) }}
          </label>
        </div>
      </div>

      <div class="details-group">
        <label for="details" class="details-label">
          {{ t('transportist.rejectModal.detailsLabel') }}
        </label>
        <pv-textarea
            id="details"
            v-model="details"
            :placeholder="t('transportist.rejectModal.detailsPlaceholder')"
            rows="4"
            class="details-input"
        />
      </div>

      <pv-button
          :label="t('transportist.rejectModal.confirm')"
          class="confirm-button"
          @click="handleConfirm"
          :disabled="!selectedReason"
      />
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.modal-subtitle {
  font-size: 0.95rem;
  color: #718096;
  margin: 0 0 1.5rem 0;
}

.reasons-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.reason-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.reason-label {
  font-size: 0.95rem;
  color: #2d3748;
  cursor: pointer;
}

.details-group {
  margin-bottom: 1.5rem;
}

.details-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.details-input {
  width: 100%;
}

.confirm-button {
  width: 100%;
  background: #FFC700 !important;
  border: none !important;
  color: #1a202c !important;
  font-weight: 700 !important;
  padding: 0.875rem !important;
  font-size: 1rem !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.confirm-button:hover:not(:disabled) {
  background: #f0b900 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 199, 0, 0.4) !important;
}

.confirm-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

:deep(.p-radiobutton) {
  width: 20px;
  height: 20px;
}

:deep(.p-textarea) {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.95rem;
}

:deep(.p-textarea:focus) {
  border-color: #043873;
  box-shadow: 0 0 0 3px rgba(4, 56, 115, 0.1);
}
</style>