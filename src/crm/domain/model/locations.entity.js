import { Client } from './client.entity.js';

export class Location {
    /**
     * Creates an instance of Location.
     * @param {Object} params - Location parameters
     * @param {number|null} params.id - Location ID
     * @param {string} params.latitude - Latitude coordinate
     * @param {string} params.longitude - Longitude coordinate
     * @param {string} params.address - Physical address
     * @param {string} params.proximity - Proximity type (close, mid, far)
     * @param {boolean|string} params.isActive - Active status
     * @param {number|null} params.clientId - Associated client ID
     * @param {Client|null} params.client - Associated Client entity instance
     */
    constructor({ 
        id = null,
        latitude = '', 
        longitude = '', 
        address = '', 
        proximity = '', 
        isActive = '', 
        clientId = null,
        client = null
    }) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.proximity = proximity;
        this.isActive = isActive;
        this.clientId = clientId;  // ID for quick references
        this.client = client instanceof Client ? client : null;  // Full Client instance
    }

    /**
     * Get client name (helper method)
     * @returns {string} - Client name or empty string
     */
    getClientName() {
        return this.client ? this.client.name : '';
    }

    /**
     * Check if location has an associated client
     * @returns {boolean} - True if client is set
     */
    hasClient() {
        return this.client !== null;
    }
}
