import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoints.js";


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
    getAllLocations() { return this.#locations.getAll().then(r => r.data); }
    createLocation(payload) { return this.#locations.create(payload).then(r => r.data); }
    getLocationById(id) { return this.#locations.getById(id).then(r => r.data); }

    // --- Routes ---
    async getAllRoutes() {
        const resp = await this.#routes.getAll();
        return resp.data;
    }

    async getRouteById(id) {
        const resp = await this.#routes.getById(id);
        return resp.data;
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
        return resp.data;
    }

    async updateRoute(id, payload) {
        const resp = await this.#routes.update(id, payload);
        return resp.data;
    }

    async deleteRoute(id) {
        try {
            const resp = await this.http.delete(`${this.#routes.endpointPath}/${id}`);
            // json-server normalmente devuelve 200 o 204
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
        // json-server soporta PATCH
        const resp = await this.http.patch(`${this.#routes.endpointPath}/${id}`, { state: "published" });
        return resp.data;
    }

    // --- OBTENER LOCATIONS POR RUTA ---
    async getLocationsByRoute(routeId) {
        try {
            const response = await this.http.get(`${this.#locations.endpointPath}`, {
                params: { routeId }
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching locations by route:', err);
            throw err;
        }
    }

    // --- Deliveries ---
    getAllDeliveries() { return this.#deliveries.getAll().then(r => r.data); }

    async getDeliveriesByRoute(routeId) {
        try {
            const response = await this.http.get(`${this.#deliveries.endpointPath}`, {
                params: { routeId }
            });
            return response.data;
        } catch (err) {
            console.error('Error fetching deliveries by route:', err);
            throw err;
        }
    }

    async updateDelivery(id, payload) {
        try {
            const resp = await this.http.patch(`${this.#deliveries.endpointPath}/${id}`, payload);
            return resp.data;
        } catch (err) {
            console.error('Error updating delivery:', err);
            throw err;
        }
    }
}

export default RoutePlanningApi;