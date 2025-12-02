import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoints.js";
import { RouteDraftAssembler } from './route-draft.assembler.js';
import { RouteAssembler } from './route.assembler.js';
import { DeliveryAssembler } from './delivery.assembler.js';

const routeDraftsEndpointPath = import.meta.env.VITE_RUTANA_ROUTE_DRAFTS_ENDPOINT_PATH;
const routesEndpointPath = import.meta.env.VITE_RUTANA_ROUTES_ENDPOINT_PATH ;
const usersEndpointPath = import.meta.env.VITE_RUTANA_USERS_ENDPOINT_PATH ;
const vehiclesEndpointPath = import.meta.env.VITE_RUTANA_VEHICLES_ENDPOINT_PATH;
const locationsEndpointPath = import.meta.env.VITE_RUTANA_LOCATIONS_ENDPOINT_PATH;
const deliveriesEndpointPath = import.meta.env.VITE_RUTANA_DELIVERIES_ENDPOINT_PATH;

export class PlanningApi extends BaseApi {
    #routeDraftsEndpointPath;
    #routesEndpointPath;
    #usersEndpointPath;
    #vehiclesEndpointPath;
    #locationsEndpointPath;
    #deliveriesEndpointPath;
    
    constructor() {
        super();
        this.#routeDraftsEndpointPath = new BaseEndpoint(this, routeDraftsEndpointPath);
        this.#routesEndpointPath = new BaseEndpoint(this, routesEndpointPath);
        this.#usersEndpointPath = new BaseEndpoint(this, usersEndpointPath);
        this.#vehiclesEndpointPath = new BaseEndpoint(this, vehiclesEndpointPath);
        this.#locationsEndpointPath = new BaseEndpoint(this, locationsEndpointPath);
        this.#deliveriesEndpointPath = new BaseEndpoint(this, deliveriesEndpointPath);
    }

    // --- Users ---
    getUserById(id) {
        return this.#usersEndpointPath.getById(id).then(r => r.data);
    }

    // --- Vehicles ---
    getAllVehicles() {
        return this.#vehiclesEndpointPath.getAll().then(r => r.data);
    }

    /**
     * Get route drafts by execution date
     * @param {string} executionDate - Execution date in ISO date-time format (e.g., '2025-12-02T08:10:46.891Z')
     * @returns {Promise} - A promise resolving to the list of route drafts
     */
    getRouteDrafts(executionDate) {
        const params = {};
        if (executionDate) {
            params.executionDate = executionDate;
        }
        return this.#routeDraftsEndpointPath.getAll(params);
    }

    /**
     * Get route draft by id
     * @param {number|string} id - Route draft ID
     * @returns {Promise} - A promise resolving to the route draft
     */
    async getRouteDraftById(id) {
        const resp = await this.#routeDraftsEndpointPath.getById(id);
        return RouteDraftAssembler.toEntityFromResource(resp.data);
    }

    /**
     * Create a new route draft
     * @param {RouteDraft|Object} routeDraft - RouteDraft entity or plain object
     * @returns {Promise} - A promise resolving to the created route draft
     */
    async createRouteDraft(routeDraft) {
        const resource = RouteDraftAssembler.toResourceFromEntity(routeDraft);
        const resp = await this.#routeDraftsEndpointPath.create(resource);
        return RouteDraftAssembler.toEntityFromResource(resp.data);
    }

    /**
     * Get routes by execution date
     * @param {string} executionDate - Execution date in ISO date-time format (e.g., '2025-12-02T08:10:46.891Z')
     * @returns {Promise} - A promise resolving to the list of routes
     */
    getRoutes(executionDate) {
        const params = {};
        if (executionDate) {
            params.executionDate = executionDate;
        }
        return this.#routesEndpointPath.getAll(params);
    }

    // --- Legacy Routes Methods (for backward compatibility) ---
    async getAllRoutes() {
        const resp = await this.#routesEndpointPath.getAll();
        return RouteAssembler.toEntitiesFromResponse(resp);
    }

    async getRouteById(id) {
        const resp = await this.#routesEndpointPath.getById(id);
        return RouteAssembler.toEntityFromResource(resp.data);
    }

    async createRoute(route) {
        const resource = RouteAssembler.toResourceFromEntity(route);
        const resp = await this.#routesEndpointPath.create(resource);
        return RouteAssembler.toEntityFromResource(resp.data);
    }

    async updateRoute(id, payload) {
        const resp = await this.#routesEndpointPath.update(id, payload);
        return RouteAssembler.toEntityFromResource(resp.data);
    }

    async deleteRoute(id) {
        try {
            const resp = await this.http.delete(`${this.#routesEndpointPath.endpointPath}/${id}`);
            if (![200, 204].includes(resp.status)) {
                throw new Error(`Unexpected status deleting route ${id}: ${resp.status}`);
            }
            return resp;
        } catch (err) {
            console.error("Error deleting route:", err);
            throw err;
        }
    }

    async publishRoute(id) {
        const resp = await this.http.patch(`${this.#routesEndpointPath.endpointPath}/${id}`, { state: "published" });
        return RouteAssembler.toEntityFromResource(resp.data);
    }

    // --- Locations ---
    async getLocationsByRoute(routeId) {
        try {
            const response = await this.http.get(`${this.#locationsEndpointPath.endpointPath}`, {
                params: { routeId }
            });
            // Assuming LocationAssembler exists
            return response.data;
        } catch (err) {
            console.error('Error fetching locations by route:', err);
            throw err;
        }
    }

    // --- Deliveries ---
    async getDeliveriesByRoute(routeId) {
        try {
            const response = await this.http.get(`${this.#deliveriesEndpointPath.endpointPath}`, {
                params: { routeId }
            });
            return DeliveryAssembler.toEntitiesFromResponse(response);
        } catch (err) {
            console.error('Error fetching deliveries by route:', err);
            throw err;
        }
    }

    async createDelivery(payload) {
        try {
            const resp = await this.http.post(`${this.#deliveriesEndpointPath.endpointPath}`, payload);
            return DeliveryAssembler.toEntityFromResource(resp.data);
        } catch (err) {
            console.error('Error creating delivery:', err);
            throw err;
        }
    }

    async updateDelivery(id, payload) {
        try {
            const resp = await this.http.patch(`${this.#deliveriesEndpointPath.endpointPath}/${id}`, payload);
            return DeliveryAssembler.toEntityFromResource(resp.data);
        } catch (err) {
            console.error('Error updating delivery:', err);
            throw err;
        }
    }
}

export default PlanningApi;

