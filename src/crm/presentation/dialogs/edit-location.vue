<template>
  <Dialog v-model:visible="modelVisible" header="Edit Location" modal style="width: 600px">
    <div class="flex flex-column gap-3">
      
      <div>
        <label class="block text-700 mb-2">Seleccionar Ubicación</label>
        <MapWithPin
            v-model:latitude="form.latitude"
            v-model:longitude="form.longitude"
        />
      </div>

      <div>
        <label class="block text-700 mb-2">Address</label>
        <pv-input-text
            class="w-full"
            v-model="form.address"
            placeholder="Ingresa la dirección manualmente"
        />
      </div>

      <div>
        <label class="block text-700 mb-2">Proximity</label>
        <pv-dropdown
            class="w-full"
            v-model="form.proximity"
            :options="proximityOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a Type"
        />
      </div>

      <div>
        <label class="block text-700 mb-2">Status</label>
        <pv-dropdown
            class="w-full"
            v-model="form.isActive"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Status"
        />
      </div>

      <div class="mt-2">
        <pv-button
            label="Save changes"
            class="w-full"
            :loading="loading"
            @click="submit"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import Dialog from "primevue/dialog";
import MapWithPin from "../components/map-with-pin.vue";

const props = defineProps({
  visible: Boolean,
  location: Object,
  loading: Boolean
});

const emit = defineEmits(["update:visible", "save"]);

const modelVisible = computed({
  get: () => props.visible,
  set: v => emit("update:visible", v)
});

const form = ref({
  id: null,
  clientId: null,
  address: "",
  latitude: null,
  longitude: null,
  proximity: "close",
  isActive: true,
});

const proximityOptions = [
  { label: "Close", value: "close" },
  { label: "Mid", value: "mid" },
  { label: "Far", value: "far" }
];

const statusOptions = [
  { label: "Active", value: true },
  { label: "Disabled", value: false }
];

watch(() => props.location, (loc) => {
  if (!loc) {
    // Reset form when location is null
    form.value = {
      id: null,
      clientId: null,
      address: "",
      latitude: null,
      longitude: null,
      proximity: "close",
      isActive: true,
    };
    return;
  }
  
  // Populate form with location data
  form.value = {
    id: loc.id ?? null,
    clientId: loc.clientId ?? loc.clientsId ?? null,
    address: loc.address ?? "",
    latitude: loc.latitude ?? null,
    longitude: loc.longitude ?? null,
    proximity: loc.proximity ?? "close",
    isActive: loc.isActive !== null && loc.isActive !== undefined ? loc.isActive : true,
  };
}, { immediate: true });

function submit() {
  // Validaciones
  if (!form.value.id) {
    console.error("Location ID is required");
    return;
  }
  
  if (!form.value.clientId) {
    console.error("Client ID is required");
    return;
  }
  
  // Validar address
  const addressValue = form.value.address?.trim() || "";
  if (!addressValue) {
    console.error("Address is required");
    return;
  }
  
  // Validar coordenadas
  const latValue = form.value.latitude;
  const lngValue = form.value.longitude;
  
  if (latValue === null || latValue === undefined || isNaN(Number(latValue))) {
    console.error("Latitude is required. Please select a location on the map.");
    return;
  }
  
  if (lngValue === null || lngValue === undefined || isNaN(Number(lngValue))) {
    console.error("Longitude is required. Please select a location on the map.");
    return;
  }
  
  if (!form.value.proximity) {
    console.error("Proximity is required");
    return;
  }

  // Preparar payload según el formato del endpoint
  const payload = {
    id: form.value.id,
    clientId: form.value.clientId, // Se envía pero no se puede editar
    address: addressValue,
    latitude: String(latValue),
    longitude: String(lngValue),
    proximity: form.value.proximity,
    isActive: form.value.isActive
  };

  emit("save", payload);
}
</script>