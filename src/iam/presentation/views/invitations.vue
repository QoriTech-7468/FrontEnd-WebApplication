<template>
  <!-- Header superior -->
  <header class="topbar">
    <div class="topbar-right">
      <!-- Botón Purchase -->
      <button class="btn-purchase" @click="openPurchaseModal">
        Purchase
      </button>

      <!-- Botón Usuario con desplegable -->
      <div class="user-dropdown">
        <button class="btn-user" @click="toggleUserMenu">
          {{ userName }}
          <span class="arrow">▼</span>
        </button>

        <div v-if="isUserMenuOpen" class="dropdown-menu">
          <button class="dropdown-item" @click="signOut">
            Sign out
          </button>
        </div>
      </div>
    </div>
  </header>

  <div class="invitations-container">
    <!-- MODAL: Select Plan -->
    <div v-if="isPurchaseModalOpen" class="modal-overlay">
      <div class="modal-card">
        <h2>Choose your plan</h2>

        <div class="plans">
          <button
              class="plan-btn"
              :class="{ active: selectedPlan === 'Starter' }"
              @click="selectedPlan = 'Starter Plan'"
          >
            Starter Plan
          </button>

          <button
              class="plan-btn"
              :class="{ active: selectedPlan === 'Professional' }"
              @click="selectedPlan = 'Professional Plan'"
          >
            Professional Plan
          </button>

          <button
              class="plan-btn"
              :class="{ active: selectedPlan === 'Enterprise' }"
              @click="selectedPlan = 'Enterprise Plan'"
          >
            Enterprise Plan
          </button>
        </div>

        <button
            class="btn-primary"
            :disabled="!selectedPlan"
            @click="openOrgModal"
        >
          Create Organization
        </button>

        <button class="btn-secondary" @click="closePurchaseModal">
          Cancel
        </button>
      </div>
    </div>
    <!-- MODAL: Create Organization -->
    <div v-if="isOrgModalOpen" class="modal-overlay">
      <div class="modal-card">
        <h2>Create Organization</h2>

        <input
            type="text"
            placeholder="Company Name *"
            v-model="companyName"
        />

        <input
            type="text"
            placeholder="RUC *"
            v-model="companyRuc"
        />

        <input
            type="text"
            placeholder="Manager Name (optional)"
            v-model="managerName"
        />

        <button class="btn-primary" @click="createOrganization">
          Create
        </button>

        <button class="btn-secondary" @click="closeOrgModal">
          Cancel
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <main class="invitations-main">
      <h1>Invitations</h1>

      <!-- Estado: Sin invitaciones -->
      <div v-if="invitations.length === 0" class="empty-state">
        <div class="empty-icon">📧</div> <!-- Ícono de sobre (puedes usar SVG o FontAwesome) -->
        <p>You don't have any invitations yet</p>
        <p class="subtitle">Ask your company owner or administrator to add you using your email address.</p>
      </div>

      <!-- Estado: Con invitaciones -->
      <div v-else class="invitations-list">
        <div v-for="invitation in invitations" :key="invitation.id" class="invitation-item">
          <div class="invitation-details">
            <span class="invitation-code">Invitation Code: {{ invitation.code }}</span>
            <span class="invitation-email">{{ invitation.email }}</span>
          </div>
          <div class="invitation-actions">
            <button class="btn-cancel" @click="cancelInvitation(invitation.id)">Cancel</button>
            <button class="btn-accept" @click="acceptInvitation(invitation.id)">Accept</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import useIamStore from '../application/iam.store.js'
import { storeToRefs } from 'pinia'

const router = useRouter()
const iamStore = useIamStore()
const { currentUserName, currentUserSurname } = storeToRefs(iamStore)

// Datos de ejemplo (reemplaza con fetch de API)
const invitations = ref([
  {
    id: 1,
    code: 'INV000001',
    email: 'user@example.com'
  }
  // Agrega más objetos para más invitaciones
])

// Funciones de manejo de acciones
const cancelInvitation = (id) => {
  // Lógica para cancelar: e.g., API call, remove from list
  invitations.value = invitations.value.filter(inv => inv.id !== id)
  console.log(`Invitation ${id} cancelled`)
}

