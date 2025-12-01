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
     */
    function fetchClients() {
        crmApi.getClients()
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
     */
    function fetchLocations() {
        crmApi.getLocations()
            .then(response => {
                const rawLocations = LocationAssembler.toEntitiesfromResponse(response);
                locations.value = rawLocations.map(l => ({
                    ...l,
                    status: l.isActive ? 'Active' : 'Disabled',
                    clientId: l.customerId
                }));
                locationsLoaded.value = true;
                errors.value = [];
            })
            .catch(error => {
                errors.value.push(error);
                locationsLoaded.value = false;
            });
    }

    /**
     * Get client by id
     * @param {number|string} id - The client ID
     * @returns {Object|null} - The client entity or null if not found
     */
    function getClientsById(id) {
        const idNum = parseInt(id);
        return clients.value.find(client => client.id === idNum);
    }

    /**
     * Add a new client
     * @param {Object} client - The client data to create
     */
    function addClients(client) {
        crmApi.createClients(client).then(response => {
            const resource = response.data;
            const newClient = ClientAssembler.toEntityFromResource(resource);
            clients.value.push(newClient);
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Update an existing client
     * @param {Object} client - The client data to update
     */
    function updateClients(client) {
        return crmApi.updateClients(client).then(response => {
            const resource = response.data;
            const updatedClient = ClientAssembler.toEntityFromResource(resource);
            const index = clients.value.findIndex(c => c.id === updatedClient.id);
            if (index !== -1) {
                clients.value[index] = updatedClient;
            }
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Delete a client
     * @param {number|string} clientId - The client ID to delete
     */
    function deleteClients(clientId) {
        crmApi.deleteClients(clientId).then(() => {
            const index = clients.value.findIndex(c => c.id === clientId);
            if (index !== -1) {
                clients.value.splice(index, 1);
            }
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Get location by id
     * @param {number|string} id - The location ID
     * @returns {Object|null} - The location entity or null if not found
     */
    function getLocationById(id) {
        const idNum = parseInt(id);
        return locations.value.find(location => location.id === idNum);
    }

    /**
     * Add a new location
     * @param {Object} location - The location data to create
     */
    function addLocation(location) {
        crmApi.createLocations(location).then(response => {
            const resource = response.data;
            const newLocation = LocationAssembler.toEntityFromResource(resource);
            locations.value.push(newLocation);
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Update an existing location
     * @param {Object} location - The location data to update
     */
    function updateLocation(location) {
        crmApi.updateLocations(location).then(response => {
            const resource = response.data;
            const updatedLocation = LocationAssembler.toEntityFromResource(resource);
            const index = locations.value.findIndex(l => l.id === updatedLocation.id);
            if (index !== -1) {
                locations.value[index] = updatedLocation;
            }
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Delete a location
     * @param {number|string} locationId - The location ID to delete
     */
    function deleteLocation(locationId) {
        crmApi.deleteLocations(locationId).then(() => {
            const index = locations.value.findIndex(l => l.id === locationId);
            if (index !== -1) {
                locations.value.splice(index, 1);
            }
            errors.value = [];
        }).catch(error => {
            errors.value.push(error);
        });
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
        addClients,
        updateClients,
        deleteClients,
        getLocationById,
        addLocation,
        updateLocation,
        deleteLocation
    };
});

export default useCrmStore;

