import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoints.js";

const clientsEndpointPath = import.meta.env.VITE_RUTANA_CLIENTS_ENDPOINT_PATH;
const locationEndpointPath = import.meta.env.VITE_RUTANA_LOCATIONS_ENDPOINT_PATH;

export class CrmApi extends BaseApi {
    #clientsEndpointPath;
    #locationEndpointPath;
    
    constructor() {
        super();
        this.#clientsEndpointPath = new BaseEndpoint(this, clientsEndpointPath);
        this.#locationEndpointPath = new BaseEndpoint(this, locationEndpointPath);
    }

    /**
     * Get all clients
     * @param {Object} options - Query parameters
     * @param {boolean} options.isActive - Filter by active status
     * @returns {Promise} - A promise resolving to the list of clients
     */
    getClients(options = {}) {
        const params = {};
        if (options.isActive !== undefined) {
            params.isActive = options.isActive;
        }
        return this.#clientsEndpointPath.getAll(params);
    }

    /**
     * Get client by id
     * @param {number|string} id - The client ID
     * @param {Object} options - Query parameters
     * @param {string} options.include - Comma-separated list of related resources (e.g., 'locations')
     * @returns {Promise} - A promise resolving to the client
     */
    getClientsById(id, options = {}) {
        const params = {};
        if (options.include) {
            params.include = options.include;
        }
        const queryString = Object.keys(params).length > 0 
            ? '?' + new URLSearchParams(params).toString()
            : '';
        return this.http.get(`${this.#clientsEndpointPath.endpointPath}/${id}${queryString}`);
    }

    /**
     * Create a new client
     * @param {Object} resource - The client data to create
     * @returns {Promise} - A promise resolving to the created client
     */
    createClients(resource) {
        return this.#clientsEndpointPath.create(resource);
    }

    /**
     * Update an existing client
     * @param {Object} resource - The client data to update
     * @returns {Promise} - A promise resolving to the updated client
     */
    updateClients(resource) {
        return this.#clientsEndpointPath.update(resource.id, resource);
    }

    /**
     * Get locations by client ID
     * @param {number|string} clientId - The client ID
     * @returns {Promise} - A promise resolving to the list of locations for the client
     */
    getLocationsByClientId(clientId) {
        return this.http.get(`${this.#clientsEndpointPath.endpointPath}/${clientId}/locations`);
    }

    /**
     * Update client status (activate/deactivate)
     * @param {number|string} id - The client ID
     * @param {boolean} isActive - Active status (true to activate, false to deactivate)
     * @returns {Promise} - A promise resolving to the updated client
     */
    updateClientStatus(id, isActive) {
        return this.http.patch(`${this.#clientsEndpointPath.endpointPath}/${id}/status`, { isActive });
    }

    /**
     * Delete a client (soft delete - uses status update)
     * @param {number|string} id - The client ID to delete
     * @returns {Promise} - A promise resolving to the updated client
     * @deprecated Use updateClientStatus(id, false) instead
     */
    deleteClients(id) {
        return this.updateClientStatus(id, false);
    }

    /**
     * Get all locations
     * @param {Object} options - Query parameters
     * @param {boolean} options.isActive - Filter by active status
     * @param {number} options.clientId - Filter by client ID
     * @returns {Promise} - A promise resolving to the list of locations
     */
    getLocations(options = {}) {
        const params = {};
        if (options.isActive !== undefined) {
            params.isActive = options.isActive;
        }
        if (options.clientId !== undefined) {
            params.clientId = options.clientId;
        }
        return this.#locationEndpointPath.getAll(params);
    }

    /**
     * Get location by id
     * @param {number|string} id - The location ID
     * @param {Object} options - Query parameters
     * @param {string} options.include - Comma-separated list of related resources (e.g., 'client')
     * @returns {Promise} - A promise resolving to the location
     */
    getLocationsById(id, options = {}) {
        const params = {};
        if (options.include) {
            params.include = options.include;
        }
        const queryString = Object.keys(params).length > 0 
            ? '?' + new URLSearchParams(params).toString()
            : '';
        return this.http.get(`${this.#locationEndpointPath.endpointPath}/${id}${queryString}`);
    }

    /**
     * Create a new location
     * @param {Object} resource - The location data to create
     * @returns {Promise} - A promise resolving to the created location
     */
    createLocations(resource) {
        return this.#locationEndpointPath.create(resource);
    }

    /**
     * Update an existing location
     * @param {Object} resource - The location data to update
     * @returns {Promise} - A promise resolving to the updated location
     */
    updateLocations(resource) {
        return this.#locationEndpointPath.update(resource.id, resource);
    }

    /**
     * Update location status (activate/deactivate)
     * @param {number|string} id - The location ID
     * @param {boolean} isActive - Active status (true to activate, false to deactivate)
     * @returns {Promise} - A promise resolving to the updated location
     */
    updateLocationStatus(id, isActive) {
        return this.http.patch(`${this.#locationEndpointPath.endpointPath}/${id}/status`, { isActive });
    }

    /**
     * Delete a location (soft delete - uses status update)
     * @param {number|string} id - The location ID to delete
     * @returns {Promise} - A promise resolving to the updated location
     * @deprecated Use updateLocationStatus(id, false) instead
     */
    deleteLocations(id) {
        return this.updateLocationStatus(id, false);
    }
}

