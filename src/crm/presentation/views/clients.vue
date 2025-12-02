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
                    <pv-button 
                      :label="$t('clients.registerLocation')" 
                      severity="warning" 
                      :disabled="!selectedId"
                      @click="openAddLocationDialog" 
                    />
                  </div>
                </div>

                <LocationsMap
                    :locations="selectedWithLocations?.locations || []"
                    @marker-click="openEditLocationDialog"
                />

             
              </template>

            </pv-panel>
          </div>

          <!-- Derecha -->
          <div class="col-12 lg:col-4">
            <pv-panel class="shadow-1" :header="`Locations: ${locationsCountText}`">
              <LocationsPanel 
                  :selected="selectedWithLocations" 
                  @edit-location="openEditLocationDialog"
              />
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
                           :clientId="selectedId ?? null"
                           :clients="clientsList"
                           :loading="creatingLocation"
                           @submit="handleCreateLocation" />
    <UpdateClientsDialog
        v-model:visible="showUpdate"
        :client="selected"
        @saved="refreshClients"
    />

    <EditLocation
        v-model:visible="showEditLocation"
        :location="locationToEdit"
        :loading="updatingLocation"
        @save="saveLocationEdit"
    />

    <pv-toast />
  </div>

</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";

import ClientsSidebar from "../components/clients-sidebar.vue";
import LocationsPanel from "../components/locations-panel.vue";
import AddClientsDialog from "../dialogs/add-clients.vue";
import AddLocationDialog from "../dialogs/add-location.vue";
import UpdateClientsDialog from "../dialogs/edit-client.vue";
import LocationsMap from "../components/locations-map.vue";

import useCrmStore from "../../application/crm.store.js";
import {Button as PvButton} from "primevue";
import EditLocation from "../dialogs/edit-location.vue";

const store = useCrmStore();
const toast = useToast();

const q = ref("");
const selectedId = ref(null);

const showCreate = ref(false);
const showUpdate = ref(false);
const showAddLocation = ref(false);
const creating = ref(false);

const showEditLocation = ref(false);
const locationToEdit = ref(null);
const updatingLocation = ref(false);

const clientsList = computed(() => store.clients ?? []);


const selected = computed(() => clientsList.value.find(c => c.id === selectedId.value) || null);

// Estado para almacenar las locations del cliente seleccionado
const clientLocations = ref([]);
const loadingLocations = ref(false);

const selectedWithLocations = computed(() => {
  if (!selected.value) return null;
  
  // Si tenemos locations cargadas para este cliente, usarlas
  if (clientLocations.value.length > 0 && 
      clientLocations.value[0]?.clientId === selected.value.id) {
    return { ...selected.value, locations: clientLocations.value };
  }
  
  // Fallback: buscar en el store global
  if (Array.isArray(selected.value.locations)) {
    return selected.value;
  }

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

// Watch para cargar locations cuando se selecciona un cliente
watch(selectedId, async (newClientId) => {
  if (newClientId) {
    loadingLocations.value = true;
    try {
      // Cargar solo locations activas del cliente seleccionado
      const locations = await store.fetchLocations({ isActive: true, clientId: newClientId });
      clientLocations.value = locations;
    } catch (error) {
      console.error("Error loading client locations:", error);
      clientLocations.value = [];
      toast.add({
        severity: "warn",
        summary: "Could not load locations",
        detail: "Using cached locations if available",
        life: 2000
      });
    } finally {
      loadingLocations.value = false;
    }
  } else {
    clientLocations.value = [];
  }
});

function onOpenNewClient() {
  showCreate.value = true;
}

function handleCreate() {
  showCreate.value = false;
  refreshClients();
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
    // Validar payload antes de enviar
    if (!payload.clientId) {
      throw new Error("Client ID is required");
    }
    if (!payload.address || !payload.address.trim()) {
      throw new Error("Address is required");
    }
    if (!payload.proximity) {
      throw new Error("Proximity is required");
    }

    await store.addLocation(payload);
    showAddLocation.value = false;
    toast.add({ 
      severity: "success", 
      summary: "Location created", 
      detail: payload.address, 
      life: 2500 
    });
    // Refrescar locations del cliente seleccionado (solo activas)
    if (selectedId.value) {
      const locations = await store.fetchLocations({ isActive: true, clientId: selectedId.value });
      clientLocations.value = locations;
    }
    // También refrescar el store global
    store.fetchLocations();
  } catch (e) {
    const errorMessage = e?.response?.data?.message || e?.message || "Could not create location";
    toast.add({ 
      severity: "error", 
      summary: "Error creating location", 
      detail: errorMessage, 
      life: 3000 
    });
    console.error("Error creating location:", e);
  } finally {
    creatingLocation.value = false;
  }
}
function openEditDialog() {
  showUpdate.value = true
}

function openAddLocationDialog() {
  if (!selectedId.value) {
    toast.add({
      severity: "warn",
      summary: "No client selected",
      detail: "Please select a client first before adding a location.",
      life: 3000
    });
    return;
  }
  showAddLocation.value = true;
}

function refreshClients() {
  store.fetchClients()
}

function openEditLocationDialog(location) {
  locationToEdit.value = location;
  showEditLocation.value = true;
}

async function saveLocationEdit(updated) {
  updatingLocation.value = true;
  try {
    await store.updateLocation(updated);
    showEditLocation.value = false;
    locationToEdit.value = null;
    toast.add({
      severity: "success",
      summary: "Location updated",
      detail: updated.address,
      life: 2500
    });
    // Refrescar locations del cliente seleccionado (solo activas)
    if (selectedId.value) {
      try {
        const locations = await store.fetchLocations({ isActive: true, clientId: selectedId.value });
        clientLocations.value = locations;
      } catch (error) {
        console.error("Error refreshing client locations:", error);
      }
    }
    // También refrescar el store global
    store.fetchLocations();
  } catch (e) {
    const errorMessage = e?.response?.data?.message || e?.message || "Could not update location";
    toast.add({
      severity: "error",
      summary: "Error updating location",
      detail: errorMessage,
      life: 3000
    });
    console.error("Error updating location:", e);
  } finally {
    updatingLocation.value = false;
  }
}
</script>


<style scoped>
</style>
