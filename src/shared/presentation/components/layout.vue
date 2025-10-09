<script setup>
import Navbar from "./Navbar.vue";
import ContainerLayout from "./container-layout.vue";
import {ref} from "vue";
const drawer = ref(false);
const toggleDrawer = () => { drawer.value = !drawer.value; };

const items = [
  {label: 'Clients', to: '/management/clients'},
  {label: 'Users', to: '/management/Users'},
  {label: 'Vehicles', to: '/management/vehicles'},
  { label: 'Routes',  to: '/management/routes/list' }
];
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
        <div>
          <pv-button v-for="item in items" :key="item.label" as-child v-slot="slotProps">
            <router-link :to="item.to" :class="slotProps['class']"> {{item.label}}</router-link>
          </pv-button>
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
</style>