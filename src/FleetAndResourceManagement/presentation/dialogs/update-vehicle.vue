<template>
  <pv-dialog
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      header="Edit Vehicle"
      modal
      style="width: 30rem"
      :closable="true"
  >
    <div class="flex flex-column gap-3">
      <div>
        <label class="block text-600 mb-1">License Plate</label>
        <pv-input-text
            v-model="localVehicle.plate"
            class="w-full"
            disabled
        />
      </div>

      <div>
        <label class="block text-600 mb-1">Capacity (kg)</label>
        <pv-input-text
            v-model="localVehicle.capacity"
            class="w-full"
            type="number"
        />
      </div>

      <div>
        <label class="block text-600 mb-1">Status</label>
        <pv-dropdown
            v-model="localVehicle.isActive"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select status"
            class="w-full"
        />
      </div>
    </div>

    <template #footer>
      <pv-button
          label="Cancel"
          class="p-button-text"
          @click="closeDialog"
      />
      <pv-button
          label="Save changes"
          icon="pi pi-check"
          @click="saveChanges"
      />
    </template>
  </pv-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  visible: Boolean,
  vehicle: Object,
});

const emits = defineEmits(["update:visible", "save"]);

const localVehicle = ref({ ...props.vehicle });
const statusOptions = [
  { label: "Enabled", value: "Enabled" },
  { label: "Disabled", value: "Disabled" },
];

watch(
    () => props.vehicle,
    (newVal) => {
      if (newVal) localVehicle.value = { ...newVal };
    }
);

function saveChanges() {
  emits("save", localVehicle.value);
}

function closeDialog() {
  emits("update:visible", false);
}
</script>
