import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoints.js";
import RouteAssembler from './route.assembler.js';
import DeliveryAssembler from './delivery.assembler.js';
import LocationAssembler from './location.assembler.js';

const usersEndpointPath = import.meta.env.VITE_RUTANA_USERS_ENDPOINT_PATH ?? '/user';
const vehiclesEndpointPath = import.meta.env.VITE_RUTANA_VEHICLES_ENDPOINT_PATH ?? '/vehicles';
const routesEndpointPath = import.meta.env.VITE_RUTANA_ROUTES_ENDPOINT_PATH ?? '/routes';
const locationsEndpointPath = import.meta.env.VITE_RUTANA_LOCATIONS_ENDPOINT_PATH ?? '/locations';
const customersEndpointPath = import.meta.env.VITE_RUTANA_CUSTOMERS_ENDPOINT_PATH ?? '/customers';
const deliveriesEndpointPath = import.meta.env.VITE_RUTANA_DELIVERIES_ENDPOINT_PATH ?? '/deliveries';

export class RoutePlanningApi extends BaseApi {
    #users;
    #vehicles;
    #routes;
    #locations;
    #customers;
    #deliveries;

    constructor() {
        super();
        this.#users = new BaseEndpoint(this, usersEndpointPath);
        this.#vehicles = new BaseEndpoint(this, vehiclesEndpointPath);
        this.#routes = new BaseEndpoint(this, routesEndpointPath);
        this.#locations = new BaseEndpoint(this, locationsEndpointPath);
        this.#customers = new BaseEndpoint(this, customersEndpointPath);
        this.#deliveries = new BaseEndpoint(this, deliveriesEndpointPath);
    }

    // --- Users ---
    getAllUsers() { return this.#users.getAll().then(r => r.data); }
    getUserById(id) { return this.#users.getById(id).then(r => r.data); }

    // --- Vehicles ---
    getAllVehicles() { return this.#vehicles.getAll().then(r => r.data); }
    getVehicleById(id) { return this.#vehicles.getById(id).then(r => r.data); }

    // --- Customers & Locations ---
    getAllCustomers() { return this.#customers.getAll().then(r => r.data); }

    async getAllLocations() {
        const resp = await this.#locations.getAll();
        return LocationAssembler.toEntitiesFromResponse(resp);
    }

    async createLocation(payload) {
        const resp = await this.#locations.create(payload);
        return LocationAssembler.toEntityFromResource(resp.data);
    }

    async getLocationById(id) {
        const resp = await this.#locations.getById(id);
        return LocationAssembler.toEntityFromResource(resp.data);
    }

    // --- Routes ---
    async getAllRoutes() {
        const resp = await this.#routes.getAll();
        return RouteAssembler.toEntitiesFromResponse(resp);
    }

    async getRouteById(id) {
        const resp = await this.#routes.getById(id);
        return RouteAssembler.toEntityFromResource(resp.data);
    }

    async createRoute(route) {
        const newRoute = {
            ...route,
            state: route.state ?? "draft",
            createdAt: route.createdAt ?? new Date().toISOString(),
            startedAt: route.startedAt ?? null,
            finishedAt: route.finishedAt ?? null
        };
        const resp = await this.#routes.create(newRoute);
        return RouteAssembler.toEntityFromResource(resp.data);
    }

    async updateRoute(id, payload) {
        const resp = await this.#routes.update(id, payload);
        return RouteAssembler.toEntityFromResource(resp.data);
    }

    async deleteRoute(id) {
        try {
            const resp = await this.http.delete(`${this.#routes.endpointPath}/${id}`);
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
        const resp = await this.http.patch(`${this.#routes.endpointPath}/${id}`, { state: "published" });
        return RouteAssembler.toEntityFromResource(resp.data);
    }

    // --- OBTENER LOCATIONS POR RUTA ---
    async getLocationsByRoute(routeId) {
        try {
            const response = await this.http.get(`${this.#locations.endpointPath}`, {
                params: { routeId }
            });
            return LocationAssembler.toEntitiesFromResponse(response);
        } catch (err) {
            console.error('Error fetching locations by route:', err);
            throw err;
        }
    }

    // --- Deliveries ---
    async getAllDeliveries() {
        const resp = await this.#deliveries.getAll();
        return DeliveryAssembler.toEntitiesFromResponse(resp);
    }

    async getDeliveriesByRoute(routeId) {
        try {
            const response = await this.http.get(`${this.#deliveries.endpointPath}`, {
                params: { routeId }
            });
            return DeliveryAssembler.toEntitiesFromResponse(response);
        } catch (err) {
            console.error('Error fetching deliveries by route:', err);
            throw err;
        }
    }

    async updateDelivery(id, payload) {
        try {
            const resp = await this.http.patch(`${this.#deliveries.endpointPath}/${id}`, payload);
            return DeliveryAssembler.toEntityFromResource(resp.data);
        } catch (err) {
            console.error('Error updating delivery:', err);
            throw err;
        }
    }

    async createDelivery(payload) {
        try {
            const resp = await this.http.post(`${this.#deliveries.endpointPath}`, payload);
            return DeliveryAssembler.toEntityFromResource(resp.data);
        } catch (err) {
            console.error('Error creating delivery:', err);
            throw err;
        }
    }

    // --- Route-Locations (relación muchos a muchos) ---
    async getRouteLocations(routeId) {
        try {
            const response = await this.http.get('/route-locations', {
                params: { routeId }
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching route-locations:', err);
            throw err;
        }
    }
}

export default RoutePlanningApi;