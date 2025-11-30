import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoints.js";

const signInEndpointPath = import.meta.env.VITE_RUTANA_SIGN_IN_ENDPOINT_PATH;
const signUpEndpointPath = import.meta.env.VITE_RUTANA_SIGN_UP_ENDPOINT_PATH;
const userEndpointPath = import.meta.env.VITE_RUTANA_USER_ENDPOINT_PATH;
const invitationsEndpointPath = import.meta.env.VITE_RUTANA_INVITATIONS_ENDPOINT_PATH;

export class IamApi extends BaseApi {
    #signInEndpointPath;
    #signUpEndpointPath;
    #userEndpointPath;
    #invitationsEndpointPath;
    constructor() {
        super();
        this.#signInEndpointPath = new BaseEndpoint(this, signInEndpointPath);
        this.#signUpEndpointPath = new BaseEndpoint(this, signUpEndpointPath);
        this.#userEndpointPath = new BaseEndpoint(this, userEndpointPath);
        this.#invitationsEndpointPath = new BaseEndpoint(this, invitationsEndpointPath);
    }

    signIn(signInRequest) {
        return this.#signInEndpointPath.create(signInRequest);
    }
    signUp(signUpRequest) {
        return this.#signUpEndpointPath.create(signUpRequest);
    }
    getUsers() {
        return this.#userEndpointPath.getAll();
    }
    /**
     * Gets the current authenticated user using getById
     * Gets the user ID from localStorage and makes the request
     */
    getCurrentUser() {
        // Get user ID from localStorage
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            return Promise.reject(new Error('No user data in localStorage'));
        }
        
        try {
            const userData = JSON.parse(userDataStr);
            const userId = userData.id;
            
            if (!userId) {
                return Promise.reject(new Error('No user ID in localStorage'));
            }
            
            // Use getById with the saved user ID
            return this.#userEndpointPath.getById(userId);
        } catch (error) {
            return Promise.reject(new Error('Error parsing user data: ' + error.message));
        }
    }

    // Invitations endpoints
    /**
     * Create a new invitation
     * @param {Object} invitationRequest - The invitation data to create
     * @returns {Promise} - A promise resolving to the created invitation
     */
    createInvitation(invitationRequest) {
        return this.#invitationsEndpointPath.create(invitationRequest);
    }

    /**
     * Get user invitations
     * @returns {Promise} - A promise resolving to the list of user invitations
     */
    getUserInvitations() {
        return this.#invitationsEndpointPath.getAll();
    }

    /**
     * Get organization invitations
     * @returns {Promise} - A promise resolving to the list of organization invitations
     */
    getOrganizationInvitations() {
        return this.http.get(`${this.#invitationsEndpointPath.endpointPath}/organization`);
    }

    /**
     * Get invitation by id
     * @param {number|string} id - The invitation ID
     * @returns {Promise} - A promise resolving to the invitation
     */
    getInvitationById(id) {
        return this.#invitationsEndpointPath.getById(id);
    }

    /**
     * Reject an invitation (DELETE)
     * @param {number|string} id - The invitation ID to reject
     * @returns {Promise} - A promise resolving to the deletion result
     */
    rejectInvitation(id) {
        return this.#invitationsEndpointPath.delete(id);
    }

    /**
     * Accept an invitation
     * @param {number|string} id - The invitation ID to accept
     * @returns {Promise} - A promise resolving to the acceptance result
     */
    acceptInvitation(id) {
        return this.http.post(`${this.#invitationsEndpointPath.endpointPath}/${id}/accept`);
    }
}