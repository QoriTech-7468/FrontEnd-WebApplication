import {FleetResourceManagementApi} from "../infrastructure/fleet-resource-management-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {VehicleAssembler} from "../infrastructure/vehicle.assembler.js";
import {UserAssembler} from "../infrastructure/user.assembler.js";
import {ClientAssembler} from "../infrastructure/client.assembler.js";
import {LocationAssembler} from "../infrastructure/location.assembler.js";

const fleetResourceManagementApi = new FleetResourceManagementApi();

const useStore = defineStore('vehicles', () => {

    // State
    const vehicles = ref([]);
    const errors = ref([]);
    const vehiclesLoaded = ref(false);
    const users = ref([]);
    const usersLoaded = ref(false);
    const clients = ref([]);
    const clientsLoaded = ref(false);
    const locations = ref([]);
    const locationsLoaded = ref(false);

    // Properties
    const vehiclesCount = computed(() => {
        return vehiclesLoaded ? vehicles.value.length : 0; });


    const usersCount = computed(() => {
        return usersLoaded ? users.value.length : 0; });

    const clientsCount = computed(() => {
        return clientsLoaded ? clients.value.length :0 ; });

    const locationsCount = computed(() => {
        return locationsLoaded ? locations.value.length : 0;
    })

    // Actions
    function fetchVehicles() {
        fleetResourceManagementApi.getVehicles().then(response => {
            vehicles.value = VehicleAssembler.toEntitiesFromResponse(response);
            vehiclesLoaded.value = true;
            console.log(vehiclesLoaded.value);
            console.log(vehicles.value);
        }).catch(error => {
            errors.value.push(error);
        });
    }
    function fetchUsers() {
        fleetResourceManagementApi.getUsers().then(response => {
            users.value = UserAssembler.toEntitiesFromResponse(response);
            usersLoaded.value = true;
            console.log(usersLoaded.value);
            console.log(users.value);
        }).catch(error => {
            errors.value.push(error);
        });
    }
    function fetchClients() {
        fleetResourceManagementApi.getClients().then(response => {
            clients.value = ClientAssembler.toEntitiesfromResponse(response);
            clientsLoaded.value = true;
            console.log(clientsLoaded.value);
            console.log(clients.value);
        }).catch(error => {
            errors.value.push(error);
        });
    }
    function fetchLocations() {
        fleetResourceManagementApi.getLocations().then(response => {
            locations.value = LocationAssembler.toEntitiesfromResponse(response);
            locationsLoaded.value = true;
            console.log(locationsLoaded.value);
            console.log(locations.value);
        }).catch(error => {
            errors.value.push(error);
        })
    }

    function getVehiclesById(id) {
        let idNum = parseInt(id);
        return vehicles.value.find(vehicles => vehicles["id"] === idNum);
    }

    function addVehicles(vehicleData) {
        return fleetResourceManagementApi.createVehicles(vehicleData).then(response => {
            const resource = response.data;
            const newVehicle = VehicleAssembler.toEntityFromResource(resource);
            vehicles.value.push(newVehicle);
        }).catch(error => {
            // También es importante ver si hay un error
            console.error('❌ Error in addVehicles:', error);
            errors.value.push(error);
        });
    }

    function updateVehicles(vehicles) {
        return fleetResourceManagementApi.updateVehicles(vehicles).then(response => {
            const resource = response.data;
            const updateVehicles = VehicleAssembler.toEntityFromResource(resource);
            const index = vehicles.value.findIndex(c => c["id"] === updateVehicles.id);
            if (index !== -1) vehicles.value[index] = updateVehicles;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteVehicles(vehicleId) {
        fleetResourceManagementApi.deleteVehicles(vehicleId).then(() => {
            const index = vehicles.value.findIndex(c => c["id"] === vehicleId);
            if (index !== -1) vehicles.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function getUsersById(id) {
        let idNum = parseInt(id);
        return users.value.find(user => user["id"] === idNum);
    }

    function addUsers(user) {
        fleetResourceManagementApi.createUsers(user).then(response => {
            const resource = response.data;
            const newUser = UserAssembler.toEntityFromResource(resource);
            users.value.push(newUser);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function updateUsers(user) {
        return fleetResourceManagementApi.updateUsers(user).then(response => {
            console.log('--- PASO 2: Respuesta del API (en el Store) ---');
            console.log('Datos recibidos del API:', response.data);

            const resource = response.data;
            const updatedUser = UserAssembler.toEntityFromResource(resource);
            console.log('--- PASO 3: Usuario "Ensamblado" ---');
            console.log('Objeto final que se guardará en el estado:', updatedUser);

            const index = users.value.findIndex(t => t.id === updatedUser.id);
            if (index !== -1) {
                users.value[index] = updatedUser;
            }
        }).catch(error => {
            console.error('❌ Error actualizando el usuario:', error);
        });
    }

    function deleteUsers(usersId) {
        fleetResourceManagementApi.deleteUsers(usersId).then(() => {
            const index = users.value.findIndex(t => t["id"] === usersId);
            if (index !== -1) users.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function getClientsById(id) {
        let idNum = parseInt(id);
        return clients.value.find(clients => clients["id"] === idNum);
    }

    function addClients(client) {
        fleetResourceManagementApi.createClients(client).then(response => {
            const resource = response.data;
            const newClient = ClientAssembler.toEntityFromResource(resource);
            client.value.push(newClient);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function updateClients(client) {
        fleetResourceManagementApi.updateClients(client).then(response => {
            const resource = response.data;
            const updatedClient = ClientAssembler.toEntityFromResource(resource);
            const index = client.value.findIndex(t => t["id"] === updatedClient.id);
            if (index !== -1) client.value[index] = updatedClient;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteClients(clientId) {
        fleetResourceManagementApi.deleteClients(clientId).then(() => {
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
        fleetResourceManagementApi.createLocations(client).then(response => {
            const resource = response.data;
            const newLocation = LocationAssembler.toEntityFromResource(resource);
            locations.value.push(newLocation);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function updateLocation(location) {
        fleetResourceManagementApi.updateLocations(location).then(response => {
            const resource = response.data;
            const updatedLocation = LocationAssembler.toEntityFromResource(resource);
            const index = location.value.findIndex(t => t["id"] === updatedLocation.id);
            if (index !== -1) location.value[index] = updatedLocation;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteLocation(locationId) {
        fleetResourceManagementApi.deleteClients(locationId).then(() => {
            const index = locations.value.findIndex(t => t["id"] === locationId);
            if (index !== -1) locations.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    return {
        // State
        vehicles,
        errors,
        vehiclesLoaded,
        users,
        usersLoaded,
        clients,
        clientsLoaded,
        locations,
        locationsLoaded,
        // Properties
        vehiclesCount,
        usersCount,
        clientsCount,
        locationsCount,
        // Actions
        fetchVehicles,
        fetchUsers,
        fetchClients,
        fetchLocations,
        getVehiclesById,
        addVehicles,
        updateVehicles,
        deleteVehicles,
        getUsersById,
        addUsers,
        updateUsers,
        deleteUsers,
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

export default useStore;

