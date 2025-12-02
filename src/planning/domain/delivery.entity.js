import { Client } from '../../crm/domain/model/client.entity.js';

export class Delivery {
    /**
     * Creates an instance of Delivery.
     * @param {Object} params - Delivery parameters
     * @param {number|null} params.id - Delivery ID
     * @param {string} params.address - Physical address
     * @param {string} params.latitude - Latitude coordinate
     * @param {string} params.longitude - Longitude coordinate
     * @param {string} params.proximity - Proximity type (close, mid, far)
     * @param {string} params.status - Delivery status (e.g., 'pending', 'assigned', 'in_transit', 'delivered', 'rejected')
     * @param {string|null} params.rejectReason - Reason for rejection (if status is 'rejected')
     * @param {string|null} params.rejectDetails - Additional details about rejection
     * @param {number|null} params.clientId - Associated client ID
     * @param {Client|null} params.client - Associated Client entity instance
     */
    constructor({ 
        id = null,
        address = '', 
        latitude = '', 
        longitude = '', 
        proximity = '', 
        status = 'pending',
        rejectReason = '',
        rejectDetails = '',
        clientId = null,
        client = null,
        locationId = null,
        executionDate = null
    }) {
        this.id = id;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.proximity = proximity;
        this.status = status;
        this.rejectReason = rejectReason;
        this.rejectDetails = rejectDetails;
        this.clientId = clientId;  // ID for quick references
        this.client = client instanceof Client ? client : null;  // Full Client instance
        this.locationId = locationId;  // Location ID reference (for route drafts)
        this.executionDate = executionDate;
    }

    /**
     * Get client name (helper method)
     * @returns {string} - Client name or empty string
     */
    getClientName() {
        return this.client ? this.client.name : '';
    }

    /**
     * Check if delivery has an associated client
     * @returns {boolean} - True if client is set
     */
    hasClient() {
        return this.client !== null;
    }

    /**
     * Check if delivery is rejected
     * @returns {boolean} - True if status is 'rejected'
     */
    isRejected() {
        return this.status === 'rejected';
    }

    /**
     * Check if delivery has rejection details
     * @returns {boolean} - True if rejected and has rejection information
     */
    hasRejectionInfo() {
        return this.isRejected() && (this.rejectReason || this.rejectDetails);
    }

    /**
     * Check if delivery has valid coordinates
     * @returns {boolean} - True if both latitude and longitude are valid
     */
    hasValidCoordinates() {
        const lat = parseFloat(this.latitude);
        const lng = parseFloat(this.longitude);
        return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    }
}

