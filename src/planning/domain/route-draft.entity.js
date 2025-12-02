import { Vehicle } from '../../fleets/domain/model/vehicle.entity.js';
import { TeamMember } from './team-member.entity.js';
import { Delivery } from './delivery.entity.js';

export class RouteDraft {
    /**
     * Creates an instance of RouteDraft.
     * @param {Object} params - RouteDraft parameters
     * @param {number|null} params.id - RouteDraft ID
     * @param {string} params.colorCode - Color code for the route (e.g., '#FF5733', 'blue')
     * @param {string|null} params.execution_date - Execution date for the route (ISO date string)
     * @param {Vehicle|null} params.vehicle - Associated Vehicle entity instance
     * @param {Array<TeamMember>} params.teamMembers - Array of TeamMember entities
     * @param {Array<Delivery>} params.deliveries - Array of Delivery entities
     */
    constructor({ 
        id = null,
        colorCode = '',
        execution_date = null,
        vehicle = null,
        teamMembers = [],
        deliveries = []
    }) {
        this.id = id;
        this.colorCode = colorCode;
        this.execution_date = execution_date;
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
     * Check if route draft has an associated vehicle
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
     * Add a team member to this route draft
     * @param {TeamMember} member - The team member to add
     */
    addTeamMember(member) {
        if (member instanceof TeamMember) {
            this.teamMembers.push(member);
        }
    }

    /**
     * Remove a team member from this route draft
     * @param {number} memberId - The team member ID to remove
     */
    removeTeamMember(memberId) {
        this.teamMembers = this.teamMembers.filter(member => member.id !== memberId);
    }

    /**
     * Add a delivery to this route draft
     * @param {Delivery} delivery - The delivery to add
     */
    addDelivery(delivery) {
        if (delivery instanceof Delivery) {
            this.deliveries.push(delivery);
        }
    }

    /**
     * Remove a delivery from this route draft
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
}

