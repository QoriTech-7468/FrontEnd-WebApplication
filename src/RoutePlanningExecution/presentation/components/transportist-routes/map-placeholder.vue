<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="map-placeholder">
    <div class="map-content">
      <i class="pi pi-map-marker map-icon"></i>
      <h3 class="map-title">{{ t('transportist.map.title') }}</h3>
      <p class="map-subtitle">{{ t('transportist.map.subtitle') }}</p>
    </div>
  </div>
</template>

<style scoped>
.map-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cbd5e0;
}

.map-content {
  text-align: center;
  padding: 3rem;
}

.map-icon {
  font-size: 4rem;
  color: #043873;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.map-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.map-subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0;
}
</style>