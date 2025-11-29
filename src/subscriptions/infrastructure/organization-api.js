import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoints.js";

const organizationEndpointPath = import.meta.env.VITE_RUTANA_ORGANIZATION_ENDPOINT_PATH
export class OrganizationApi extends BaseApi {
    #organizationEndpointPath;
    
    constructor() {
        super();
        this.#organizationEndpointPath = new BaseEndpoint(this, organizationEndpointPath);
    }

    /**
     * Create a new organization
     * @param {Object} organizationRequest - The organization data to create (name, ruc, userId)
     * @returns {Promise} - A promise resolving to the created organization
     */
    createOrganization(organizationRequest) {
        return this.#organizationEndpointPath.create(organizationRequest);
    }
}

