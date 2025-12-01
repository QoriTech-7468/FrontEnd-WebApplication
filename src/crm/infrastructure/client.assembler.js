import { Client } from "../domain/model/client.entity.js";
import { Location } from "../domain/model/locations.entity.js";

export class ClientAssembler {
    /**
     * Transform a resource into a Client entity
     * @param {Object} resource - API resource object
     * @returns {Client} - Client entity instance
     */
    static toEntityFromResource(resource) {
        // If the resource includes locations, create Location instances
        let locations = [];
        if (resource.locations && Array.isArray(resource.locations)) {
            locations = resource.locations.map(loc => {
                // Create Location entity from location data
                return new Location({
                    id: loc.id,
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    address: loc.address,
                    proximity: loc.proximity,
                    isActive: loc.isActive,
                    clientId: loc.clientId || resource.id,
                    client: null  // Don't create circular reference
                });
            });
        }

        return new Client({
            id: resource.id,
            name: resource.name,
            isActive: resource.isActive,
            locations: locations
        });
    }

    /**
     * Transform a response into an array of Client entities
     * @param {Object} response - API response object
     * @returns {Array<Client>} - Array of Client entities
     */
    static toEntitiesfromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : (response.data?.clients || []);
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
