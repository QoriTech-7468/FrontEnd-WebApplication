<template>
  <Dialog v-model:visible="modelVisible" header="New Location" modal style="width: 600px">
    <div class="flex flex-column gap-3">
      

      <div>
        <label class="block text-700 mb-2">Seleccionar Ubicación</label>
        <MapWithPin
            v-model:latitude="latitude"
            v-model:longitude="longitude"
        />
      </div>

      <div>
        <label class="block text-700 mb-2">Address</label>
        <pv-input-text
            v-model="address"
            class="w-full"
            placeholder="Ingresa la dirección manualmente"
        />
      </div>

      <div>
        <label class="block text-700 mb-2">Proximity</label>
        <pv-dropdown
            class="w-full"
            v-model="proximity"
            :options="proximityOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select a Type"
        />
      </div>

      <div class="mt-2">
        <pv-button
            label="Confirm"
            class="w-full"
            :loading="loading"
            @click="submit"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import MapWithPin from "../components/map-with-pin.vue";

const toast = useToast();

const props = defineProps({
  visible: Boolean,
  client: { type: Object, default: null },
  clientId: { type: [Number, String], default: null },
  clients: { type: Array, default: () => [] },
  loading: Boolean
});

const emit = defineEmits(["update:visible", "submit"]);

const modelVisible = computed({
  get: () => props.visible,
  set: v => emit("update:visible", v)
});

const address   = ref("");
const latitude  = ref(null);
const longitude = ref(null);
const proximity = ref("store");

const clientOpts  = computed(() => props.clients ?? []);
const proximityOptions = [
  { label: "Close",     value: "close" },
  { label: "Mid",     value: "mid" },
  { label: "Far", value: "far" }
];

// Computed para obtener el clientId (prioriza prop directo, luego del objeto client)
const clientId = computed(() => {
  // Priorizar el prop directo clientId
  if (props.clientId !== null && props.clientId !== undefined && props.clientId !== '') {
    return props.clientId;
  }
  // Si no está disponible, intentar obtenerlo del objeto client
  if (props.client?.id !== null && props.client?.id !== undefined && props.client?.id !== '') {
    return props.client.id;
  }
  return null;
});

// Watch for dialog visibility to reset form
watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      // Si no hay clientId, mostrar error inmediatamente
      if (!clientId.value) {
        toast.add({
          severity: "error",
          summary: "Client ID missing",
          detail: "No client selected. Please select a client first.",
          life: 3000
        });
      }
      
      // Reset form values
      address.value = "";
      latitude.value = null;
      longitude.value = null;
      proximity.value = "close";
    }
  },
  { immediate: true }
);

function submit() {
  
  // Validar address
  const addressValue = address.value?.trim() || "";
  if (!addressValue) {
    console.error("Address is required");
    return;
  }
  
  // Validar coordenadas
  const latValue = latitude.value;
  const lngValue = longitude.value;
  
  if (latValue === null || latValue === undefined || isNaN(Number(latValue))) {
    console.error("Latitude is required. Please select a location on the map.");
    return;
  }
  
  if (lngValue === null || lngValue === undefined || isNaN(Number(lngValue))) {
    console.error("Longitude is required. Please select a location on the map.");
    return;
  }
  
  if (!proximity.value) {
    console.error("Proximity is required");
    return;
  }

  // Validar que clientId esté presente
  const currentClientId = clientId.value;
  if (!currentClientId) {
    toast.add({
      severity: "error",
      summary: "Client ID required",
      detail: "Please select a client first before adding a location.",
      life: 3000
    });
    return;
  }

  // Convertir coordenadas a string
  emit("submit", {
    clientId: currentClientId,
    address: addressValue,
    proximity: proximity.value,
    latitude: String(latValue),
    longitude: String(lngValue),
    isActive: true
  });
}

</script>
