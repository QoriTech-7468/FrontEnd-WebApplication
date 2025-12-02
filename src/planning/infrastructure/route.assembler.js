import { Route } from '../domain/route.entity.js';
import { Vehicle } from '../../fleets/domain/model/vehicle.entity.js';
import { TeamMember } from '../domain/team-member.entity.js';
import { Delivery } from '../domain/delivery.entity.js';
import { TeamMemberAssembler } from './team-member.assembler.js';
import { DeliveryAssembler } from './delivery.assembler.js';

export class RouteAssembler {
    /**
     * Transform a resource into a Route entity
     * @param {Object} resource - API resource object
     * @returns {Route} - Route entity instance
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

        return new Route({
            id: resource.id,
            colorCode: resource.colorCode || '',
            executionDate: resource.executionDate || resource.execution_date || null,
            startedAt: resource.startedAt || resource.started_at || null,
            endedAt: resource.endedAt || resource.ended_at || null,
            status: resource.status || 'pending',
            vehicle: vehicle,
            teamMembers: teamMembers,
            deliveries: deliveries
        });
    }

    /**
     * Transform a response into an array of Route entities
     * @param {Object} response - API response object
     * @returns {Array<Route>} - Array of Route entities
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
     * Transform a Route entity or plain object into a resource for API requests
     * @param {Route|Object} route - Route entity instance or plain object
     * @returns {Object} - API resource object
     */
    static toResourceFromEntity(route) {
        const resource = {
            colorCode: route.colorCode || '',
            status: route.status || 'pending'
        };

        // Include executionDate if present
        if (route.executionDate !== null && route.executionDate !== undefined && route.executionDate !== '') {
            resource.executionDate = route.executionDate;
        }

        // Include startedAt if present
        if (route.startedAt !== null && route.startedAt !== undefined && route.startedAt !== '') {
            resource.startedAt = route.startedAt;
        }

        // Include endedAt if present
        if (route.endedAt !== null && route.endedAt !== undefined && route.endedAt !== '') {
            resource.endedAt = route.endedAt;
        }

        // Include vehicleId if vehicle is present
        if (route.vehicle && route.vehicle.id !== null && route.vehicle.id !== undefined) {
            resource.vehicleId = route.vehicle.id;
        }

        // Include team member IDs if present
        if (route.teamMembers && Array.isArray(route.teamMembers) && route.teamMembers.length > 0) {
            resource.teamMemberIds = route.teamMembers
                .map(member => member.id)
                .filter(id => id !== null && id !== undefined);
        }

        // Include delivery IDs if present
        if (route.deliveries && Array.isArray(route.deliveries) && route.deliveries.length > 0) {
            resource.deliveryIds = route.deliveries
                .map(delivery => delivery.id)
                .filter(id => id !== null && id !== undefined);
        }

        // Include id only if it's not null (for updates)
        if (route.id !== null && route.id !== undefined) {
            resource.id = route.id;
        }

        return resource;
    }
}

export default RouteAssembler;
