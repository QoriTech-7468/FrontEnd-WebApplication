<script setup>
import Navbar from "./Navbar.vue";
import {ref} from "vue";
const drawer = ref(false);
const toggleDrawer = () => { drawer.value = !drawer.value; };

const items = [
  {label: 'Clients', to: '/management/clients'},
  {label: 'Users', to: '/management/Users'},
  {label: 'Vehicles', to: '/management/vehicles'},
  { label: 'Routes',  to: '/routes/list' }
];
</script>

<template>

  <pv-toast/>
  <pv-confirm-dialog/>
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
  <div class="main-content">
    <router-view/>
  </div>


</template>

<style scoped>
.header {
  position:  absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.main-content {
  margin-top: 95px; /* Adjust based on header height */
}
</style>