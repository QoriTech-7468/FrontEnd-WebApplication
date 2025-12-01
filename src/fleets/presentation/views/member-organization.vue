
<template>
  <div>
    <!-- Header -->
    <div class="flex align-items-center justify-content-between mb-4">
      <div>
        <div class="text-900 text-3xl font-semibold">Organization Management</div>
        <div class="text-600">Manage members and invitations for your organization</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-container mb-4">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'members' }"
        @click="activeTab = 'members'"
      >
        Members
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'invitations' }"
        @click="activeTab = 'invitations'"
      >
        Invitations
      </button>
    </div>

    <!-- Tab Content: Members -->
    <div v-if="activeTab === 'members'" class="tab-content">
      <div class="flex align-items-center justify-content-between mb-2">
        <div class="mb-3">
          <div class="text-900 text-2xl font-semibold">Users</div>
          <div class="text-600">Manage organization members</div>
        </div>
        
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingUsers && !organizationUsersLoaded" class="empty-state">
        <div class="empty-icon">⏳</div>
        <p>Loading users...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="usersErrorMessage" class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>{{ usersErrorMessage }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="users.length === 0 && organizationUsersLoaded" class="empty-state">
        <div class="empty-icon">👥</div>
        <p>No users in organization</p>
        <p class="subtitle">Users will appear here once they accept invitations.</p>
      </div>

      <!-- Table -->
      <div v-else class="table-container">
        <table class="users-table">
          <thead>
          <tr>
            <th>Full name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(user, index) in users"
              :key="user.id"
              class="table-row"
              :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <td class="user-name">{{ formatUserName(user) }}</td>
            <td class="user-email">{{ user.email }}</td>
            <td>
              <select 
                v-if="!isOwner(user)"
                v-model="user.role" 
                class="select-input"
                @change="updateUserRole(user.id, user.role)"
                :disabled="isUpdatingRole === user.id"
              >
                <option value="Admin">Admin</option>
                <option value="Dispatcher">Dispatcher</option>
              </select>
              <span v-else class="role-text">Owner</span>
            </td>
            <td class="actions-cell">
              <button 
                v-if="!isOwner(user)"
                class="delete-btn" 
                @click="removeUser(user.id)" 
                title="Remove user from organization"
                :disabled="isRemovingUser === user.id"
              >
                {{ isRemovingUser === user.id ? '...' : '✕' }}
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab Content: Invitations -->
    <div v-if="activeTab === 'invitations'" class="tab-content">
      <div class="flex align-items-center justify-content-between mb-2">
        <div class="mb-3">
          <div class="text-900 text-2xl font-semibold">Invitations</div>
          <div class="text-600">Manage pending invitations for your organization</div>
        </div>
        <pv-button label="Send Invitation" icon="pi pi-plus-circle" class="font-medium" @click="showInvitationModal = true" />
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingInvitations && !invitationsLoaded" class="empty-state">
        <div class="empty-icon">⏳</div>
        <p>Loading invitations...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="invitationErrorMessage" class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>{{ invitationErrorMessage }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="pendingInvitations.length === 0 && invitationsLoaded" class="empty-state">
        <div class="empty-icon">📧</div>
        <p>No pending invitations</p>
        <p class="subtitle">Click "Send Invitation" to invite new members to your organization.</p>
      </div>

      <!-- Invitations List -->
      <div v-else class="invitations-list">
        <OrganizationInvitationCard
          v-for="invitation in pendingInvitations"
          :key="invitation.id"
          :invitation="invitation"
          :is-loading="loadingInvitationId !== null"
          :loading-id="loadingInvitationId"
          @cancel="cancelInvitation"
        />
      </div>
    </div>
  </div>

  <!-- Modal: Create Invitation -->
  <transition name="modal-fade">
    <div v-if="showInvitationModal" class="modal-overlay" @click.self="showInvitationModal = false">
      <div class="modal animate-modal-up">
        <div class="modal-header">
          <h3>Send Invitation</h3>
          <button class="close-btn" @click="showInvitationModal = false">✕</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>Email *</label>
            <input
                v-model="newInvitation.email"
                placeholder="user@example.com"
                type="email"
                class="modal-input"
                required
            />
          </div>

          <div class="form-group">
            <label>Role *</label>
            <select v-model="newInvitation.role" class="modal-select" required>
              <option value="">Select a role</option>
              <option value="Admin">Admin</option>
              <option value="Dispatcher">Dispatcher</option>
            </select>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="closeInvitationModal">Cancel</button>
          <button 
            class="btn-save" 
            @click="createInvitation"
            :disabled="isCreatingInvitation || !newInvitation.email || !newInvitation.role"
          >
            <span v-if="!isCreatingInvitation">Send Invitation</span>
            <span v-else>Sending...</span>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { storeToRefs } from 'pinia';
import useIamStore from '../../../iam/application/iam.store.js';
import OrganizationInvitationCard from '../components/organization-invitation-card.vue';

// Tabs
const activeTab = ref('members');

// Organization users
const isLoadingUsers = ref(false);
const usersErrorMessage = ref(null);
const isUpdatingRole = ref(null);
const isRemovingUser = ref(null);

// IAM Store
const iamStore = useIamStore();
const { invitations, invitationsLoaded, currentUserOrganizationId, organizationUsers, organizationUsersLoaded, currentUserRole } = storeToRefs(iamStore);

const showInvitationModal = ref(false);
const isCreatingInvitation = ref(false);
const isLoadingInvitations = ref(false);
const loadingInvitationId = ref(null);
const invitationErrorMessage = ref(null);

const newInvitation = ref({
  email: "",
  role: ""
});

// Filter pending invitations
const pendingInvitations = computed(() => {
  return invitations.value.filter(inv => 
    inv.status && inv.status.toLowerCase() === 'pending'
  );
});

// Format user name from name and surname
const formatUserName = (user) => {
  const parts = []
  if (user.name) parts.push(user.name)
  if (user.surname) parts.push(user.surname)
  return parts.length > 0 ? parts.join(' ') : 'N/A'
}

// Computed users with formatted data
const users = computed(() => {
  return organizationUsers.value.map(user => ({
    ...user,
    fullname: formatUserName(user)
  }));
});

// Check if user is owner
const isOwner = (user) => {
  return user.role?.toLowerCase() === 'owner';
};

// --- FUNCIONES CRUD ---

// Load organization users
const loadOrganizationUsers = async () => {
  if (!currentUserOrganizationId.value) {
    usersErrorMessage.value = 'No organization ID found. Please create an organization first.';
    return;
  }

  try {
    isLoadingUsers.value = true;
    usersErrorMessage.value = null;
    await iamStore.fetchOrganizationUsers();
  } catch (error) {
    console.error('Error loading organization users:', error);
    usersErrorMessage.value = 'Failed to load users. Please try again.';
  } finally {
    isLoadingUsers.value = false;
  }
};

onMounted(async () => {
  // Load organization users if on members tab
  if (activeTab.value === 'members') {
    await loadOrganizationUsers();
  }
  // Load organization invitations if on invitations tab
  if (activeTab.value === 'invitations') {
    await loadOrganizationInvitations();
  }
});

// Watch for tab changes to load data
watch(activeTab, async (newTab) => {
  if (newTab === 'members') {
    await loadOrganizationUsers();
  } else if (newTab === 'invitations') {
    await loadOrganizationInvitations();
  }
});

// Load organization invitations
const loadOrganizationInvitations = async () => {
  if (!currentUserOrganizationId.value) {
    invitationErrorMessage.value = 'No organization ID found. Please create an organization first.';
    return;
  }

  try {
    isLoadingInvitations.value = true;
    invitationErrorMessage.value = null;
    await iamStore.fetchOrganizationInvitations();
  } catch (error) {
    console.error('Error loading organization invitations:', error);
    invitationErrorMessage.value = 'Failed to load invitations. Please try again.';
  } finally {
    isLoadingInvitations.value = false;
  }
};

// Update user role
const updateUserRole = async (userId, newRole) => {
  if (!newRole || (newRole !== 'Admin' && newRole !== 'Dispatcher')) {
    alert('Invalid role. Role must be Admin or Dispatcher.');
    return;
  }

  try {
    isUpdatingRole.value = userId;
    usersErrorMessage.value = null;
    await iamStore.updateUserRole(userId, newRole);
    console.log(`User ${userId} role updated to ${newRole}`);
  } catch (error) {
    console.error(`Error updating user role ${userId}:`, error);
    usersErrorMessage.value = 'Failed to update user role. Please try again.';
    // Reload users to revert the change
    await loadOrganizationUsers();
  } finally {
    isUpdatingRole.value = null;
  }
};

// Remove user from organization
const removeUser = async (userId) => {
  if (!confirm('Are you sure you want to remove this user from the organization?')) {
    return;
  }

  try {
    isRemovingUser.value = userId;
    usersErrorMessage.value = null;
    await iamStore.removeUserFromOrganization(userId);
    console.log(`User ${userId} removed from organization successfully`);
  } catch (error) {
    console.error(`Error removing user ${userId} from organization:`, error);
    usersErrorMessage.value = 'Failed to remove user. Please try again.';
  } finally {
    isRemovingUser.value = null;
  }
};

// Invitations functions
const closeInvitationModal = () => {
  showInvitationModal.value = false;
  newInvitation.value = {
    email: "",
    role: ""
  };
};

const createInvitation = async () => {
  if (!newInvitation.value.email || !newInvitation.value.role) {
    alert('Email and role are required');
    return;
  }

  if (!currentUserOrganizationId.value) {
    alert('Error: No organization ID found. Please create an organization first.');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newInvitation.value.email)) {
    alert('Please enter a valid email address');
    return;
  }

  isCreatingInvitation.value = true;

  try {
    const invitationData = {
      userEmail: newInvitation.value.email,
      role: newInvitation.value.role
    };

    console.log('📤 Creating invitation with data:', invitationData);
    await iamStore.createInvitation(invitationData);
    closeInvitationModal();
    // Reload invitations
    await loadOrganizationInvitations();
  } catch (error) {
    console.error('Error creating invitation:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Error creating invitation';
    alert(`Error: ${errorMessage}`);
  } finally {
    isCreatingInvitation.value = false;
  }
};

const cancelInvitation = async (id) => {
  if (!confirm('Are you sure you want to cancel this invitation?')) {
    return;
  }

  try {
    loadingInvitationId.value = id;
    invitationErrorMessage.value = null;
    await iamStore.rejectInvitation(id);
    console.log(`Invitation ${id} cancelled successfully`);
  } catch (error) {
    console.error(`Error cancelling invitation ${id}:`, error);
    invitationErrorMessage.value = 'Failed to cancel invitation. Please try again.';
  } finally {
    loadingInvitationId.value = null;
  }
};
</script>

<style scoped>
/* ===== ANIMACIONES ===== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes modalUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-modal-up {
  animation: modalUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.table-row {
  animation: fadeInUp 0.5s ease-out both;
}

/* Modal transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ===== ESTILOS BASE ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ===== CONTENT ===== */

/* ===== TABS ===== */
.tabs-container {
  display: flex;
  gap: 12px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: #1f2937;
}

.tab-btn.active {
  color: #004080;
  border-bottom-color: #004080;
  font-weight: 600;
}

.tab-content {
  min-height: 400px;
}

/* Empty state for invitations */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state .subtitle {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #9ca3af;
}

/* Invitations list */
.invitations-list {
  max-width: 100%;
}

/* ===== BUTTON STYLES ===== */
:deep(.p-button) {
  padding: 12px 20px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(4, 56, 115, 0.2) !important;
}

:deep(.p-button:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(4, 56, 115, 0.3) !important;
}

:deep(.p-button:active) {
  transform: translateY(0) !important;
}

/* ===== TABLE ===== */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.users-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.users-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.users-table tbody tr:hover {
  background: #f9fafb;
  transform: scale(1.001);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.users-table td {
  padding: 16px 20px;
  font-size: 14px;
  color: #374151;
}

.user-name {
  font-weight: 500;
  color: #1f2937;
}

.user-email {
  color: #6b7280;
}

.select-input {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
}

.select-input:hover {
  border-color: #d1d5db;
}

.select-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.role-text {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.badge-true {
  background: #d1fae5;
  color: #065f46;
}

.badge-false {
  background: #fee2e2;
  color: #991b1b;
}

/* ===== ACTIONS CELL ===== */
.actions-cell {
  text-align: center;
  width: 80px;
}

.delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.delete-btn:hover {
  opacity: 1;
  background: #fecaca;
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
}

.delete-btn:active {
  transform: scale(0.95) rotate(90deg);
}

.table-row:hover .delete-btn {
  opacity: 1;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px 28px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #374151;
}

.modal-input,
.modal-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  transition: all 0.2s ease;
}

.modal-input:focus,
.modal-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.modal-input::placeholder {
  color: #9ca3af;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.checkbox-label:hover {
  background: #f9fafb;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4f46e5;
}

.checkbox-text {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 28px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-save {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.btn-cancel:hover {
  background: #f3f4f6;
  color: #374151;
}

.btn-save {
  background: #4f46e5;
  color: white;
}

.btn-save:hover {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}


/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .header-left {
    width: 100%;
  }

  .add-btn {
    width: 100% !important;
    align-self: stretch;
  }


  .table-container {
    overflow-x: auto;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
