<script setup>
import Navbar from "./Navbar.vue";
import ContainerLayout from "./container-layout.vue";
import {ref} from "vue";
import { useI18n } from "vue-i18n";
const drawer = ref(false);
const toggleDrawer = () => { drawer.value = !drawer.value; };

const items = [
  {label: 'Clients', to: '/management/clients'},
  {label: 'Users', to: '/management/Users'},
  {label: 'Vehicles', to: '/management/vehicles'},
  { label: 'Routes',  to: '/management/routes/list' }
];

// i18n setup
const { locale } = useI18n();
const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'es' : 'en';
};

</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  
  <!-- Header fijo -->
  <div class="header">
    <pv-toolbar class="bg-primary">
      <template #start>
        <pv-button class="p-button-text" icon="pi pi-bars" @click="toggleDrawer"/>
        <h3>Rutana</h3>
      </template>
      <template #end>
        <div class="nav-actions">
          <!--BLOQUE DE BOTONES DE NAVEGACIÓN -->
          <div class="nav-links">
            <pv-button
                v-for="item in items"
                :key="item.label"
                as-child
                v-slot="slotProps"
                class="p-button-text"
            >
              <router-link :to="item.to" :class="slotProps['class']">
                {{ $t(`navbar.${item.label.toLowerCase()}`) }}
              </router-link>
            </pv-button>
          </div>

          <!-- Botón de idioma -->
          <pv-button
              class="p-button-rounded p-button-outlined lang-btn"
              icon="pi pi-globe"
              @click="toggleLanguage"
              :label="locale === 'en' ? 'ES' : 'EN'"
          />
        </div>
      </template>
    </pv-toolbar>
  </div>
  
  <!-- Contenido principal con layout -->
  <ContainerLayout>
    <router-view/>
  </ContainerLayout>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem; /* Espacio entre links y el botón */
}

/* Asegura que los botones estén alineados */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Botón de idioma con estilo compacto */
.lang-btn {
  color: white;
  border-color: white;
  height: 2.2rem;
  font-weight: 600;
}
.lang-btn:hover {
  background-color: white;
  color: var(#0d6efd);
}
</style>