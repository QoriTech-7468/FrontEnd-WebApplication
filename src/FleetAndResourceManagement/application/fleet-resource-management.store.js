import {FleetResourceManagementApi} from "../infrastructure/fleet-resource-management-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {VehicleAssembler} from "../infrastructure/vehicle.assembler.js";


const fleetResourceManagementApi = new FleetResourceManagementApi();

const useStore = defineStore('vehicles', () => {

    // State
    const vehicles = ref([]);
    const errors = ref([]);
    const vehiclesLoaded = ref(false);

    // Properties
    const vehiclesCount = computed(() => {
        return vehiclesLoaded ? vehicles.value.length : 0; });


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

    return {
        // State
        vehicles,
        errors,
        vehiclesLoaded,
        // Properties
        vehiclesCount,
        // Actions
        fetchVehicles,
        getVehiclesById,
        addVehicles,
        updateVehicles,
        deleteVehicles,
    };

});

export default useStore;
