<template>
  <pv-dialog
      v-model:visible="localVisible"
      header="Edit Client"
      modal
      :style="{ width: '25rem' }"
  >
    <div class="p-fluid">
      <div class="field">
        <label for="name">New Client Name</label>
        <pv-input-text id="name" class= "w-full" v-model="localClient.name" />
      </div>

      <div class="field">
        <label for="status">Change Status</label>
        <pv-dropdown
            id="status"
            class="w-full"
            v-model="localClient.isActive"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select status"
        />
      </div>
    </div>

    <template #footer>
      <pv-button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
      <pv-button label="Save" icon="pi pi-check" class="p-button-primary" @click="saveChanges" />
    </template>
  </pv-dialog>
</template>

<script setup>
import { ref, watch, computed  } from 'vue'
import { useToast } from 'primevue/usetoast'
import  customerStore  from '/src/crm/application/customer-location-management.store.js'

const props = defineProps({
  visible: Boolean,
  client: Object
})
const emit = defineEmits(['update:visible', 'saved'])

const store = customerStore()
const toast = useToast()

// ✅ Computed bidireccional para evitar el error
const localVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const localClient = ref({ id: null, name: '', isActive: true })
const statusOptions = [
  { label: 'Active', value: true },
  { label: 'Disabled', value: false }
]

watch(() => props.client, (newClient) => {
  if (newClient) localClient.value = { ...newClient }
}, { immediate: true })

function closeDialog() {
  localVisible.value = false
}

async function saveChanges() {
  try {
    const cleanClient = {
      id: localClient.value.id,
      name: localClient.value.name.trim(),
      isActive: localClient.value.isActive
    };

    await store.updateClients(cleanClient);

    toast.add({
      severity: 'success',
      summary: 'Client updated',
      detail: `${cleanClient.name} saved successfully`,
      life: 2500
    });

    emit('saved', cleanClient);
    closeDialog();
  } catch (err) {
    console.error(err);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Could not update client',
      life: 3000
    });
  }
}
</script>