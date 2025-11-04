<template>
  <Dialog v-model:visible="modelVisible" header="New Client" modal style="width: 520px">

      <div class="flex flex-column gap-3">
        <form @submit.prevent="saveClients">
          <div>
            <label class="block text-700 mb-2">Company name</label>
            <pv-input-text v-model="form.name" class="w-full" placeholder="Company name" />
          </div>
          <div class="mt-2">
            <Button label="Confirm" class="w-full" severity="warning" type="submit"/>
          </div>
        </form>
      </div>

  </Dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import {useRoute} from "vue-router";

import customerStore from "/src/CustomerAndLocationManagement/application/customer-location-management.store.js";
import {Client} from "../../domain/model/client.entity.js";

const props = defineProps({ visible: Boolean });
const emit  = defineEmits(["update:visible"]);
const isEdit = computed(() => !!route.params.id);

const route = useRoute();

const store = customerStore();
const { errors, addClients } = store;

const saveClients = () => {
  const client = new Client({ id: isEdit.value ? route.params.id : null, name: form.value.name,isActive: true});
  addClients(client);
}

const modelVisible = computed({
  get: () => props.visible,
  set: v => emit("update:visible", v)
});

const form = ref({ name: "" });
</script>
