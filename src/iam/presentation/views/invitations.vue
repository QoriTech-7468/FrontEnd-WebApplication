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

        <button 
            class="btn-primary" 
            @click="createOrganization"
            :disabled="isCreatingOrganization"
        >
          <span v-if="!isCreatingOrganization">Create</span>
          <span v-else>Creating...</span>
        </button>

        <button class="btn-secondary" @click="closeOrgModal">
          Cancel
        </button>
      </div>
    </div>

    <!-- Main content -->
    <main class="invitations-main">
      <h1>Invitations</h1>

      <!-- Loading state -->
      <div v-if="isLoading && !invitationsLoaded" class="empty-state">
        <div class="empty-icon">⏳</div>
        <p>Loading invitations...</p>
      </div>

      <!-- Error message -->
      <div v-else-if="errorMessage" class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Empty state: No invitations -->
      <div v-else-if="invitations.length === 0 && invitationsLoaded" class="empty-state">
        <div class="empty-icon">📧</div>
        <p>You don't have any invitations yet</p>
        <p class="subtitle">Ask your company owner or administrator to add you using your email address.</p>
      </div>

      <!-- State: With invitations -->
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
import useOrganizationStore from '../../../subscriptions/application/organization.store.js'
import useIamStore from '../../application/iam.store.js'
import { storeToRefs } from 'pinia'
import InvitationsHeader from '../components/invitations-header.vue'
import InvitationCard from '../components/invitation-card.vue'

const router = useRouter()
const organizationStore = useOrganizationStore()
const iamStore = useIamStore()
const { invitations, invitationsLoaded, currentUserId, currentUserRole } = storeToRefs(iamStore)

const isLoading = ref(false)
const loadingInvitationId = ref(null)
const errorMessage = ref(null)

// Load invitations when component mounts
onMounted(async () => {
  try {
    isLoading.value = true
    errorMessage.value = null
    await iamStore.fetchUserInvitations()
  } catch (error) {
    console.error('Error loading invitations:', error)
    errorMessage.value = 'Failed to load invitations. Please try again.'
  } finally {
    isLoading.value = false
  }
})

// Action handler functions
const cancelInvitation = async (id) => {
  try {
    loadingInvitationId.value = id
    errorMessage.value = null
    await iamStore.rejectInvitation(id)
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
    await iamStore.acceptInvitation(id)
    console.log(`Invitation ${id} accepted successfully`)
    
    // Update user data from backend to get the latest role and organizationId
    await iamStore.initializeUser()
    
    // Get updated user role
    const userRole = iamStore.currentUserRole?.toLowerCase()
    
    // Redirect according to user role
    if (userRole === 'dispatcher') {
      router.push({ name: 'transportist-routes' })
    } else {
      // Admin and Owner go to management
      router.push({ name: 'management' })
    }
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

// Open/close modals
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
}

const isCreatingOrganization = ref(false)

const createOrganization = async () => {
  if (!companyName.value || !companyRuc.value) {
    alert('Company Name and RUC are required')
    return
  }

  if (companyRuc.value.length !== 11) {
    alert('RUC must have 11 digits')
    return
  }

  if (!currentUserId.value) {
    alert('Error: User ID not found. Please sign in again.')
    return
  }

  isCreatingOrganization.value = true

  try {
    // Create organization using the store
    const organizationData = {
      name: companyName.value,
      ruc: companyRuc.value,
      userId: currentUserId.value
    }

    const createdOrganization = await organizationStore.createOrganization(organizationData)

    if (createdOrganization && createdOrganization.id) {
      // Update IAM store with the new organizationId
      iamStore.updateOrganizationId(createdOrganization.id)

      closeOrgModal()

      // Redirect according to user role
      const userRole = currentUserRole.value?.toLowerCase()
      
      if (userRole === 'dispatcher') {
        // Dispatcher goes to transportist-routes
        router.push({ name: 'transportist-routes' })
      } else {
        // Owner and Admin go to management
        router.push({ name: 'management' })
      }
    } else {
      throw new Error('No valid organization received from server')
    }
  } catch (error) {
    console.error('Error creating organization:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Error creating organization'
    alert(`Error: ${errorMessage}`)
  } finally {
    isCreatingOrganization.value = false
  }
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
  background-color: #f8f9fa; /* Light gray */
  margin-top: 70px;
}

h1 {
  color: #004080;
  border-bottom: 2px solid #007BFF;
  padding-bottom: 0.5rem;
}

/* Empty state */
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

/* Invitations list */
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