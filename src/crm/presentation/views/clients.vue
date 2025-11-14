<template>
  <div class="p-4">
    <div class="flex align-items-center justify-content-between mb-2">
      <div>
        <div class="text-900 text-3xl font-semibold">{{ $t('clients.title') }}</div>
        <div class="text-600">{{ $t('clients.subtitle') }}</div>
      </div>

      <pv-button
          :label="$t('clients.register')"
          icon="pi pi-plus-circle"
          class="font-medium"
          @click="onOpenNewClient"
      />
    </div>

    <div class="grid">
      <!-- Sidebar -->
      <div class="col-12 md:col-4 lg:col-3">
        <ClientsSidebar
            :clients="clientsList"
            v-model:selectedId="selectedId"
            v-model:query="q"
        />
      </div>

      <!-- Centro + derecha -->
      <div class="col-12 md:col-8 lg:col-9">
        <div class="grid">
          <!-- Centro -->
          <div class="col-12 lg:col-8">
            <pv-panel :header="selected ? selected.name : null" class="shadow-1">
              <div
                  v-if="!selected"
                  class="flex flex-column align-items-center justify-content-center h-25rem text-600"
              >
                <i class="pi pi-user text-6xl mb-3" />
                <span>Select a client to see details</span>
              </div>

              <template v-else>
                <div class="flex align-items-center justify-content-between mb-3">
                  <pv-tag :value="selected.status" :severity="statusSeverity(selected.status)" />
                  <div class="flex gap-2">
                    <pv-button label="Edit" icon="pi pi-pencil" @click="openEditDialog" />
                    <pv-button :label="$t('clients.registerLocation')" severity="warning"   @click="openMapPickerForSelectedClient" />
                  </div>
                </div>

                <div
                    class="border-1 surface-border border-round p-3 h-20rem flex flex-column align-items-center justify-content-center cursor-pointer hover:surface-hover transition-all"
                    @click="openMapPickerForSelectedClient"
                >
                  <i class="pi pi-map-marker text-5xl mb-2" />
                  <span class="text-600">{{ $t('clients.mapTitle') }}</span>
                  <small class="text-500">{{ $t('clients.mapHint') }}</small>
                </div>
              </template>
            </pv-panel>
          </div>

          <!-- Derecha -->
          <div class="col-12 lg:col-4">
            <pv-panel class="shadow-1" :header="`Locations: ${locationsCountText}`">
              <LocationsPanel :selected="selectedWithLocations" />
            </pv-panel>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogs -->
    <AddClientsDialog
        v-model:visible="showCreate"
        :loading="creating"
        @submit="handleCreate"
    />
    <AddLocationDialog     v-model:visible="showAddLocation"
                           :client="selected"
                           :clients="clientsList"
                           :loading="creatingLocation"
                           @submit="handleCreateLocation" />
    <UpdateClientsDialog
        v-model:visible="showUpdate"
        :client="selected"
        @saved="refreshClients"
    />
    <pv-toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";

import ClientsSidebar from "../components/clients-sidebar.vue";
import LocationsPanel from "../components/locations-panel.vue";
import AddClientsDialog from "../dialogs/add-clients.vue";
import AddLocationDialog from "../dialogs/add-location.vue";
import UpdateClientsDialog from "../dialogs/edit-client.vue";

import customerStore from "/src/crm/application/customer-location-management.store.js";
import {Button as PvButton} from "primevue";

const store = customerStore();
const toast = useToast();

const q = ref("");
const selectedId = ref(null);

const showCreate = ref(false);
const showUpdate = ref(false);
const showAddLocation = ref(false);
const creating = ref(false);
const shouldOpenMap = ref(false);

const clientsList = computed(() => store.clients ?? []);


const selected = computed(() => clientsList.value.find(c => c.id === selectedId.value) || null);

const selectedWithLocations = computed(() => {
  if (!selected.value) return null;
  if (Array.isArray(selected.value.locations)) return selected.value;

  const cid = Number(selected.value.id);
  const locs = (store.locations ?? []).filter(
      l => Number(l.clientId ?? l.clientsId) === cid
  );
  return { ...selected.value, locations: locs };
});

const locationsCountText = computed(() => {
  const n = selectedWithLocations.value?.locations?.length ?? 0;
  return String(n);
});

onMounted(() => {
  if (!store.clientsLoaded) store.fetchClients();
  if (!store.locationsLoaded) store.fetchLocations();
});

function onOpenNewClient() {
  showCreate.value = true;
}

function statusSeverity(s) {
  const v = (s || "").toLowerCase();
  if (v === "enabled" || v === "active") return "success";
  if (v === "disabled" || v === "disable") return "danger";
  return "info";
}
const creatingLocation = ref(false);

async function handleCreateLocation(payload) {
  creatingLocation.value = true;
  try {
    await new Promise((res, rej) => store.addLocation(payload).then(res).catch(rej));
    showAddLocation.value = false;
    toast.add({ severity: "success", summary: "Location created", detail: payload.address, life: 2500 });
  } catch (e) {
    toast.add({ severity: "error", summary: "Could not create", detail: e?.message || "Error", life: 3000 });
  } finally {
    creatingLocation.value = false;
  }
}
function openEditDialog() {
  showUpdate.value = true
}
function openMapPickerForSelectedClient() {
  if (!selected.value) return;
  shouldOpenMap.value = true; // Indica que se abrió desde el mapa
  showAddLocation.value = true;

  // Esperar un poco para que el diálogo se monte
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('open-map-picker'));
  }, 200);
}

function refreshClients() {
  store.fetchClients()
}

function openLocationDialog() {
  shouldOpenMap.value = false; // NO abrir el mapa automáticamente
  showAddLocation.value = true;
}
</script>


<style scoped>
</style>
