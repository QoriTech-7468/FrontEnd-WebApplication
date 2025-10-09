<template>
  <div class="app-layout">
    <div class="layout-container">
      <slot />
    </div>
  </div>
</template>

<script setup>
// Este componente proporciona el layout base para toda la aplicación
// con el espaciado correcto del header y el contenedor principal
</script>

<style scoped>
.app-layout {
  margin-top: 60px; /* Altura del header para empujar el contenido hacia abajo */
  min-height: 100vh;
  background: #f8f9fa;
  padding: 0;
}

.layout-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}

/* Responsive adjustments */
@media (max-width: 1280px) {
  .layout-container {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .layout-container {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .layout-container {
    padding: 12px;
  }
}
</style>
