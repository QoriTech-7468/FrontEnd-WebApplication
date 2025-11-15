<template>
  <Dialog v-model:visible="modelVisible" header="Edit Location" modal>
    <div class="flex flex-column gap-3">

      <div>
        <label>Address</label>
        <pv-input-text class="w-full" v-model="form.address" disabled />
      </div>

      <div>
        <label>Proximity</label>
        <pv-dropdown
            class="w-full"
            v-model="form.proximity"
            :options="[
            { label:'Close', value:'close' },
            { label:'Mid', value:'mid' },
            { label:'Far', value:'far' }
          ]"
        />
      </div>

      <div>
        <label>Status</label>
        <pv-dropdown
            class="w-full"
            v-model="form.isActive"
            :options="[
            { label:'Active', value:true },
            { label:'Disabled', value:false }
          ]"
        />
      </div>

      <pv-button label="Save changes" class="w-full" @click="submit" />
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  visible: Boolean,
  location: Object,
});

const emit = defineEmits(["update:visible", "save"]);

const modelVisible = computed({
  get: () => props.visible,
  set: v => emit("update:visible", v)
});

const form = ref({
  id: null,
  proximity: "mid",
  isActive: true,
  address: "",
});

watch(() => props.location, (loc) => {
  if (!loc) return;
  form.value = { ...loc };
});

function submit() {
  emit("save", { ...form.value });
}
</script>