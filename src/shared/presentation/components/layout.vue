<script setup>
import Navbar from "./Navbar.vue";
import ContainerLayout from "./container-layout.vue";
import {ref, computed} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import useIamStore from "../../../iam/presentation/application/iam.store.js";
import { storeToRefs } from "pinia";

const drawer = ref(false);
const toggleDrawer = () => { drawer.value = !drawer.value; };

const router = useRouter();
const iamStore = useIamStore();
const { currentUserName, currentUserSurname } = storeToRefs(iamStore);

const items = [
  { label: 'Deliveries', to: '/management/routes/transportist' },
  { label: 'Clients', to: '/management/clients' },
  { label: 'Users', to: '/management/Users' },
  { label: 'Vehicles', to: '/management/vehicles' },
  { label: 'Routes',  to: '/management/routes/list' }
];

// i18n setup
const { locale } = useI18n();
const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'es' : 'en';
  localStorage.setItem('lang', locale.value);
};

const userDisplayName = computed(() => {
  if (currentUserName.value && currentUserSurname.value) {
    return `${currentUserName.value} ${currentUserSurname.value}`;
  } else if (currentUserName.value) {
    return currentUserName.value;
  }
  return '';
});

const handleLogout = () => {
  iamStore.signOut(router);
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

          <!-- Información del usuario -->
          <span v-if="userDisplayName" class="user-name">{{ userDisplayName }}</span>

          <!-- Botón de idioma -->
          <pv-button
              class="p-button-rounded p-button-outlined lang-btn"
              icon="pi pi-globe"
              @click="toggleLanguage"
              :label="locale === 'en' ? 'ES' : 'EN'"
          />

          <!-- Botón de logout -->
          <pv-button
              class="p-button-danger logout-btn"
              icon="pi pi-sign-out"
              label="Salir"
              @click="handleLogout"
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

/* Información del usuario */
.user-name {
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 0 0.5rem;
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

/* Botón de logout */
.logout-btn {
  height: 2.2rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .user-name {
    display: none;
  }
  
  .logout-btn {
    padding: 0.5rem;
  }
  
  .logout-btn :deep(.p-button-label) {
    display: none;
  }
}
</style>