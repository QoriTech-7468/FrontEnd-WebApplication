<template>
  <Dialog v-model:visible="modelVisible" header="New Location" modal style="width: 600px">
    <div class="flex flex-column gap-3">
      <div>
        <label class="block text-700 mb-2">Client</label>
        <pv-dropdown
            class="w-full"
            v-model="clientId"
            :options="clientOpts"
            optionLabel="name"
            optionValue="id"
            disabled
        />
      </div>

      <transition name="fade">
        <div v-if="showMapPicker" class="mt-2">
          <MapPicker
              v-model:address="address"
              v-model:latitude="latitude"
              v-model:longitude="longitude"
          />
        </div>
      </transition>

      <div>
        <label class="block text-700 mb-2">Address</label>
        <pv-input-text
            v-model="address"
            class="w-full"
            placeholder="Enter address or select from map"
        />
      </div>

      <div class="grid mt-2">
        <div class="col-6">
          <label class="block text-700 mb-2">Latitude</label>
          <pv-input-number
              class="w-full"
              v-model="latitude"
              mode="decimal"
              :useGrouping="false"
              :minFractionDigits="6"
              :maxFractionDigits="8"
              :min="-90"
              :max="90"
              placeholder="-12.046374"
          />
        </div>
        <div class="col-6">
          <label class="block text-700 mb-2">Longitude</label>
          <pv-input-number
              class="w-full"
              v-model="longitude"
              mode="decimal"
              :useGrouping="false"
              :minFractionDigits="6"
              :maxFractionDigits="8"
              :min="-180"
              :max="180"
              placeholder="-77.042793"
          />
        </div>
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
import Dialog from "primevue/dialog";
import MapPicker from "../components/google-maps-picker.vue"; // Import del mapa
import { onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  visible: Boolean,
  client: { type: Object, default: null },
  clients: { type: Array, default: () => [] },
  loading: Boolean
});

const emit = defineEmits(["update:visible", "submit"]);

const modelVisible = computed({
  get: () => props.visible,
  set: v => emit("update:visible", v)
});

const clientId  = ref(null);
const address   = ref("");
const latitude  = ref(0);
const longitude = ref(0);
const proximity      = ref("store");
const showMapPicker = ref(false);

const clientOpts  = computed(() => props.clients ?? []);
const proximityOptions = [
  { label: "Close",     value: "close" },
  { label: "Mid",     value: "mid" },
  { label: "Far", value: "far" }
];

watch(
    () => props.visible,
    (v) => {
      if (v) {
        clientId.value  = props.client?.id ?? null;
        address.value   = "";
        latitude.value  = null;
        longitude.value = null;
        proximity.value      = "close";
        showMapPicker.value = false; // SIEMPRE inicia oculto
      }
    },
    { immediate: true }
);

// Watch para debug - ver cuando cambian las coordenadas
watch([latitude, longitude], ([newLat, newLng]) => {
  console.log("Coordinates changed - Latitude:", newLat, "Longitude:", newLng);
}, { deep: true });

function submit() {
  // Validaciones
  if (!clientId.value) {
    console.error("Client ID is required");
    return;
  }
  
  // Validar address - puede venir del input manual o del MapPicker
  const addressValue = address.value?.trim() || "";
  if (!addressValue) {
    console.error("Address is required");
    return;
  }
  
  // Convertir y validar coordenadas - manejar tanto strings como numbers
  const latValue = latitude.value;
  const lngValue = longitude.value;
  
  // Debug: ver qué valores tenemos
  console.log("Submit - Latitude value:", latValue, "Type:", typeof latValue);
  console.log("Submit - Longitude value:", lngValue, "Type:", typeof lngValue);
  
  // Convertir a number si es string o si es null/undefined
  const latNum = latValue === null || latValue === undefined || latValue === "" 
    ? null 
    : (typeof latValue === 'string' ? parseFloat(latValue) : Number(latValue));
  const lngNum = lngValue === null || lngValue === undefined || lngValue === "" 
    ? null 
    : (typeof lngValue === 'string' ? parseFloat(lngValue) : Number(lngValue));
  
  // Validar que sean números válidos y no sean 0 (0,0 es en el océano, no es una ubicación válida)
  // Permitir valores negativos (latitudes y longitudes pueden ser negativas)
  if (latNum === null || isNaN(latNum) || latNum === 0 || latNum < -90 || latNum > 90) {
    console.error("Latitude is required. Please select a location on the map or enter valid coordinates.");
    console.log("Latitude validation failed - value:", latValue, "parsed:", latNum);
    return;
  }
  
  if (lngNum === null || isNaN(lngNum) || lngNum === 0 || lngNum < -180 || lngNum > 180) {
    console.error("Longitude is required. Please select a location on the map or enter valid coordinates.");
    console.log("Longitude validation failed - value:", lngValue, "parsed:", lngNum);
    return;
  }
  
  if (!proximity.value) {
    console.error("Proximity is required");
    return;
  }

  // Convertir a string (el backend acepta string o number, pero usamos string para consistencia)
  emit("submit", {
    clientId: clientId.value,
    address: addressValue,
    proximity: proximity.value,
    latitude: String(latNum),
    longitude: String(lngNum),
    isActive: true
  });
}

onMounted(() => {
  // Escucha el evento global solo si el diálogo está visible
  window.addEventListener('open-map-picker', handleOpenMapPicker);
});

onBeforeUnmount(() => {
  window.removeEventListener('open-map-picker', handleOpenMapPicker);
});

function handleOpenMapPicker() {
  if (props.visible) {
    showMapPicker.value = true;
  }
}
</script>
