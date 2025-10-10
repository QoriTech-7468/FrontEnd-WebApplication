<template>
  <Dialog
      header="Add Team Member"
      :visible="visible"
      :modal="true"
      :style="{ width: '450px' }"
      @update:visible="closeDialog"
  >
    <div class="p-fluid">
      <div class="field">
        <label for="member">Select a Team Member</label>
        <Dropdown
            id="member"
            v-model="selectedUser"
            :options="availableUsers"
            optionLabel="fullname"
            placeholder="Select a user"
            dataKey="id"  class="w-full"
        />
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
      <Button label="Assign" icon="pi pi-user-plus" @click="assignMember" :disabled="!selectedUser" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

const props = defineProps({
  visible: Boolean,
  availableUsers: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(['update:visible', 'assign-member']);

//  Estado local
const selectedUser = ref(null);

// Funciones
function assignMember() {
  console.log('¡Botón "Assign" del DIÁLOGO fue clickeado!');
  if (selectedUser.value) {
    emit('assign-member', selectedUser.value);
    closeDialog();
  }
}

function closeDialog() {
  selectedUser.value = null; // Limpiar selección
  emit('update:visible', false);
}
</script>