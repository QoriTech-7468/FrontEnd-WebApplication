import { IamApi } from "../infrastructure/iam-api.js";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { SignInAssembler } from "../infrastructure/sign-in.assembler.js";
import { SignUpAssembler } from "../infrastructure/sign-up.assembler.js";
import { User } from "../domain/user.entity.js";
import { InvitationAssembler } from "../infrastructure/invitation.assembler.js";
import { UserAssembler } from "../infrastructure/user.assembler.js";

const iamApi = new IamApi();

// Helper functions to persist user data
const saveUserToLocalStorage = (userData) => {
    localStorage.setItem('userData', JSON.stringify({
        id: userData.id,
        name: userData.name,
        surname: userData.surname,
        organizationId: userData.organizationId,
        role: userData.role
    }));
};

const loadUserFromLocalStorage = () => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
        try {
            return JSON.parse(userDataStr);
        } catch (e) {
            console.error('Error parsing user data from localStorage:', e);
            return null;
        }
    }
    return null;
};

const clearUserFromLocalStorage = () => {
    localStorage.removeItem('userData');
};

const useIamStore = defineStore('iam', () => {
    const users = ref([]);
    const errors = ref([]);
    const usersLoaded = ref(false);
    
    // Organization users state
    const organizationUsers = ref([]);
    const organizationUsersLoaded = ref(false);
    
    // Invitations state
    const invitations = ref([]);
    const invitationsLoaded = ref(false);
    
    // Inicializar desde localStorage si hay token y datos de usuario
    const token = localStorage.getItem('token');
    const savedUserData = loadUserFromLocalStorage();
    const isSignedIn = ref(!!token);
    
    // Inicializar datos del usuario desde localStorage si existen
    const currentUserName = ref(savedUserData?.name || '');
    const currentUserSurname = ref(savedUserData?.surname || '');
    const currentUserOrganizationId = ref(savedUserData?.organizationId || '');
    const currentUserId = ref(savedUserData?.id || '');
    const currentUserRole = ref(savedUserData?.role || '');
    const currentUserToken = computed(() => isSignedIn.value ? localStorage.getItem('token') : null);
    
    // Computed for invitations
    const invitationsCount = computed(() => {
        return invitationsLoaded.value ? invitations.value.length : 0;
    });

    function signIn(SignInCommand, router) {
        console.log(SignInCommand);
        iamApi.signIn(SignInCommand)
            .then(response => {
                let signInResource = SignInAssembler.toResourceFromResponse(response);
                if (signInResource) {
                    let currentUser = new User({
                        id: signInResource.id,
                        name: signInResource.name,
                        surname: signInResource.surname,
                        organizationId: signInResource.organizationId,
                        role: signInResource.role
                    });
                    currentUserName.value = currentUser.name;
                    currentUserSurname.value = currentUser.surname;
                    currentUserOrganizationId.value = currentUser.organizationId;
                    currentUserId.value = currentUser.id;
                    currentUserRole.value = currentUser.role;
                    
                    // Save token and user data to localStorage
                    localStorage.setItem('token', signInResource.token);
                    saveUserToLocalStorage({
                        id: currentUser.id,
                        name: currentUser.name,
                        surname: currentUser.surname,
                        organizationId: currentUser.organizationId,
                        role: currentUser.role
                    });
                    
                    isSignedIn.value = true;
                    console.log(`User ${currentUserName.value} signed in successfully.`);
                    errors.value = [];
                    // If no organizationId, redirect to invitations, otherwise to management
                    if (!currentUser.organizationId) {
                        router.push({ name: 'invitations' });
                    } else {
                        router.push({ name: 'management' });
                    }
                } else {
                    isSignedIn.value = false;
                    console.log('Sign-in failed: Invalid response.');
                    errors.value.push(new Error("Invalid response."));
                    router.push({ name: 'iam-sign-in-up' });
                }
            })
            .catch(error => {
                isSignedIn.value = false;
                currentUserName.value = '';
                currentUserSurname.value = '';
                currentUserOrganizationId.value = '';
                currentUserId.value = '';
                currentUserRole.value = '';
                console.log(`Sign-in failed: ${error.message}`);
                errors.value.push(error);
                router.push({ name: 'iam-sign-in-up' });
            });
    }

    function signUp(SignUpCommand) {
        iamApi.signUp(SignUpCommand)
            .then(response => {
                let signUpResource = SignUpAssembler.toResourceFromResponse(response);
                if (signUpResource) {
                    console.log(`User ${signUpResource.email} signed up successfully.`);
                    errors.value = [];
                } else {
                    console.log('Sign-up failed: Invalid response.');
                    errors.value.push(new Error("Invalid response."));
                }
            })
            .catch(error => {
                console.log(`Sign-up failed: ${error.message}`);
                errors.value.push(error);
            });
    }

    /**
     * Initializes the user from the backend, validating the token
     * and updating user data with fresh information.
     * If it fails, clears all authentication state.
     * 
     * This function should be called when starting the app when there is a token in localStorage.
     * Cached data (localStorage) is shown first for better UX,
     * and then updated with fresh data from the backend.
     */
    async function initializeUser() {
        const token = localStorage.getItem('token');
        
        // If there's no token, there's nothing to initialize
        if (!token) {
            return;
        }

        try {
            // Try to get fresh user data from the backend
            // This automatically validates the token
            const response = await iamApi.getCurrentUser();
            
            if (response.status === 200 && response.data) {
                // Update store with fresh data from backend
                const userData = response.data;
                
                currentUserId.value = userData.id || '';
                currentUserName.value = userData.name || '';
                currentUserSurname.value = userData.surname || '';
                currentUserOrganizationId.value = userData.organizationId || '';
                currentUserRole.value = userData.role || '';
                
                // Update cache in localStorage with fresh data
                saveUserToLocalStorage({
                    id: userData.id,
                    name: userData.name,
                    surname: userData.surname,
                    organizationId: userData.organizationId,
                    role: userData.role
                });
                
                isSignedIn.value = true;
                console.log('✅ User initialized and validated from backend');
            } else {
                // If the response is invalid, clear everything
                console.warn('⚠️ Invalid response from backend, clearing authentication');
                clearAuth();
            }
        } catch (error) {
            // If there's an error (invalid token, expired, etc.), clear everything
            console.error('❌ Error initializing user:', error);
            console.log('🔒 Invalid or expired token, clearing authentication');
            clearAuth();
        }
    }

    /**
     * Clears all authentication state
     */
    function clearAuth() {
        localStorage.removeItem('token');
        clearUserFromLocalStorage();
        isSignedIn.value = false;
        currentUserName.value = '';
        currentUserSurname.value = '';
        currentUserOrganizationId.value = '';
        currentUserId.value = '';
        currentUserRole.value = '';
    }

    function signOut(router) {
        // Clear token and user data from localStorage
        clearAuth();
        
        console.log('User signed out successfully.');
        errors.value = [];
        router.push({ name: 'iam-sign-in-up' });
    }

    /**
     * Update the organization ID in the store and localStorage
     * Used after creating an organization
     * @param {number|string} organizationId - The organization ID to set
     */
    function updateOrganizationId(organizationId) {
        currentUserOrganizationId.value = organizationId;
        
        // Update localStorage
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
            try {
                const userData = JSON.parse(userDataStr);
                userData.organizationId = organizationId;
                localStorage.setItem('userData', JSON.stringify(userData));
            } catch (e) {
                console.error('Error updating organizationId in localStorage:', e);
            }
        }
        
        console.log(`✅ Organization ID updated to: ${organizationId}`);
    }

    // ========== INVITATIONS ACTIONS ==========

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
            console.log('📋 IAM Store - Creating invitation with data:', invitationData);
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

    // ========== ORGANIZATION USERS ACTIONS ==========

    /**
     * Fetch organization users from the API
     * @returns {Promise} - A promise resolving to the list of organization users
     */
    async function fetchOrganizationUsers() {
        try {
            organizationUsersLoaded.value = false;
            const response = await iamApi.getOrganizationUsers();
            organizationUsers.value = UserAssembler.toEntitiesFromResponse(response);
            organizationUsersLoaded.value = true;
            errors.value = [];
            console.log(`✅ Organization users loaded: ${organizationUsers.value.length}`);
            return organizationUsers.value;
        } catch (error) {
            console.error('❌ Error fetching organization users:', error);
            errors.value.push(error);
            organizationUsersLoaded.value = false;
            throw error;
        }
    }

    /**
     * Update user role
     * @param {number|string} id - The user ID
     * @param {string} role - The new role (Admin or Dispatcher)
     * @returns {Promise} - A promise resolving to the update result
     */
    async function updateUserRole(id, role) {
        try {
            const response = await iamApi.updateUserRole(id, role);
            
            // Update the user in the list if it exists
            const index = organizationUsers.value.findIndex(user => user.id === id);
            if (index !== -1) {
                organizationUsers.value[index].role = role;
            }
            
            errors.value = [];
            console.log(`✅ User ${id} role updated to ${role}`);
            return response;
        } catch (error) {
            console.error(`❌ Error updating user role ${id}:`, error);
            errors.value.push(error);
            throw error;
        }
    }

    /**
     * Remove user from organization
     * @param {number|string} id - The user ID to remove
     * @returns {Promise} - A promise resolving to the deletion result
     */
    async function removeUserFromOrganization(id) {
        try {
            const response = await iamApi.removeUserFromOrganization(id);
            
            // Remove the user from the list after removing
            organizationUsers.value = organizationUsers.value.filter(user => user.id !== id);
            
            errors.value = [];
            console.log(`✅ User ${id} removed from organization successfully`);
            return response;
        } catch (error) {
            console.error(`❌ Error removing user ${id} from organization:`, error);
            errors.value.push(error);
            throw error;
        }
    }

    /**
     * Clear all organization users from the store
     */
    function clearOrganizationUsers() {
        organizationUsers.value = [];
        organizationUsersLoaded.value = false;
        errors.value = [];
    }

    return {
        users,
        errors,
        usersLoaded,
        isSignedIn,
        currentUserName,
        currentUserSurname,
        currentUserOrganizationId,
        currentUserId,
        currentUserRole,
        currentUserToken,
        signIn,
        signUp,
        signOut,
        initializeUser,
        updateOrganizationId,
        // Invitations
        invitations,
        invitationsLoaded,
        invitationsCount,
        fetchUserInvitations,
        fetchOrganizationInvitations,
        getInvitationById,
        acceptInvitation,
        rejectInvitation,
        createInvitation,
        clearInvitations,
        // Organization users
        organizationUsers,
        organizationUsersLoaded,
        fetchOrganizationUsers,
        updateUserRole,
        removeUserFromOrganization,
        clearOrganizationUsers
    };
});

export default useIamStore;

