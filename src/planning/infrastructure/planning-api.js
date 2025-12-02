import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoints.js";
import { RouteDraftAssembler } from './route-draft.assembler.js';
import { RouteAssembler } from './route.assembler.js';

const routeDraftsEndpointPath = import.meta.env.VITE_RUTANA_ROUTE_DRAFTS_ENDPOINT_PATH ?? '/api/v1/route-drafts';
const routesEndpointPath = import.meta.env.VITE_RUTANA_ROUTES_ENDPOINT_PATH ?? '/api/v1/routes';

export class PlanningApi extends BaseApi {
    #routeDraftsEndpointPath;
    #routesEndpointPath;
    
    constructor() {
        super();
        this.#routeDraftsEndpointPath = new BaseEndpoint(this, routeDraftsEndpointPath);
        this.#routesEndpointPath = new BaseEndpoint(this, routesEndpointPath);
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
}

export default PlanningApi;

