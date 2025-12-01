import { Location } from "../domain/model/locations.entity.js";
import { Client } from "../domain/model/client.entity.js";

export class LocationAssembler {
    /**
     * Transform a resource into a Location entity
     * @param {Object} resource - API resource object
     * @returns {Location} - Location entity instance
     */
    static toEntityFromResource(resource) {
        // If the resource includes client data, create the Client instance
        let client = null;
        if (resource.client) {
            client = new Client({
                id: resource.client.id,
                name: resource.client.name,
                isActive: resource.client.isActive,
                locations: []  // Don't include locations in client to avoid circular reference
            });
        }

        return new Location({
            id: resource.id,
            latitude: resource.latitude,
            longitude: resource.longitude,
            address: resource.address,
            proximity: resource.proximity,
            isActive: resource.isActive,
            clientId: resource.clientId || resource.client?.id,
            client: client
        });
    }

    /**
     * Transform a response into an array of Location entities
     * @param {Object} response - API response object
     * @returns {Array<Location>} - Array of Location entities
     */
    static toEntitiesfromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
