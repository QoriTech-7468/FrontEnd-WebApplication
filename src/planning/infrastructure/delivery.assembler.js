import { Delivery } from '../domain/delivery.entity.js';
import { Client } from '../../crm/domain/model/client.entity.js';

export class DeliveryAssembler {
    /**
     * Transform a resource into a Delivery entity
     * @param {Object} resource - API resource object
     * @returns {Delivery} - Delivery entity instance
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

        // Handle locationId - if present, we'll need to fetch location data separately
        // For now, we'll store locationId and let the calling code handle fetching location details
        const locationId = resource.locationId || null;

        return new Delivery({
            id: resource.id,
            address: resource.address || '',
            latitude: resource.latitude || '',
            longitude: resource.longitude || '',
            proximity: resource.proximity || '',
            status: resource.status || 'pending',
            rejectReason: resource.rejectReason || resource.reject_reason || null,
            rejectDetails: resource.rejectDetails || resource.reject_details || null,
            clientId: resource.clientId || resource.client?.id,
            client: client,
            locationId: locationId  // Store locationId for later fetching
        });
    }

    /**
     * Transform a response into an array of Delivery entities
     * @param {Object} response - API response object
     * @returns {Array<Delivery>} - Array of Delivery entities
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Transform a Delivery entity or plain object into a resource for API requests
     * @param {Delivery|Object} delivery - Delivery entity instance or plain object
     * @returns {Object} - API resource object
     */
    static toResourceFromEntity(delivery) {
        const resource = {
            address: delivery.address || '',
            proximity: delivery.proximity || '',
            status: delivery.status || 'pending',
            clientId: delivery.clientId
        };

        // Include latitude and longitude only if they are present
        if (delivery.latitude !== null && delivery.latitude !== undefined && delivery.latitude !== '') {
            resource.latitude = String(delivery.latitude);
        }
        if (delivery.longitude !== null && delivery.longitude !== undefined && delivery.longitude !== '') {
            resource.longitude = String(delivery.longitude);
        }

        // Include rejection fields if present
        if (delivery.rejectReason !== null && delivery.rejectReason !== undefined && delivery.rejectReason !== '') {
            resource.rejectReason = delivery.rejectReason;
        }
        if (delivery.rejectDetails !== null && delivery.rejectDetails !== undefined && delivery.rejectDetails !== '') {
            resource.rejectDetails = delivery.rejectDetails;
        }

        // Include id only if it's not null (for updates)
        if (delivery.id !== null && delivery.id !== undefined) {
            resource.id = delivery.id;
        }

        return resource;
    }
}

export default DeliveryAssembler;
