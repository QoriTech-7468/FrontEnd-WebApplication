<template>
  <InvitationsHeader @open-purchase-modal="openPurchaseModal" />

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

      <!-- Estado de carga -->
      <div v-if="isLoading && !invitationsLoaded" class="empty-state">
        <div class="empty-icon">⏳</div>
        <p>Loading invitations...</p>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="errorMessage" class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Estado: Sin invitaciones -->
      <div v-else-if="invitations.length === 0 && invitationsLoaded" class="empty-state">
        <div class="empty-icon">📧</div>
        <p>You don't have any invitations yet</p>
        <p class="subtitle">Ask your company owner or administrator to add you using your email address.</p>
      </div>

      <!-- Estado: Con invitaciones -->
      <div v-else class="invitations-list">
        <InvitationCard
          v-for="invitation in invitations"
          :key="invitation.id"
          :invitation="invitation"
          :is-loading="loadingInvitationId !== null"
          :loading-id="loadingInvitationId"
          @accept="acceptInvitation"
          @cancel="cancelInvitation"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useInvitationsStore from '../../application/invitations.store.js'
import { storeToRefs } from 'pinia'
import InvitationsHeader from '../components/invitations-header.vue'
import InvitationCard from '../components/invitation-card.vue'

const router = useRouter()
const invitationsStore = useInvitationsStore()
const { invitations, invitationsLoaded } = storeToRefs(invitationsStore)

const isLoading = ref(false)
const loadingInvitationId = ref(null)
const errorMessage = ref(null)

// Cargar invitaciones cuando el componente se monte
onMounted(async () => {
  try {
    isLoading.value = true
    errorMessage.value = null
    await invitationsStore.fetchUserInvitations()
  } catch (error) {
    console.error('Error loading invitations:', error)
    errorMessage.value = 'Failed to load invitations. Please try again.'
  } finally {
    isLoading.value = false
  }
})

// Funciones de manejo de acciones
const cancelInvitation = async (id) => {
  try {
    loadingInvitationId.value = id
    errorMessage.value = null
    await invitationsStore.rejectInvitation(id)
    console.log(`Invitation ${id} rejected successfully`)
  } catch (error) {
    console.error(`Error rejecting invitation ${id}:`, error)
    errorMessage.value = 'Failed to reject invitation. Please try again.'
  } finally {
    loadingInvitationId.value = null
  }
}

const acceptInvitation = async (id) => {
  try {
    loadingInvitationId.value = id
    errorMessage.value = null
    await invitationsStore.acceptInvitation(id)
    console.log(`Invitation ${id} accepted successfully`)
    // Redirigir a management después de aceptar la invitación
    router.push({ name: 'management' })
  } catch (error) {
    console.error(`Error accepting invitation ${id}:`, error)
    errorMessage.value = 'Failed to accept invitation. Please try again.'
    loadingInvitationId.value = null
  }
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
.invitations-container {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif;
}

.invitations-main {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa; /* Gris claro */
  margin-top: 70px;
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