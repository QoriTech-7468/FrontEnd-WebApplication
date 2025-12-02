import { RouteDraft } from '../domain/route-draft.entity.js';
import { Vehicle } from '../../fleets/domain/model/vehicle.entity.js';
import { TeamMember } from '../domain/team-member.entity.js';
import { Delivery } from '../domain/delivery.entity.js';
import { TeamMemberAssembler } from './team-member.assembler.js';
import { DeliveryAssembler } from './delivery.assembler.js';

export class RouteDraftAssembler {
    /**
     * Transform a resource into a RouteDraft entity
     * @param {Object} resource - API resource object
     * @returns {RouteDraft} - RouteDraft entity instance
     */
    static toEntityFromResource(resource) {
        // If the resource includes vehicle data, create the Vehicle instance
        let vehicle = null;
        if (resource.vehicle) {
            vehicle = new Vehicle({
                id: resource.vehicle.id,
                plate: resource.vehicle.plate || '',
                capacityKg: resource.vehicle.capacityKg || resource.vehicle.capacity,
                state: resource.vehicle.state || resource.vehicle.isActive || 'Enabled'
            });
        }

        // Transform team members if present
        const teamMembers = resource.teamMembers 
            ? resource.teamMembers.map(member => TeamMemberAssembler.toEntityFromResource(member))
            : [];

        // Transform deliveries if present
        const deliveries = resource.deliveries
            ? resource.deliveries.map(delivery => DeliveryAssembler.toEntityFromResource(delivery))
            : [];

        return new RouteDraft({
            id: resource.id,
            colorCode: resource.colorCode || '',
            executionDate: resource.executionDate || resource.execution_date || null,
            vehicle: vehicle,
            teamMembers: teamMembers,
            deliveries: deliveries
        });
    }

    /**
     * Transform a response into an array of RouteDraft entities
     * @param {Object} response - API response object
     * @returns {Array<RouteDraft>} - Array of RouteDraft entities
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
     * Transform a RouteDraft entity or plain object into a resource for API requests
     * @param {RouteDraft|Object} routeDraft - RouteDraft entity instance or plain object
     * @param {boolean} isUpdate - If true, it's an update (PUT), if false, it's creation (POST)
     * @returns {Object} - API resource object
     */
    static toResourceFromEntity(routeDraft, isUpdate = false) {
        const resource = {
            colorCode: routeDraft.colorCode || ''
        };

        // Include executionDate if present
        if (routeDraft.executionDate !== null && routeDraft.executionDate !== undefined && routeDraft.executionDate !== '') {
            resource.executionDate = routeDraft.executionDate;
        }

        // Para creaciones, incluir organizationId
        if (!isUpdate) {
            let organizationId = null;
            try {
                const userDataStr = localStorage.getItem('userData');
                if (userDataStr) {
                    const userData = JSON.parse(userDataStr);
                    organizationId = userData.organizationId;
                }
            } catch (error) {
                console.error('Error getting organizationId from localStorage:', error);
            }

            if (organizationId !== null && organizationId !== undefined) {
                resource.organizationId = organizationId;
            }
        }

        // Include vehicleId if vehicle is present
        if (routeDraft.vehicle && routeDraft.vehicle.id !== null && routeDraft.vehicle.id !== undefined) {
            resource.vehicleId = routeDraft.vehicle.id;
        }

        // Include team member IDs if present
        if (routeDraft.teamMembers && Array.isArray(routeDraft.teamMembers) && routeDraft.teamMembers.length > 0) {
            resource.teamMemberIds = routeDraft.teamMembers
                .map(member => member.id)
                .filter(id => id !== null && id !== undefined);
        }

        // Include delivery IDs if present
        if (routeDraft.deliveries && Array.isArray(routeDraft.deliveries) && routeDraft.deliveries.length > 0) {
            resource.deliveryIds = routeDraft.deliveries
                .map(delivery => delivery.id)
                .filter(id => id !== null && id !== undefined);
        }

        // Include id only if it's not null (for updates)
        if (routeDraft.id !== null && routeDraft.id !== undefined) {
            resource.id = routeDraft.id;
        }

        return resource;
    }
}

export default RouteDraftAssembler;

