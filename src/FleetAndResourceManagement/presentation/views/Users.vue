<template>

  <!-- Main Content -->
  <div class="p-6 max-w-6xl mx-auto">

    <!-- Users Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="flex align-items-center justify-content-between mb-5">
        <div>
          <div class="text-2xl font-semibold text-gray-900">Users</div>
          <div class="text-gray-600 text-sm">Invite users to your company</div>
        </div>
        <pv-button
            label="Invite user"
            icon="pi pi-plus"
            class="p-button-sm font-medium"
            style="background: #043873; border: none;"
            @click="showModal = true"
        />
      </div>

      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Full name</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in activeUsers" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-4 px-4 font-medium text-gray-900">{{ user.fullname }}</td>
            <td class="py-4 px-4 text-gray-600">{{ user.email }}</td>
            <td class="py-4 px-4">
              <select v-model="user.role" @change="updateUserRole(user)" class="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Administrator">Administrator</option>
                <option value="Transportista">Transportista</option>
              </select>
            </td>
            <td class="py-4 px-4 text-right">
              <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-700 text-sm font-medium">
                Remove
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Invitations Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="mb-5">
        <div class="text-xl font-semibold text-gray-900">Invitations</div>
        <div class="text-gray-600 text-sm">Pendant invitations</div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Full name</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="inv in invitations" :key="inv.email" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="py-4 px-4 font-medium text-gray-900">{{ inv.fullname }}</td>
            <td class="py-4 px-4 text-gray-600">{{ inv.email }}</td>
            <td class="py-4 px-4">
              <select :value="inv.role" disabled class="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50 text-gray-500 cursor-not-allowed">
                <option value="Administrator">Administrator</option>
                <option value="Transportista">Transportista</option>
              </select>
            </td>
            <td class="py-4 px-4 text-right">
              <button @click="cancelInvitation(inv.email)" class="text-red-600 hover:text-red-700 text-sm font-medium">
                Cancel invitation
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <transition name="modal-fade">
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal animate-modal-up">
        <div class="modal-header">
          <h3>Invite a new user</h3>
          <button class="close-btn" @click="showModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Full name</label>
            <input v-model="newUser.fullname" placeholder="Jhon Doe Carrera Nuñez" class="modal-input" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="newUser.email" type="email" placeholder="jhon@gmail.com" class="modal-input" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select v-model="newUser.role" class="modal-select">
              <option value="Administrator">Administrator</option>
              <option value="Transportista">Transportista</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showModal = false">Cancel</button>
          <button class="btn-save" @click="sendInvitation">Send invitation</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const API_URL = "http://localhost:3001/user";
const usersFromApi = ref([]);
const showModal = ref(false);

const newUser = ref({
  fullname: "",
  email: "",
  role: "Transportista"
});

const activeUsers = computed(() =>
    usersFromApi.value.filter(u => u.status !== 'Pending')
);

const invitations = computed(() =>
    usersFromApi.value.filter(u => u.status === 'Pending')
);

const fetchUsers = async () => {
  try {
    const res = await fetch(API_URL);
    usersFromApi.value = await res.json();
  } catch (err) {
    console.error("Error loading users:", err);
  }
};

onMounted(fetchUsers);

const sendInvitation = async () => {
  if (!newUser.value.fullname || !newUser.value.email) return;

  const invitation = {
    ...newUser.value,
    status: "Pending"
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invitation)
    });
    const data = await res.json();
    usersFromApi.value.push(data);
    resetModal();
  } catch (err) {
    console.error("Error sending invitation:", err);
  }
};

const cancelInvitation = async (email) => {
  const user = usersFromApi.value.find(u => u.email === email);
  if (!user) return;

  try {
    await fetch(`${API_URL}/${user.id}`, { method: 'DELETE' });
    usersFromApi.value = usersFromApi.value.filter(u => u.email !== email);
  } catch (err) {
    console.error("Error canceling invitation:", err);
  }
};

const deleteUser = async (id) => {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    usersFromApi.value = usersFromApi.value.filter(u => u.id !== id);
  } catch (err) {
    console.error("Error deleting user:", err);
  }
};

const updateUserRole = async (user) => {
  try {
    await fetch(`${API_URL}/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: user.role })
    });
  } catch (err) {
    console.error("Error updating role:", err);
  }
};

const resetModal = () => {
  newUser.value = { fullname: "", email: "", role: "Transportista" };
  showModal.value = false;
};
</script>

<style scoped>
/* Header */
.logo-icon {
  background: #fbbf24;
  color: #1e293b;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 18px;
}

/* Modal Animations */
@keyframes modalUp {
  from { opacity: 0; transform: translateY(50px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-modal-up { animation: modalUp 0.3s ease-out; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.modal-body { padding: 24px; }

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.modal-input, .modal-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.modal-input:focus, .modal-select:focus {
  outline: none;
  border-color: #1e293b;
  box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel, .btn-save {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-cancel {
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-cancel:hover { background: #f3f4f6; }

.btn-save {
  background: #1e293b;
  color: white;
}

.btn-save:hover { background: #0f172a; }
</style>