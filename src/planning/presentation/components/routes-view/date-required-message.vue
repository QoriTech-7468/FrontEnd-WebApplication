<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="date-required-message">
    <div class="message-content">
      <i class="pi pi-calendar text-400 text-6xl mb-4"></i>
      <h3 class="text-900 text-2xl font-semibold mb-2">
        {{ t('routes.dateRequired.title') || 'Select a Date' }}
      </h3>
      <p class="text-600 text-base">
        {{ t('routes.dateRequired.message') || 'Please select a planned date above to view and manage route drafts and published routes.' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.date-required-message {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.message-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 500px;
}

.message-content i {
  opacity: 0.5;
}
</style>

