import { Vehicle } from '../../fleets/domain/model/vehicle.entity.js';
import { TeamMember } from './team-member.entity.js';
import { Delivery } from './delivery.entity.js';

export class Route {
    /**
     * Creates an instance of Route.
     * @param {Object} params - Route parameters
     * @param {number|null} params.id - Route ID
     * @param {string} params.colorCode - Color code for the route (e.g., '#FF5733', 'blue')
     * @param {string|null} params.execution_date - Execution date for the route (ISO date string)
     * @param {string|null} params.started_at - Start date/time of the route (ISO date string)
     * @param {string|null} params.ended_at - End date/time of the route (ISO date string)
     * @param {string} params.status - Route status (e.g., 'pending', 'in_progress', 'completed', 'cancelled')
     * @param {Vehicle|null} params.vehicle - Associated Vehicle entity instance
     * @param {Array<TeamMember>} params.teamMembers - Array of TeamMember entities
     * @param {Array<Delivery>} params.deliveries - Array of Delivery entities
     */
    constructor({ 
        id = null,
        colorCode = '',
        execution_date = null,
        started_at = null,
        ended_at = null,
        status = 'pending',
        vehicle = null,
        teamMembers = [],
        deliveries = []
    }) {
        this.id = id;
        this.colorCode = colorCode;
        this.execution_date = execution_date;
        this.started_at = started_at;
        this.ended_at = ended_at;
        this.status = status;
        this.vehicle = vehicle instanceof Vehicle ? vehicle : null;
        // Array of TeamMember entities
        this.teamMembers = Array.isArray(teamMembers)
            ? teamMembers.filter(member => member instanceof TeamMember)
            : [];
        // Array of Delivery entities
        this.deliveries = Array.isArray(deliveries)
            ? deliveries.filter(delivery => delivery instanceof Delivery)
            : [];
    }

    /**
     * Get vehicle plate (helper method)
     * @returns {string} - Vehicle plate or empty string
     */
    getVehiclePlate() {
        return this.vehicle ? this.vehicle.plate : '';
    }

    /**
     * Check if route has an associated vehicle
     * @returns {boolean} - True if vehicle is set
     */
    hasVehicle() {
        return this.vehicle !== null;
    }

    /**
     * Get total number of team members
     * @returns {number} - Number of team members
     */
    getTeamMembersCount() {
        return this.teamMembers.length;
    }

    /**
     * Get total number of deliveries
     * @returns {number} - Number of deliveries
     */
    getDeliveriesCount() {
        return this.deliveries.length;
    }

    /**
     * Add a team member to this route
     * @param {TeamMember} member - The team member to add
     */
    addTeamMember(member) {
        if (member instanceof TeamMember) {
            this.teamMembers.push(member);
        }
    }

    /**
     * Remove a team member from this route
     * @param {number} memberId - The team member ID to remove
     */
    removeTeamMember(memberId) {
        this.teamMembers = this.teamMembers.filter(member => member.id !== memberId);
    }

    /**
     * Add a delivery to this route
     * @param {Delivery} delivery - The delivery to add
     */
    addDelivery(delivery) {
        if (delivery instanceof Delivery) {
            this.deliveries.push(delivery);
        }
    }

    /**
     * Remove a delivery from this route
     * @param {number} deliveryId - The delivery ID to remove
     */
    removeDelivery(deliveryId) {
        this.deliveries = this.deliveries.filter(delivery => delivery.id !== deliveryId);
    }

    /**
     * Get deliveries with valid coordinates
     * @returns {Array<Delivery>} - Array of deliveries with valid coordinates
     */
    getDeliveriesWithCoordinates() {
        return this.deliveries.filter(delivery => delivery.hasValidCoordinates());
    }

    /**
     * Check if route is in progress
     * @returns {boolean} - True if status is 'in_progress'
     */
    isInProgress() {
        return this.status === 'in_progress';
    }

    /**
     * Check if route is completed
     * @returns {boolean} - True if status is 'completed'
     */
    isCompleted() {
        return this.status === 'completed';
    }

    /**
     * Check if route is cancelled
     * @returns {boolean} - True if status is 'cancelled'
     */
    isCancelled() {
        return this.status === 'cancelled';
    }

    /**
     * Check if route has started
     * @returns {boolean} - True if started_at is set
     */
    hasStarted() {
        return this.started_at !== null && this.started_at !== '';
    }

    /**
     * Check if route has ended
     * @returns {boolean} - True if ended_at is set
     */
    hasEnded() {
        return this.ended_at !== null && this.ended_at !== '';
    }
}

