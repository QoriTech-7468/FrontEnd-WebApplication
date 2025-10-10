<template>
  <Dialog v-model:visible="modelVisible" :header="$t('clients.register')" modal style="width: 520px">
    <div class="flex flex-column gap-3">
      <div>
        <label class="block text-700 mb-2">{{ $t('clients.company') }}</label>
        <InputText v-model="name" class="w-full" :placeholder="$t('clients.company')" />
      </div>
      <div class="mt-2">
        <Button :label="$t('clients.newLocation.confirm')" class="w-full" severity="warning" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const props = defineProps({ visible: Boolean });
const emit = defineEmits(["update:visible"]);

const modelVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v)
});

const name = ref("");
</script>
