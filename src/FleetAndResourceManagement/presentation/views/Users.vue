
<template>
  <div>
      <div class="flex align-items-center justify-content-between mb-2">
        <div class="mb-3">
          <div class="text-900 text-3xl font-semibold">Users</div>
          <div class="text-600">Add new users to your account</div>
        </div>
         <pv-button label="Add user" icon="pi pi-plus-circle" class="font-medium" @click="showModal = true" />
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="users-table">
          <thead>
          <tr>
            <th>Full name</th>
            <th>Email</th>
            <th>Permission</th>
            <th>Status</th>
            <th>Is Assigned</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(user, index) in users"
              :key="index"
              class="table-row"
              :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <td class="user-name">{{ user.fullname }}</td>
            <td class="user-email">{{ user.email }}</td>
            <td>
              <select v-model="user.permission" class="select-input">
                <option value="Administrator">Administrator</option>
                <option value="Driver">Driver</option>
                <option value="Client">Client</option>
              </select>
            </td>
            <td>
              <select v-model="user.status" class="select-input" @change="handleStatusChange(user)">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </td>
            <td>
                <span class="badge" :class="user.isAssigned ? 'badge-true' : 'badge-false'">
                  {{ user.isAssigned ? 'True' : 'False' }}
                </span>
            </td>
            <td class="actions-cell">
              <button class="delete-btn" @click="deleteUser(index)" title="Delete user">
                ✕
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
  </div>

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
                <label>Permission</label>
                <select v-model="newUser.permission" class="modal-select">
                  <option value="Administrator">Administrator</option>
                  <option value="Driver">Driver</option>
                  <option value="Client">Client</option>
                </select>
              </div>

              <div class="form-group">
                <label>Status</label>
                <select v-model="newUser.status" class="modal-select">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <label class="checkbox-label">
              <input type="checkbox" v-model="newUser.isAssigned" class="checkbox-input" />
              <span class="checkbox-text">Assigned to route</span>
            </label>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" @click="showModal = false">Cancel</button>
            <button class="btn-save" @click="addUser">Save User</button>
          </div>
        </div>
      </div>
    </transition>
</template>

<script setup>
import { ref } from "vue"
import Navbar from "../../../shared/presentation/components/Navbar.vue";

const currentTab = ref("Users")

const users = ref([
  { fullname: "Jose Cruz Camina Nuñez", email: "jose@rutana.com", permission: "Administrator", status: "Active", isAssigned: true },
  { fullname: "Jose Cruz Camina Nuñez", email: "jose@rutana.com", permission: "Administrator", status: "Active", isAssigned: true },
  { fullname: "Jose Cruz Camina Nuñez", email: "jose@rutana.com", permission: "Administrator", status: "Active", isAssigned: true }
])

const showModal = ref(false)
const newUser = ref({
  fullname: "",
  email: "",
  permission: "Client",
  status: "Active",
  isAssigned: false
})

const addUser = () => {
  if (newUser.value.fullname && newUser.value.email) {
    users.value.push({ ...newUser.value })
    newUser.value = { fullname: "", email: "", permission: "Client", status: "Active", isAssigned: false }
    showModal.value = false
  }
}

const deleteUser = (index) => {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    users.value.splice(index, 1)
  }
}

const handleStatusChange = (user) => {
  // Si el status cambia a Inactive, isAssigned se pone en false
  if (user.status === 'Inactive') {
    user.isAssigned = false
  }
  else if (user.status === 'Active'){
    user.isAssigned = true
  }
}
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