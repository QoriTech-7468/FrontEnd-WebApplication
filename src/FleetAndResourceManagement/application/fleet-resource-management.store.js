import {FleetResourceManagementApi} from "../infrastructure/fleet-resource-management-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {VehicleAssembler} from "../infrastructure/vehicle.assembler.js";
import {UserAssembler} from "../infrastructure/user.assembler.js";


const fleetResourceManagementApi = new FleetResourceManagementApi();

const useStore = defineStore('vehicles', () => {

    // State
    const vehicles = ref([]);
    const errors = ref([]);
    const vehiclesLoaded = ref(false);
    const users = ref([]);

    const usersLoaded = ref(false);

    // Properties
    const vehiclesCount = computed(() => {
        return vehiclesLoaded ? vehicles.value.length : 0; });


    const usersCount = computed(() => {
        return usersLoaded ? users.value.length : 0; });

    // Actions
    function fetchVehicles() {
        fleetResourceManagementApi.getVehicles().then(response => {
            vehicles.value = VehicleAssembler.toEntityfromResponse(response);
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

    function getVehiclesById(id) {
        let idNum = parseInt(id);
        return vehicles.value.find(vehicles => vehicles["id"] === idNum);
    }

    function addVehicles(vehicles) {
        fleetResourceManagementApi.createVehicles(vehicles).then(response => {
            const resource = response.data;
            const newVehicle = VehicleAssembler.toEntityFromResource(resource);
            vehicles.value.push(newVehicle);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function updateVehicles(vehicles) {
        fleetResourceManagementApi.updateVehicles(vehicles).then(response => {
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
        fleetResourceManagementApi.updateUsers(user).then(response => {
            const resource = response.data;
            const updatedUser = UserAssembler.toEntityFromResource(resource);
            const index = users.value.findIndex(t => t["id"] === updatedUser.id);
            if (index !== -1) users.value[index] = updatedUser;
        }).catch(error => {
            errors.value.push(error);
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
    return {
        // State
        vehicles,
        errors,
        vehiclesLoaded,
        users,
        usersLoaded,
        // Properties
        vehiclesCount,
        usersCount,
        // Actions
        fetchVehicles,
        fetchUsers,
        getVehiclesById,
        addVehicles,
        updateVehicles,
        deleteVehicles,
        getUsersById,
        addUsers,
        updateUsers,
        deleteUsers
    };

});

export default useStore;
