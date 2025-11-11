import {CustomerLocationManagementApi} from "../infrastructure/customer-location-management.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";

import {ClientAssembler} from "../infrastructure/client.assembler.js";
import {LocationAssembler} from "../infrastructure/location.assembler.js";
import {VehicleAssembler} from "../../FleetAndResourceManagement/infrastructure/vehicle.assembler.js";

const customerResourceManagementApi = new CustomerLocationManagementApi();

const customerStore = defineStore('clients', () => {

    // State
    const errors = ref([]);
    const clients = ref([]);
    const clientsLoaded = ref(false);
    const locations = ref([]);
    const locationsLoaded = ref(false);

    // Properties


    const clientsCount = computed(() => {
        return clientsLoaded ? clients.value.length :0 ; });

    const locationsCount = computed(() => {
        return locationsLoaded ? locations.value.length : 0;
    })

    // Actions

    function fetchClients() {
        customerResourceManagementApi.getClients()
            .then(response => {
                const rawClients = ClientAssembler.toEntitiesfromResponse(response);
                clients.value = rawClients.map(c => ({
                    ...c,
                    status: c.isActive ? 'Active' : 'Disabled'
                }));
                clientsLoaded.value = true;
            })
            .catch(error => errors.value.push(error));
    }
    function fetchLocations() {
        customerResourceManagementApi.getLocations()
            .then(response => {
                const rawLocations = LocationAssembler.toEntitiesfromResponse(response);
                locations.value = rawLocations.map(l => ({
                    ...l,
                    status: l.isActive ? 'Active' : 'Disabled',
                    clientId: l.customerId
                }));
                locationsLoaded.value = true;
            })
            .catch(error => errors.value.push(error));
    }

    function getClientsById(id) {
        let idNum = parseInt(id);
        return clients.value.find(clients => clients["id"] === idNum);
    }

    function addClients(client) {
        customerResourceManagementApi.createClients(client).then(response => {
            const resource = response.data;
            const newClient = ClientAssembler.toEntityFromResource(resource);
            client.value.push(newClient);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function updateClients(clients) {
        return customerResourceManagementApi.updateClients(clients).then(response => {
            const resource = response.data;
            const updateClients = ClientAssembler.toEntityFromResource(resource);
            const index = clients.value.findIndex(c => c["id"] === updateClients.id);
            if (index !== -1) clients.value[index] = updateClients;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteClients(clientId) {
        customerResourceManagementApi.deleteClients(clientId).then(() => {
            const index = clients.value.findIndex(t => t["id"] === clientId);
            if (index !== -1) clients.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function getLocationById(id) {
        let idNum = parseInt(id);
        return locations.value.find(locations => locations["id"] === idNum);
    }

    function addLocation(client) {
        customerResourceManagementApi.createLocations(client).then(response => {
            const resource = response.data;
            const newLocation = LocationAssembler.toEntityFromResource(resource);
            locations.value.push(newLocation);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function updateLocation(location) {
        customerResourceManagementApi.updateLocations(location).then(response => {
            const resource = response.data;
            const updatedLocation = LocationAssembler.toEntityFromResource(resource);
            const index = location.value.findIndex(t => t["id"] === updatedLocation.id);
            if (index !== -1) location.value[index] = updatedLocation;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteLocation(locationId) {
        customerResourceManagementApi.deleteClients(locationId).then(() => {
            const index = locations.value.findIndex(t => t["id"] === locationId);
            if (index !== -1) locations.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    return {
        // State

        clients,
        clientsLoaded,
        locations,
        locationsLoaded,
        // Properties

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

export default customerStore;