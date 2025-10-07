<template>
  <div class="p-4">
    <div class="flex align-items-center justify-content-between mb-2">
      <div>
        <div class="text-900 text-3xl font-semibold">Clients</div>
        <div class="text-600">Add or edit your clients</div>
      </div>
      <Button
          label="Register client"
          icon="pi pi-plus-circle"
          class="font-medium"
          severity="contrast"
          @click="openNewClient()"
      />
    </div>

    <div class="grid">
      <!-- Sidebar -->
      <div class="col-12 md:col-4 lg:col-3">
        <ClientSidebar
            :clients="clients"
            v-model:selectedId="selectedId"
            v-model:query="q"
        />
      </div>

      <!-- Panel central + Locations (pantalla 1 y 2) -->
      <div class="col-12 md:col-8 lg:col-9">
        <div class="grid">
          <!-- Centro -->
          <div class="col-12 lg:col-8">
            <Panel :header="selected ? selected.name : null" class="shadow-1">
              <!-- Estado 1: vacío -->
              <div v-if="!selected" class="flex flex-column align-items-center justify-content-center h-25rem text-600">
                <i class="pi pi-user text-6xl mb-3"></i>
                <span>Select a client to see details</span>
              </div>

              <!-- Estado 2: seleccionado -->
              <template v-else>
                <div class="flex align-items-center justify-content-between mb-3">
                  <Tag :value="selected.status" :severity="statusSeverity(selected.status)" />
                  <div class="flex gap-2">
                    <Button label="Edit" outlined />
                    <Button label="Register location" severity="warning" @click="openNewLocation()" />
                  </div>
                </div>

                <div class="border-1 surface-border border-round p-3 h-20rem flex flex-column align-items-center justify-content-center">
                  <i class="pi pi-map-marker text-5xl mb-2"></i>
                  <span class="text-600">Interactive Map</span>
                  <small class="text-500">Click on the map to create a new location</small>
                </div>
              </template>
            </Panel>
          </div>

          <!-- Derecha: Locations -->
          <div class="col-12 lg:col-4">
            <LocationsPanel
                :selected="selected"
                @new-location="openNewLocation"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogs -->
    <NewLocationDialog v-model:visible="showNewLocation" :clients="clients" />
    <NewClientDialog v-model:visible="showNewClient" />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import Panel from "primevue/panel";
import Button from "primevue/button";
import Tag from "primevue/tag";

import ClientSidebar from "../components/clients-sidebar.vue";
import LocationsPanel from "../components/locations-panel.vue";
import NewLocationDialog from "../dialogs/add-location.vue";
import NewClientDialog from "../dialogs/add-clients.vue";

/* Datos en memoria (sin API) */
const clients = ref([
  {
    id: 1, name: "Client 1", status: "Disabled",
    locations: [
      { id: "l1", title: "Av. Industrial 123, Lima", type: "Viajero", status: "Active" },
      { id: "l2", title: "Jr. Los Olivos 456, Lima", type: "Viajero", status: "Active" },
      { id: "l3", title: "Av. Pachacútec 789, Callao", type: "Local", status: "Disable" }
    ]
  },
  { id: 2, name: "Client 2", status: "Enabled", locations: [] },
  { id: 3, name: "Client 3", status: "Enabled", locations: [] }
]);

const q = ref("");
const selectedId = ref(null);

const selected = computed(() => clients.value.find(c => c.id === selectedId.value));

function statusSeverity(s) {
  return s?.toLowerCase() === "enabled" || s?.toLowerCase() === "active" ? "success"
      : s?.toLowerCase() === "disabled" || s?.toLowerCase() === "disable" ? "danger"
          : "info";
}

/* Dialogs */
const showNewLocation = ref(false);
const showNewClient = ref(false);
function openNewLocation() { showNewLocation.value = true; }
function openNewClient() { showNewClient.value = true; }
</script>

<style scoped>
.shadow-1{ box-shadow:0 2px 8px rgba(0,0,0,.06); }
.h-25rem{ height:25rem; }
</style>
