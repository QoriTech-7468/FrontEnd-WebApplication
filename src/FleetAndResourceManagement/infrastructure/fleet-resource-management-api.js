import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoints.js";

const vehiclesEndpointPath = import.meta.env.VITE_RUTANA_VEHICLES_ENDPOINT_PATH;

export class FleetResourceManagementApi extends BaseApi {


    #vehiclesEndpointPath;
    constructor() {
        super();
        this.#vehiclesEndpointPath = new BaseEndpoint(this,  vehiclesEndpointPath);
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

}