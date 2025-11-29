import { OrganizationApi } from "../infrastructure/organization-api.js";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { OrganizationAssembler } from "../infrastructure/organization.assembler.js";

const organizationApi = new OrganizationApi();

const useOrganizationStore = defineStore('organization', () => {
    // State
    const organization = ref(null);
    const errors = ref([]);
    const organizationLoaded = ref(false);

    // Computed
    const hasOrganization = computed(() => {
        return organizationLoaded.value && organization.value !== null;
    });

    // Actions
    /**
     * Create a new organization
     * @param {Object} organizationData - The organization data to create (name, ruc, userId)
     * @returns {Promise} - A promise resolving to the created organization entity
     */
    async function createOrganization(organizationData) {
        try {
            errors.value = [];
            
            // Convert organization data to request format using assembler
            const request = OrganizationAssembler.toRequest(organizationData);
            
            const response = await organizationApi.createOrganization(request);
            const createdOrganization = OrganizationAssembler.toEntityFromResponse(response);
            
            if (createdOrganization) {
                organization.value = createdOrganization;
                organizationLoaded.value = true;
            }
            
            console.log('✅ Organization created successfully');
            return createdOrganization;
        } catch (error) {
            console.error('❌ Error creating organization:', error);
            errors.value.push(error);
            throw error;
        }
    }

    /**
     * Clear organization from the store
     */
    function clearOrganization() {
        organization.value = null;
        organizationLoaded.value = false;
        errors.value = [];
    }

    return {
        // State
        organization,
        errors,
        organizationLoaded,
        // Computed
        hasOrganization,
        // Actions
        createOrganization,
        clearOrganization
    };
});

export default useOrganizationStore;