const acceptInvitation = (id) => {
  console.log(`[DEBUG] Invitation ${id} accepted`);
  // redirige a layout (ruta padre). Usamos nombre de ruta para evitar problemas de path
  router.push({ name: 'management' });
};

// Obtener nombre de usuario del store
const userName = computed(() => {
  if (currentUserName.value && currentUserSurname.value) {
    return `${currentUserName.value} ${currentUserSurname.value}`
  } else if (currentUserName.value) {
    return currentUserName.value
  }
  return 'User'
})

const isUserMenuOpen = ref(false)

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const signOut = () => {
  iamStore.signOut(router)
}
const isPurchaseModalOpen = ref(false)
const isOrgModalOpen = ref(false)

const selectedPlan = ref(null)

const companyName = ref('')
const companyRuc = ref('')
const managerName = ref('')

// Abrir/cerrar modales
const openPurchaseModal = () => {
  isPurchaseModalOpen.value = true
}

const closePurchaseModal = () => {
  isPurchaseModalOpen.value = false
  selectedPlan.value = null
}

const openOrgModal = () => {
  isPurchaseModalOpen.value = false
  isOrgModalOpen.value = true
}

const closeOrgModal = () => {
  isOrgModalOpen.value = false
  companyName.value = ''
  companyRuc.value = ''
  managerName.value = ''
}

const createOrganization = () => {
  if (!companyName.value || !companyRuc.value) {
    alert('Company Name and RUC are required')
    return
  }

  console.log('Organization created:', {
    plan: selectedPlan.value,
    companyName: companyName.value,
    ruc: companyRuc.value,
    managerName: managerName.value
  })

  closeOrgModal()
}



</script>

<style scoped>
/* Topbar */
.topbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 60px;
  background: #043873;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px;
  z-index: 200;
}

/* Contenedor derecha */
.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Botón Purchase */
.btn-purchase {
  background: #ffffff;
  color: #043873;
  border: none;
  padding: 8px 20px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-purchase:hover {
  background: #e6e6e6;
}

/* Botón usuario */
.btn-user {
  background: #ffd700;
  color: #1e4976;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255, 215, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-user:hover {
  background: #ffed4e;
}

/* Dropdown */
.user-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  overflow: hidden;
  z-index: 300;
}

.dropdown-item {
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f2f2f2;
}

/* Ajuste del contenido principal para que no se esconda bajo la barra */
.invitations-main {
  margin-top: 70px;
}

.invitations-container {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif;
}

.app-header {
  background-color: #004080; /* Azul oscuro para header */
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  width: 250px; /* Sidebar fijo */
  flex-shrink: 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 1rem 0;
}

.sidebar a {
  color: white;
  text-decoration: none;
}

.sidebar a:hover {
  text-decoration: underline;
}

.profile {
  margin-top: auto;
  padding-top: 2rem;
}

.invitations-main {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa; /* Gris claro */
}

h1 {
  color: #004080;
  border-bottom: 2px solid #007BFF;
  padding-bottom: 0.5rem;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* Lista de invitaciones */
.invitations-list {
  max-width: 600px;
}

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

.invitation-code {
  display: block;
  font-weight: bold;
  color: #004080;
}

.invitation-email {
  color: #6c757d;
  font-size: 0.9rem;
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
  background-color: #dc3545; /* Rojo para cancelar */
  color: white;
}

.btn-accept {
  background-color: #28a745; /* Verde para aceptar */
  color: white;
}

.btn-cancel:hover, .btn-accept:hover {
  opacity: 0.8;
}
/* ===== MODALS ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
}

.modal-card {
  background: white;
  width: 380px;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeInUp 0.3s ease;
}

.modal-card h2 {
  color: #043873;
  margin-bottom: 20px;
}

/* Plan buttons */
.plans {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.plan-btn {
  padding: 12px;
  border-radius: 10px;
  border: 2px solid #dde6f0;
  background: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.plan-btn.active {
  background: #043873;
  color: white;
  border-color: #043873;
}

/* Inputs */
.modal-card input {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 14px;
}

/* Buttons */
.btn-primary {
  width: 100%;
  background: #043873;
  color: white;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
}

.btn-primary:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.btn-secondary {
  width: 100%;
  background: transparent;
  border: none;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
}

@keyframes fadeInUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

</style>