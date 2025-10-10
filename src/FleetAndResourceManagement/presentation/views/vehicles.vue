<template>
    <!-- Header -->
    <div class="flex align-items-center justify-content-between mb-2">
      <div class="mb-3">
        <div class="text-900 text-3xl font-semibold">{{ $t('vehicles.title') }}</div>
        <div class="text-600">{{ $t('vehicles.subtitle') }}</div>
      </div>
      <pv-button :label="$t('vehicles.registerVehicle')" icon="pi pi-plus-circle" class="font-medium" @click="openCreate()" />
    </div>

    <div class="grid">
      <!-- LEFT: Sidebar -->
      <div class="col-12 md:col-4 lg:col-3">
        <VehicleSidebar
            :vehicles="vehicles"
            v-model:selectedId="selectedId"
            v-model:query="q"
        />
      </div>

      <!-- CENTER: Panel detalles / placeholder -->
      <div class="col-12 md:col-8 lg:col-9">
        <pv-panel :header="selected ? $t('vehicles.detailsHeader') : null" class="shadow-1 h-full">
          <!-- Pantalla 1: vacío -->
          <div v-if="!selected" class="flex flex-column align-items-center justify-content-center h-25rem text-600">
            <i class="pi pi-truck text-6xl mb-3"></i>
            <span>{{ $t('vehicles.selectPrompt') }}</span>
          </div>

          <!-- Pantalla 2: seleccionado -->
          <VehicleDetailsPanel
              v-else
              :vehicle="selected"
          />
        </pv-panel>
      </div>
    </div>

  <!-- Pop-out: New vehicle -->
  <NewVehicleDialog v-model:visible="showCreate" />
</template>

<script setup>
import { computed, ref } from "vue";

import Navbar from "../../../shared/presentation/components/Navbar.vue";

import VehicleSidebar from "../components/vehicle-sidebar.vue";
import VehicleDetailsPanel from "../components/vehicle-details.vue";
import NewVehicleDialog from "../dialogs/add-vehicle.vue";

const currentTab = ref("vehicles")
/* Datos en memoria (sin API) */
const vehicles = ref([
  { id: 1, plate: "ABC-123", capacity: 1500, status: "Disabled", members: [] },
  { id: 2, plate: "ABD-123", capacity: 1500, status: "Enabled",  members: [{ id:"m1", name:"Jhon Doe Carrera Nuñez" }] },
  { id: 3, plate: "ABE-123", capacity: 1500, status: "Disabled", members: [] }
]);

const q = ref("");
const selectedId = ref(null);
const selected = computed(() => vehicles.value.find(v => v.id === selectedId.value) || null);

/* Dialog crear */
const showCreate = ref(false);
function openCreate(){ showCreate.value = true; }
</script>

<style scoped>
/* ===== BUTTON STYLES ===== */
:deep(.p-button) {
  padding: 12px 20px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(4, 56, 115, 0.2) !important;
}

:deep(.p-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(4, 56, 115, 0.3) !important;
}

:deep(.p-button:active) {
  transform: translateY(0) !important;
}
</style>
