import { Location } from './locations.entity.js';

export class Client {
    /**
     * Creates an instance of client.
     * @param {Object} params - Client parameters
     * @param {number|null} params.id - Client ID
     * @param {string} params.name - Client name
     * @param {boolean|null} params.isActive - Active status
     * @param {Array<Location>} params.locations - Array of Location entities
     */
    constructor({ id = null, name = '', isActive = null, locations = [] }) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
        // Array of Location entities
        this.locations = Array.isArray(locations)
            ? locations.filter(loc => loc instanceof Location)
            : [];
    }

    /**
     * Add a location to this client
     * @param {Location} location - The location to add
     */
    addLocation(location) {
        if (location instanceof Location) {
            this.locations.push(location);
        }
    }

    /**
     * Remove a location from this client
     * @param {number} locationId - The location ID to remove
     */
    removeLocation(locationId) {
        this.locations = this.locations.filter(loc => loc.id !== locationId);
    }

    /**
     * Get active locations only
     * @returns {Array<Location>} - Array of active locations
     */
    getActiveLocations() {
        return this.locations.filter(loc => loc.isActive === true);
    }
}
