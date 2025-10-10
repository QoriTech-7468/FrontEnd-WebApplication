import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoints.js";

const vehiclesEndpointPath = import.meta.env.VITE_RUTANA_VEHICLES_ENDPOINT_PATH;
const usersEndpointPath = import.meta.env.VITE_RUTANA_USERS_ENDPOINT_PATH;
const clientsEndpointPath = import.meta.env.VITE_RUTANA_CLIENTS_ENDPOINT_PATH;
const locationEndpointPath = import.meta.env.VITE_RUTANA_LOCATIONS_ENDPOINT_PATH;


export class FleetResourceManagementApi extends BaseApi {


    #vehiclesEndpointPath;
    #usersEndpointPath;
    #clientsEndpointPath
    #locationEndpointPath
    constructor() {
        super();
        this.#vehiclesEndpointPath = new BaseEndpoint(this,  vehiclesEndpointPath);
        this.#usersEndpointPath = new BaseEndpoint(this,  usersEndpointPath);
        this.#clientsEndpointPath = new BaseEndpoint(this,  clientsEndpointPath);
        this.#locationEndpointPath = new BaseEndpoint(this,  locationEndpointPath);
    }
    
    getVehicles() {
        return this.#vehiclesEndpointPath.getAll();
    }
    getVehiclesById(id) {
        return this.#vehiclesEndpointPath.getById(id);
    }
    createVehicles(resource) {

        return this.#vehiclesEndpointPath.create(resource);
    }
    updateVehicles(resource) {
        return this.#vehiclesEndpointPath.update(resource.id, resource);
    }
    deleteVehicles(id) {
        return this.#vehiclesEndpointPath.delete(id);
    }



    getUsers() {
        return this.#usersEndpointPath.getAll();
    }
    getUsersById(id) {
        return this.#usersEndpointPath.getById(id);
    }
    createUsers(resource) {
        return this.#usersEndpointPath.create(resource);
    }
    updateUsers(resource) {
        return this.#usersEndpointPath.update(resource.id, resource);
    }
    deleteUsers(id) {
        return this.#usersEndpointPath.delete(id);
    }



    getClients() {
        return this.#clientsEndpointPath.getAll();
    }


    getClientsById(id) {
        return this.#clientsEndpointPath.getById(id);
    }

    createClients(resource) {
        return this.#clientsEndpointPath.create(resource);
    }

    updateClients(resource) {
        return this.#clientsEndpointPath.update(resource.id, resource);
    }

    deleteClients(id) {
        return this.#clientsEndpointPath.delete(id);
    }

    getLocations(resource) {
        return this.#locationEndpointPath.getAll();
    }


    getLocationsById(id) {
        return this.#locationEndpointPath.getById(id);
    }

    createLocations(resource) {
        return this.#locationEndpointPath.create(resource);
    }

    updateLocations(resource) {
        return this.#locationEndpointPath.update(resource.id, resource);
    }

    deleteLocations(id) {
        return this.#locationEndpointPath.delete(id);
    }

}