<template>
  <Dialog v-model:visible="modelVisible" header="New Location" modal style="width: 520px">
    <div class="flex flex-column gap-3">
      <div>
        <label class="block text-700 mb-2">Client</label>
        <Dropdown class="w-full" v-model="clientId" :options="clientOpts" optionLabel="name" optionValue="id" placeholder="Select a Customer" />
      </div>
      <div>
        <label class="block text-700 mb-2">Type</label>
        <Dropdown class="w-full" v-model="type" :options="types" placeholder="Select a Type" />
      </div>
      <div class="mt-2">
        <Button label="Confirm" class="w-full" severity="warning" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

const props = defineProps({
  visible: Boolean,
  clients: { type: Array, default: () => [] }
});
const emit = defineEmits(["update:visible"]);

const modelVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v)
});

const clientId = ref(null);
const type = ref(null);
const types = ["Viajero","Local","Temporal"];
const clientOpts = computed(() => props.clients);
</script>
