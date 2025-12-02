import { CrmApi } from "../infrastructure/crm-api.js";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ClientAssembler } from "../infrastructure/client.assembler.js";
import { LocationAssembler } from "../infrastructure/location.assembler.js";

const crmApi = new CrmApi();

const useCrmStore = defineStore('crm', () => {
    // State
    const errors = ref([]);
    const clients = ref([]);
    const clientsLoaded = ref(false);
    const locations = ref([]);
    const locationsLoaded = ref(false);

    // Computed properties
    const clientsCount = computed(() => {
        return clientsLoaded.value ? clients.value.length : 0;
    });

    const locationsCount = computed(() => {
        return locationsLoaded.value ? locations.value.length : 0;
    });

    // Actions

    /**
     * Fetch all clients from the API
     * @param {Object} options - Query parameters
     * @param {boolean} options.isActive - Filter by active status
     */
    function fetchClients(options = {}) {
        crmApi.getClients(options)
            .then(response => {
                const rawClients = ClientAssembler.toEntitiesfromResponse(response);
                clients.value = rawClients.map(c => ({
                    ...c,
                    status: c.isActive ? 'Active' : 'Disabled'
                }));
                clientsLoaded.value = true;
                errors.value = [];
            })
            .catch(error => {
                errors.value.push(error);
                clientsLoaded.value = false;
            });
    }

    /**
     * Fetch all locations from the API
     * @param {Object} options - Query parameters
     * @param {boolean} options.isActive - Filter by active status
     * @param {number} options.clientId - Filter by client ID
     * @returns {Promise} - A promise resolving to the list of locations
     */
    function fetchLocations(options = {}) {
        return crmApi.getLocations(options)
            .then(response => {
                const rawLocations = LocationAssembler.toEntitiesfromResponse(response);
                const locationsList = rawLocations.map(l => ({
                    ...l,
                    status: l.isActive ? 'Active' : 'Disabled',
                    clientId: l.customerId || l.clientId
                }));
                // Si no hay clientId en las opciones, actualizar el store global
                if (!options.clientId) {
                    locations.value = locationsList;
                    locationsLoaded.value = true;
                }
                errors.value = [];
                return locationsList;
            })
            .catch(error => {
                errors.value.push(error);
                locationsLoaded.value = false;
                throw error; // Re-throw para que el componente pueda manejar el error
            });
    }

    /**
     * Get client by id from store (local)
     * @param {number|string} id - The client ID
     * @returns {Object|null} - The client entity or null if not found
     */
    function getClientsById(id) {
        const idNum = parseInt(id);
        return clients.value.find(client => client.id === idNum);
    }

    /**
     * Fetch client by id from API
     * @param {number|string} id - The client ID
     * @param {Object} options - Query parameters
     * @param {string} options.include - Comma-separated list of related resources (e.g., 'locations')
     * @returns {Promise} - A promise resolving to the client
     */
    function fetchClientById(id, options = {}) {
        return crmApi.getClientsById(id, options)
            .then(response => {
                const resource = response.data;
                const client = ClientAssembler.toEntityFromResource(resource);
                const index = clients.value.findIndex(c => c.id === client.id);
                if (index !== -1) {
                    clients.value[index] = { ...client, status: client.isActive ? 'Active' : 'Disabled' };
                } else {
                    clients.value.push({ ...client, status: client.isActive ? 'Active' : 'Disabled' });
                }
                errors.value = [];
                return client;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    /**
     * Fetch locations by client ID from API
     * @param {number|string} clientId - The client ID
     * @returns {Promise} - A promise resolving to the list of locations
     */
    function fetchLocationsByClientId(clientId) {
        return crmApi.getLocationsByClientId(clientId)
            .then(response => {
                const rawLocations = LocationAssembler.toEntitiesfromResponse(response);
                const locationsList = rawLocations.map(l => ({
                    ...l,
                    status: l.isActive ? 'Active' : 'Disabled',
                    clientId: l.clientId
                }));
                errors.value = [];
                return locationsList;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    /**
     * Add a new client
     * @param {Object} client - The client data to create (Client entity or plain object)
     */
    function addClients(client) {
        // Transform entity to resource format with organizationId
        const requestResource = ClientAssembler.toResourceFromEntity(client);
        
        crmApi.createClients(requestResource).then(response => {
            const responseResource = response.data;
            const newClient = ClientAssembler.toEntityFromResource(responseResource);
            // Ensure isActive is true by default and add status field for consistency
            clients.value.push({
                ...newClient,
                isActive: newClient.isActive !== null ? newClient.isActive : true,
                status: (newClient.isActive !== null ? newClient.isActive : true) ? 'Active' : 'Disabled'
            });
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Update an existing client
     * @param {Object} client - The client data to update (Client entity or plain object)
     */
    function updateClients(client) {
        // Transform entity to resource format for UPDATE (PUT) - uses 'name' not 'companyName'
        const requestResource = ClientAssembler.toResourceFromEntity(client, true);
        
        return crmApi.updateClients(requestResource).then(response => {
            const responseResource = response.data;
            const updatedClient = ClientAssembler.toEntityFromResource(responseResource);
            const index = clients.value.findIndex(c => c.id === updatedClient.id);
            if (index !== -1) {
                // Update with status field for consistency
                clients.value[index] = {
                    ...updatedClient,
                    status: updatedClient.isActive ? 'Active' : 'Disabled'
                };
            }
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Update client status (activate/deactivate)
     * @param {number|string} clientId - The client ID
     * @param {boolean} isActive - Active status (true to activate, false to deactivate)
     */
    function updateClientStatus(clientId, isActive) {
        return crmApi.updateClientStatus(clientId, isActive).then(response => {
            const resource = response.data;
            const updatedClient = ClientAssembler.toEntityFromResource(resource);
            const index = clients.value.findIndex(c => c.id === updatedClient.id);
            if (index !== -1) {
                clients.value[index] = { ...updatedClient, status: updatedClient.isActive ? 'Active' : 'Disabled' };
            }
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    /**
     * Delete a client (soft delete - uses status update)
     * @param {number|string} clientId - The client ID to delete
     */
    function deleteClients(clientId) {
        return updateClientStatus(clientId, false);
    }

    /**
     * Get location by id from store (local)
     * @param {number|string} id - The location ID
     * @returns {Object|null} - The location entity or null if not found
     */
    function getLocationById(id) {
        const idNum = parseInt(id);
        return locations.value.find(location => location.id === idNum);
    }

    /**
     * Fetch location by id from API
     * @param {number|string} id - The location ID
     * @param {Object} options - Query parameters
     * @param {string} options.include - Comma-separated list of related resources (e.g., 'client')
     * @returns {Promise} - A promise resolving to the location
     */
    function fetchLocationById(id, options = {}) {
        return crmApi.getLocationsById(id, options)
            .then(response => {
                const resource = response.data;
                const location = LocationAssembler.toEntityFromResource(resource);
                const index = locations.value.findIndex(l => l.id === location.id);
                if (index !== -1) {
                    locations.value[index] = { ...location, status: location.isActive ? 'Active' : 'Disabled' };
                } else {
                    locations.value.push({ ...location, status: location.isActive ? 'Active' : 'Disabled' });
                }
                errors.value = [];
                return location;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    /**
     * Add a new location
     * @param {Object} location - The location data to create (Location entity or plain object)
     */
    function addLocation(location) {
        // Transform to resource format ensuring correct types
        const requestResource = LocationAssembler.toResourceFromEntity(location);
        
        return crmApi.createLocations(requestResource).then(response => {
            const responseResource = response.data;
            const newLocation = LocationAssembler.toEntityFromResource(responseResource);
            // Ensure isActive is true by default and add status field for consistency
            locations.value.push({
                ...newLocation,
                isActive: newLocation.isActive !== null ? newLocation.isActive : true,
                status: (newLocation.isActive !== null ? newLocation.isActive : true) ? 'Active' : 'Disabled'
            });
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
            throw error; // Re-throw para que el componente pueda manejar el error
        });
    }

    /**
     * Update an existing location
     * @param {Object} location - The location data to update (Location entity or plain object)
     * @returns {Promise} - A promise that resolves when the location is updated
     */
    function updateLocation(location) {
        // Transform to resource format ensuring correct types
        const requestResource = LocationAssembler.toResourceFromEntity(location);
        
        return crmApi.updateLocations(requestResource).then(response => {
            const resource = response.data;
            const updatedLocation = LocationAssembler.toEntityFromResource(resource);
            const index = locations.value.findIndex(l => l.id === updatedLocation.id);
            if (index !== -1) {
                locations.value[index] = {
                    ...updatedLocation,
                    status: updatedLocation.isActive ? 'Active' : 'Disabled'
                };
            }
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
            throw error; // Re-throw para que el componente pueda manejar el error
        });
    }

    /**
     * Update location status (activate/deactivate)
     * @param {number|string} locationId - The location ID
     * @param {boolean} isActive - Active status (true to activate, false to deactivate)
     */
    function updateLocationStatus(locationId, isActive) {
        return crmApi.updateLocationStatus(locationId, isActive).then(response => {
            const resource = response.data;
            const updatedLocation = LocationAssembler.toEntityFromResource(resource);
            const index = locations.value.findIndex(l => l.id === updatedLocation.id);
            if (index !== -1) {
                locations.value[index] = { ...updatedLocation, status: updatedLocation.isActive ? 'Active' : 'Disabled' };
            }
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    /**
     * Delete a location (soft delete - uses status update)
     * @param {number|string} locationId - The location ID to delete
     */
    function deleteLocation(locationId) {
        return updateLocationStatus(locationId, false);
    }

    return {
        // State
        errors,
        clients,
        clientsLoaded,
        locations,
        locationsLoaded,
        // Computed
        clientsCount,
        locationsCount,
        // Actions
        fetchClients,
        fetchLocations,
        getClientsById,
        fetchClientById,
        fetchLocationsByClientId,
        addClients,
        updateClients,
        updateClientStatus,
        deleteClients,
        getLocationById,
        fetchLocationById,
        addLocation,
        updateLocation,
        updateLocationStatus,
        deleteLocation
    };
});

export default useCrmStore;

