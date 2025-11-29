<template>
  <div class="invitation-item">
    <div class="invitation-details">
      <span class="invitation-id" v-if="invitation.id">Invitation ID: {{ invitation.id }}</span>
      <span class="invitation-user" v-if="invitation.user">
        {{ invitation.user.name }} {{ invitation.user.surname }} 
        <span v-if="invitation.user.role">({{ invitation.user.role }})</span>
      </span>
      <span class="invitation-organization" v-if="invitation.organization">
        Organization: {{ invitation.organization.name }}
      </span>
    </div>
    <div class="invitation-actions">
      <button 
        class="btn-cancel" 
        @click="$emit('cancel', invitation.id)"
        :disabled="isProcessing"
      >
        {{ props.isLoading && props.loadingId === invitation.id ? 'Processing...' : 'Cancel' }}
      </button>
      <button 
        class="btn-accept" 
        @click="$emit('accept', invitation.id)"
        :disabled="isProcessing"
      >
        {{ props.isLoading && props.loadingId === invitation.id ? 'Processing...' : 'Accept' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  invitation: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  loadingId: {
    type: [Number, String],
    default: null
  }
})

defineEmits(['accept', 'cancel'])

const isProcessing = computed(() => {
  return props.isLoading && props.loadingId !== null
})
</script>

<style scoped>
.invitation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.invitation-details {
  flex: 1;
}

.invitation-id {
  display: block;
  font-weight: bold;
  color: #004080;
}

.invitation-user, .invitation-organization {
  display: block;
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.invitation-organization {
  font-weight: 600;
  color: #004080;
}

.invitation-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-cancel, .btn-accept {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-cancel {
  background-color: #dc3545;
  color: white;
}

.btn-accept {
  background-color: #28a745;
  color: white;
}

.btn-cancel:hover, .btn-accept:hover {
  opacity: 0.8;
}

.btn-cancel:disabled, .btn-accept:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

