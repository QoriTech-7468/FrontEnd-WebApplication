
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
          <div class="text-600">Add new users to your account</div>
        </div>
        
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="users-table">
          <thead>
          <tr>
            <th>Full name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Is Assigned</th>
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
            <td class="user-name">{{ user.fullname }}</td>
            <td class="user-email">{{ user.email }}</td>
            <td>
              <select v-model="user.role" class="select-input">
                <option value="Administrator">Administrator</option>
                <option value="Driver">Driver</option>
              </select>
            </td>
            <td>
                <span class="badge" :class="user.isAssigned ? 'badge-true' : 'badge-false'">
                  {{ user.isAssigned ? 'True' : 'False' }}
                </span>
            </td>
            <td class="actions-cell">
              <button class="delete-btn" @click="deleteUser(user.id)" title="Delete user">
                ✕
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

  <!-- Modal: Add User -->
  <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal animate-modal-up">
          <div class="modal-header">
            <h3>Add a new user</h3>
            <button class="close-btn" @click="showModal = false">✕</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label>Full name</label>
              <input
                  v-model="newUser.fullname"
                  placeholder="John Doe"
                  class="modal-input"
              />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input
                  v-model="newUser.email"
                  placeholder="john@example.com"
                  type="email"
                  class="modal-input"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Role</label>
                <select v-model="newUser.role" class="modal-select">
                  <option value="Administrator">Administrator</option>
                  <option value="Driver">Driver</option>
                </select>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" @click="showModal = false">Cancel</button>
            <button class="btn-save" @click="addUser">Save User</button>
          </div>
        </div>
      </div>
    </transition>

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
              <option value="Administrator">Administrator</option>
              <option value="Dispatcher">Dispatcher</option>
              <option value="Driver">Driver</option>
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
import useInvitationsStore from '../../../iam/application/invitations.store.js';
import useIamStore from '../../../iam/application/iam.store.js';
import OrganizationInvitationCard from '../components/organization-invitation-card.vue';

const API_URL = "http://localhost:3001/user";

const usersFromApi = ref([]);
const showModal = ref(false);

// Tabs
const activeTab = ref('members');

// Invitations
const invitationsStore = useInvitationsStore();
const iamStore = useIamStore();
const { invitations, invitationsLoaded } = storeToRefs(invitationsStore);
const { currentUserOrganizationId } = storeToRefs(iamStore);

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

const newUser = ref({
  fullname: "",
  email: "",
  role: "Driver",
  vehicleId: null
});

const users = computed(() => {
  return usersFromApi.value.map(user => ({
    ...user,
    isAssigned: user.vehicleId !== null
  }));
});

// --- FUNCIONES CRUD ---

const fetchUsers = async () => {
  try {
    const response = await fetch(API_URL);
    usersFromApi.value = await response.json();
    console.log('Datos de usuarios cargados desde el API:', usersFromApi.value);
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
  }
};

onMounted(async () => {
  fetchUsers();
  // Load organization invitations if on invitations tab
  if (activeTab.value === 'invitations') {
    await loadOrganizationInvitations();
  }
});

// Watch for tab changes to load invitations
watch(activeTab, async (newTab) => {
  if (newTab === 'invitations') {
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
    await invitationsStore.fetchOrganizationInvitations();
  } catch (error) {
    console.error('Error loading organization invitations:', error);
    invitationErrorMessage.value = 'Failed to load invitations. Please try again.';
  } finally {
    isLoadingInvitations.value = false;
  }
};

const addUser = async () => {
  if (newUser.value.fullname && newUser.value.email) {
    const userToSave = {
      ...newUser.value,
      password: ""
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userToSave)
      });
      const createdUser = await response.json();
      usersFromApi.value.push(createdUser);

      newUser.value = { fullname: "", email: "", role: "Driver", vehicleId: null };
      showModal.value = false;
    } catch (error) {
      console.error("Error al añadir el usuario:", error);
    }
  }
};

// BORRAR (DELETE)
const deleteUser = async (userId) => {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    try {
      await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });
      usersFromApi.value = usersFromApi.value.filter(user => user.id !== userId);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
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
      email: newInvitation.value.email,
      role: newInvitation.value.role,
      organizationId: currentUserOrganizationId.value
    };

    await invitationsStore.createInvitation(invitationData);
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
    await invitationsStore.rejectInvitation(id);
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
