import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoints.js";

const clientsEndpointPath = import.meta.env.VITE_RUTANA_CLIENTS_ENDPOINT_PATH;
const locationEndpointPath = import.meta.env.VITE_RUTANA_LOCATIONS_ENDPOINT_PATH;


export class CustomerLocationManagementApi extends BaseApi {
    #clientsEndpointPath
    #locationEndpointPath
    constructor() {
        super();
        this.#clientsEndpointPath = new BaseEndpoint(this,  clientsEndpointPath);
        this.#locationEndpointPath = new BaseEndpoint(this,  locationEndpointPath);
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
