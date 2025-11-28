import { IamApi } from "../infrastructure/iam-api.js";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { InvitationAssembler } from "../infrastructure/invitation.assembler.js";

const iamApi = new IamApi();

const useInvitationsStore = defineStore('invitations', () => {
    // State
    const invitations = ref([]);
    const errors = ref([]);
    const invitationsLoaded = ref(false);

    // Computed
    const invitationsCount = computed(() => {
        return invitationsLoaded.value ? invitations.value.length : 0;
    });

    // Actions
    /**
     * Fetch user invitations from the API
     * @returns {Promise} - A promise resolving to the list of invitations
     */
    async function fetchUserInvitations() {
        try {
            invitationsLoaded.value = false;
            const response = await iamApi.getUserInvitations();
            invitations.value = InvitationAssembler.toEntitiesFromResponse(response);
            invitationsLoaded.value = true;
            errors.value = [];
            console.log(`✅ User invitations loaded: ${invitations.value.length}`);
            return invitations.value;
        } catch (error) {
            console.error('❌ Error fetching user invitations:', error);
            errors.value.push(error);
            invitationsLoaded.value = false;
            throw error;
        }
    }

    /**
     * Fetch organization invitations from the API
     * @returns {Promise} - A promise resolving to the list of invitations
     */
    async function fetchOrganizationInvitations() {
        try {
            invitationsLoaded.value = false;
            const response = await iamApi.getOrganizationInvitations();
            invitations.value = InvitationAssembler.toEntitiesFromResponse(response);
            invitationsLoaded.value = true;
            errors.value = [];
            console.log(`✅ Organization invitations loaded: ${invitations.value.length}`);
            return invitations.value;
        } catch (error) {
            console.error('❌ Error fetching organization invitations:', error);
            errors.value.push(error);
            invitationsLoaded.value = false;
            throw error;
        }
    }

    /**
     * Get invitation by id
     * @param {number|string} id - The invitation ID
     * @returns {Promise} - A promise resolving to the invitation entity
     */
    async function getInvitationById(id) {
        try {
            const response = await iamApi.getInvitationById(id);
            const invitation = InvitationAssembler.toEntityFromResponse(response);
            
            if (invitation) {
                // Update the invitation in the list if it exists
                const index = invitations.value.findIndex(inv => inv.id === invitation.id);
                if (index !== -1) {
                    invitations.value[index] = invitation;
                } else {
                    invitations.value.push(invitation);
                }
            }
            
            return invitation;
        } catch (error) {
            console.error(`❌ Error fetching invitation ${id}:`, error);
            errors.value.push(error);
            throw error;
        }
    }

    /**
     * Accept an invitation
     * @param {number|string} id - The invitation ID to accept
     * @returns {Promise} - A promise resolving to the acceptance result
     */
    async function acceptInvitation(id) {
        try {
            const response = await iamApi.acceptInvitation(id);
            
            // Remove the invitation from the list after accepting
            invitations.value = invitations.value.filter(inv => inv.id !== id);
            
            errors.value = [];
            console.log(`✅ Invitation ${id} accepted successfully`);
            return response;
        } catch (error) {
            console.error(`❌ Error accepting invitation ${id}:`, error);
            errors.value.push(error);
            throw error;
        }
    }

    /**
     * Reject an invitation (delete)
     * @param {number|string} id - The invitation ID to reject
     * @returns {Promise} - A promise resolving to the deletion result
     */
    async function rejectInvitation(id) {
        try {
            const response = await iamApi.rejectInvitation(id);
            
            // Remove the invitation from the list after rejecting
            invitations.value = invitations.value.filter(inv => inv.id !== id);
            
            errors.value = [];
            console.log(`✅ Invitation ${id} rejected successfully`);
            return response;
        } catch (error) {
            console.error(`❌ Error rejecting invitation ${id}:`, error);
            errors.value.push(error);
            throw error;
        }
    }

    /**
     * Create a new invitation
     * @param {Object} invitationData - The invitation data to create
     * @returns {Promise} - A promise resolving to the created invitation
     */
    async function createInvitation(invitationData) {
        try {
            const response = await iamApi.createInvitation(invitationData);
            const invitation = InvitationAssembler.toEntityFromResponse(response);
            
            if (invitation) {
                invitations.value.push(invitation);
            }
            
            errors.value = [];
            console.log(`✅ Invitation created successfully`);
            return invitation;
        } catch (error) {
            console.error('❌ Error creating invitation:', error);
            errors.value.push(error);
            throw error;
        }
    }

    /**
     * Clear all invitations from the store
     */
    function clearInvitations() {
        invitations.value = [];
        invitationsLoaded.value = false;
        errors.value = [];
    }

    return {
        // State
        invitations,
        errors,
        invitationsLoaded,
        // Computed
        invitationsCount,
        // Actions
        fetchUserInvitations,
        fetchOrganizationInvitations,
        getInvitationById,
        acceptInvitation,
        rejectInvitation,
        createInvitation,
        clearInvitations
    };
});

export default useInvitationsStore;

