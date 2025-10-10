<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const { t } = useI18n()

// Mapa de colores por estado (accesible y consistente con la UI general)
const colorMap = {
  draft: '#e74c3c',       // rojo suave
  published: '#f1c40f',   // amarillo
  'in-progress': '#3498db', // azul
  completed: '#2ecc71',   // verde
  cancelled: '#95a5a6'    // gris
}

// Texto traducido (internacionalizable)
const localizedStatus = computed(() => {
  if (!props.status) return t('routes.status.unknown')
  const normalized = props.status.toLowerCase()
  return t(`routes.status.${normalized}`, normalized)
})
</script>

<template>
  <span
      class="status-badge"
      :style="{ backgroundColor: colorMap[status?.toLowerCase()] || '#bbb' }"
  >
    {{ localizedStatus }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-block;
  font-size: 0.75rem;
  color: #111827;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-badge:hover {
  filter: brightness(1.1);
}
</style>
