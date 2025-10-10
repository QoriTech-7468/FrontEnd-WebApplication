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
            placeholder="Select a Customer"
        />
      </div>

      <div>
        <label class="block text-700 mb-2">Address</label>
        <pv-input-text class="w-full" v-model.trim="address" placeholder="Av. ..." />
      </div>

      <div class="grid">
        <div class="col-6">
          <label class="block text-700 mb-2">Latitude</label>
          <pv-input-number class="w-full" v-model="latitude" :useGrouping="false" mode="decimal" />
        </div>
        <div class="col-6">
          <label class="block text-700 mb-2">Longitude</label>
          <pv-input-number class="w-full" v-model="longitude" :useGrouping="false" mode="decimal" />
        </div>
      </div>

      <div>
        <label class="block text-700 mb-2">Type</label>
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
const latitude  = ref(null);
const longitude = ref(null);
const type      = ref("store");

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
      }
    },
    { immediate: true }
);

function submit() {
  if (!clientId.value) return;
  if (!address.value.trim()) return;

  emit("submit", {
    clientsId: clientId.value,
    address: address.value.trim(),
    type: type.value,
    latitude: latitude.value ?? null,
    longitude: longitude.value ?? null,
    isActive: true
  });
}
</script>

