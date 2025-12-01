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
     * @returns {Promise} - A promise resolving to the list of clients
     */
    getClients() {
        return this.#clientsEndpointPath.getAll();
    }

    /**
     * Get client by id
     * @param {number|string} id - The client ID
     * @returns {Promise} - A promise resolving to the client
     */
    getClientsById(id) {
        return this.#clientsEndpointPath.getById(id);
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
     * Delete a client
     * @param {number|string} id - The client ID to delete
     * @returns {Promise} - A promise resolving to the deletion result
     */
    deleteClients(id) {
        return this.#clientsEndpointPath.delete(id);
    }

    /**
     * Get all locations
     * @returns {Promise} - A promise resolving to the list of locations
     */
    getLocations() {
        return this.#locationEndpointPath.getAll();
    }

    /**
     * Get location by id
     * @param {number|string} id - The location ID
     * @returns {Promise} - A promise resolving to the location
     */
    getLocationsById(id) {
        return this.#locationEndpointPath.getById(id);
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
     * Delete a location
     * @param {number|string} id - The location ID to delete
     * @returns {Promise} - A promise resolving to the deletion result
     */
    deleteLocations(id) {
        return this.#locationEndpointPath.delete(id);
    }
}

