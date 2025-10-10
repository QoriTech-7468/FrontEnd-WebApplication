<template>
  <Dialog v-model:visible="modelVisible" header="New vehicle" modal style="width: 520px">
    <div class="flex flex-column gap-3">

      <form @submit.prevent="saveVehicle">
      <div>
        <label class="block text-700 mb-2">Licence plate</label>
        <InputText v-model="form.plate" class="w-full" placeholder="ABC-123" />
      </div>

      <div>
        <label class="block text-700 mb-2">Load capacity (kg)</label>
        <InputNumber v-model="form.capacity" :min="0" :useGrouping="false" inputClass="w-full" class="w-full" placeholder="1500"  />
      </div>

      <div>
        <Button label="Deactivate" class="w-full mb-2" severity="danger" text />
        <Button label="Confirm" class="w-full" severity="warning" type="submit"/>
      </div>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import {useRoute} from "vue-router";

import useStore from "../../application/fleet-resource-management.store.js";
import {Vehicle} from "../../domain/model/vehicle.entity.js";

const props = defineProps({ visible: Boolean });
const emit  = defineEmits(["update:visible"]);
const isEdit = computed(() => !!route.params.id);
const route = useRoute();

const store = useStore();
const { errors, addVehicles} = store;

const saveVehicle = () => {
  const vehicle = new Vehicle({ id: isEdit.value ? route.params.id : null, plate: form.value.plate,capacity: form.value.capacity, availability:"Active"});
  addVehicles(vehicle);
}

const modelVisible = computed({
  get: () => props.visible,
  set: v => emit("update:visible", v)
});

const form = ref({ plate: "", capacity: null });
</script>


<style scoped>

</style>