import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoints.js";

const vehiclesEndpointPath = import.meta.env.VITE_RUTANA_VEHICLES_ENDPOINT_PATH;
const usersEndpointPath = import.meta.env.VITE_RUTANA_USERS_ENDPOINT_PATH;

export class FleetResourceManagementApi extends BaseApi {


    #vehiclesEndpointPath;
    #usersEndpointPath;
    constructor() {
        super();
        this.#vehiclesEndpointPath = new BaseEndpoint(this,  vehiclesEndpointPath);
        this.#usersEndpointPath = new BaseEndpoint(this,  usersEndpointPath);

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



}