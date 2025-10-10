<template>
  <Dialog v-model:visible="modelVisible" header="New vehicle" modal style="width: 520px">
    <div class="flex flex-column gap-3">
      <form @submit.prevent="saveVehicle">
        <div>
          <label class="block text-700 mb-2">Licence plate</label>
          <InputText v-model="form.plate" class="w-full" placeholder="ABC-123" required />
        </div>

        <div>
          <label class="block text-700 mb-2">Load capacity (kg)</label>
          <InputNumber v-model="form.capacity" :min="0" :useGrouping="false" inputClass="w-full" class="w-full" placeholder="1500" required />
        </div>

        <div>
          <Button label="Cancel" class="w-full mb-2 p-button-text" severity="secondary" @click="closeDialog" type="button"/>
          <Button label="Confirm" class="w-full" severity="warning" type="submit"/>
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";

const props = defineProps({ visible: Boolean });
const emit = defineEmits(["update:visible", "save-vehicle"]);

//  formulario
const form = ref({ plate: "", capacity: null });

const saveVehicle = () => {
  // Creamos el objeto del vehículo.
  const vehicleData = {
    plate: form.value.plate,
    capacity: form.value.capacity,
    isActive: 'Enabled'
  };
  emit('save-vehicle', vehicleData);
};

// visibilidad del diálogo
const modelVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value)
});

const closeDialog = () => {
  emit('update:visible', false);
};

// Limpia el formulario
watch(() => props.visible, (isVisible) => {
  if (!isVisible) {
    form.value = { plate: "", capacity: null };
  }
});
</script>