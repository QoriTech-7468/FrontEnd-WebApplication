<template>
  <div class="invitation-item">
    <div class="invitation-details">
      <span class="invitation-id" v-if="invitation.id">Invitation ID: {{ invitation.id }}</span>
      <span class="invitation-email" v-if="invitation.user && invitation.user.email">
        Email: {{ invitation.user.email }}
      </span>
      <span class="invitation-name" v-if="invitation.user && (invitation.user.name || invitation.user.surname)">
        Name: {{ formatUserName(invitation.user) }}
      </span>
      <span class="invitation-role" v-if="invitation.user && invitation.user.role">
        Role: {{ invitation.user.role }}
      </span>
      <span class="invitation-status">
        Status: <span class="status-badge" :class="statusClass">{{ invitation.status }}</span>
      </span>
      <span class="invitation-date" v-if="invitation.createdAt">
        Created: {{ formatDate(invitation.createdAt) }}
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

defineEmits(['cancel'])

const isProcessing = computed(() => {
  return props.isLoading && props.loadingId !== null
})

const statusClass = computed(() => {
  const status = props.invitation.status?.toLowerCase() || ''
  return {
    'status-pending': status === 'pending',
    'status-accepted': status === 'accepted',
    'status-rejected': status === 'rejected' || status === 'cancelled'
  }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatUserName = (user) => {
  if (!user) return ''
  const parts = []
  if (user.name) parts.push(user.name)
  if (user.surname) parts.push(user.surname)
  return parts.length > 0 ? parts.join(' ') : 'N/A'
}
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
  transition: all 0.2s ease;
}

.invitation-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.invitation-details {
  flex: 1;
}

.invitation-id {
  display: block;
  font-weight: bold;
  color: #004080;
  margin-bottom: 0.5rem;
}

.invitation-email,
.invitation-name,
.invitation-role,
.invitation-user-id,
.invitation-status,
.invitation-date {
  display: block;
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.invitation-email {
  font-weight: 500;
  color: #1f2937;
}

.invitation-name {
  color: #374151;
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-accepted {
  background: #d1fae5;
  color: #065f46;
}

.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}

.invitation-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  background-color: #dc3545;
  color: white;
  transition: all 0.2s ease;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-1px);
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

