<template>
  <div class="flex align-items-center justify-content-between mb-4">
    <div>
      <h1 class="text-3xl font-semibold mb-0">Vehicles</h1>
      <p class="text-600 mt-1">Add or edit your vehicles</p>
    </div>
    <pv-button label="Register vehicle" icon="pi pi-plus-circle" @click="openCreate()" />
  </div>

  <div class="grid">

    <div class="col-12 md:col-4 lg:col-3">
      <VehicleSidebar
          :vehicles="vehicles"
          v-model:selectedId="selectedId"
      />
    </div>

    <div class="col-12 md:col-8 lg:col-9">
      <div v-if="!selected" class="flex flex-column align-items-center justify-content-center h-full bg-gray-100 border-round p-4">
        <i class="pi pi-truck text-6xl text-gray-400 mb-3"></i>
        <span class="text-gray-500">Select a vehicle to see its details</span>
      </div>

      <div v-else>
        <pv-panel header="Vehicle's details" class="mb-4">
          <div class="flex justify-content-between align-items-start">
            <div>
              <div class="text-sm text-gray-500">License Plate</div>
              <div class="text-lg font-medium">{{ selected.plate }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">Capacity</div>
              <div class="text-lg font-medium">{{ selected.capacity }} kg</div>
            </div>
            <div>
              <div class="text-sm text-gray-500">State</div>
              <span :class="['font-bold', selected.status === 'Enabled' ? 'text-green-500' : 'text-red-500']">{{ selected.status }}</span>
            </div>
            <pv-button label="Edit" icon="pi pi-pencil" class="p-button-text" />
          </div>
        </pv-panel>

        <pv-panel header="Team members">
          <pv-button label="Add team members" icon="pi pi-plus" @click="openAddMember" class="mb-3" />

          <ul v-if="selected.members && selected.members.length > 0" class="list-none p-0 m-0">
            <li v-for="member in selected.members" :key="member.id" class="flex justify-content-between align-items-center p-2 border-bottom-1 border-gray-200">
              <div class="flex align-items-center">
                <i class="pi pi-user mr-2"></i>
                <span>{{ member.fullname }}</span>
              </div>
              <pv-button
                  icon="pi pi-times"
                  class="p-button-rounded p-button-text p-button-danger"
                  @click="handleDeassignMember(member)"
              />
            </li>
          </ul>
          <div v-else class="text-gray-500">
            No members assigned to this vehicle.
          </div>
        </pv-panel>
      </div>
    </div>
  </div>

  <NewVehicleDialog v-model:visible="showCreate" @save-vehicle="handleSaveVehicle" />
  <AddTeamMemberDialog
      v-model:visible="showAddMember"
      :available-users="availableUsers"
      @assign-member="handleAssignMember"
  />
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import useStore from "../../application/fleet-resource-management.store.js";

import VehicleSidebar from "../components/vehicle-sidebar.vue";
import NewVehicleDialog from "../dialogs/add-vehicle.vue";
import AddTeamMemberDialog from "../dialogs/add-team-member.vue";
import PvButton from "primevue/button";
import PvPanel from "primevue/panel";

// Inicialización del Store
const store = useStore();
const { vehicles, users } = storeToRefs(store);

// Carga de datos inicial
onMounted(() => {
  store.fetchVehicles();
  store.fetchUsers();
});

const selectedId = ref(null);
const showCreate = ref(false);
const showAddMember = ref(false);

const selected = computed(() => {
  if (!selectedId.value) return null;
  const vehicle = vehicles.value.find(v => v.id == selectedId.value);
  if (!vehicle) return null;
  // Asocia los miembros al vehículo seleccionado
  return {
    ...vehicle,
    members: users.value.filter(u => u.vehicleId == vehicle.id)
  };
});

const availableUsers = computed(() => {
  return users.value.filter(user => !user.vehicleId);
});

// Funciones para Vehículos
function openCreate() {
  showCreate.value = true;
}

async function handleSaveVehicle(vehicleData) {
  await store.addVehicles(vehicleData);
  showCreate.value = false;
}

// -Funciones para Miembros del Equipo
function openAddMember() {
  showAddMember.value = true;
}

async function handleAssignMember(userToAssign) {
  if (!selected.value) return;
  const updatedUser = { ...userToAssign, vehicleId: selected.value.id };
  await store.updateUsers(updatedUser);
}

async function handleDeassignMember(memberToDeassign) {
  const updatedUser = { ...memberToDeassign, vehicleId: null };
  await store.updateUsers(updatedUser);
}
</script>

<style scoped>

</style>