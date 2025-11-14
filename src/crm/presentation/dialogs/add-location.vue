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

      <div class="grid mt-2">
        <div class="col-6">
          <label class="block text-700 mb-2">Latitude</label>
          <pv-input-number
              class="w-full"
              v-model="latitude"
              mode="decimal"
              :useGrouping="false"
              :minFractionDigits="6"
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
              placeholder="-77.042793"
          />
        </div>
      </div>

      <div>
        <label class="block text-700 mb-2">Proximity</label>
        <pv-dropdown
            class="w-full"
            v-model="type"
            :options="typeOptions"
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
const type      = ref("store");
const showMapPicker = ref(false);

const clientOpts  = computed(() => props.clients ?? []);
const typeOptions = [
  { label: "Store",     value: "store" },
  { label: "Local",     value: "local" },
  { label: "Warehouse", value: "warehouse" }
];

watch(
    () => props.visible,
    (v) => {
      if (v) {
        clientId.value  = props.client?.id ?? null;
        address.value   = "";
        latitude.value  = null;
        longitude.value = null;
        type.value      = "store";
        showMapPicker.value = false; // SIEMPRE inicia oculto
      }
    },
    { immediate: true }
);

function submit() {
  if (!clientId.value || !address.value.trim()) return;

  emit("submit", {
    clientsId: clientId.value,
    address: address.value.trim(),
    type: type.value,
    latitude: latitude.value ?? null,
    longitude: longitude.value ?? null,
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
