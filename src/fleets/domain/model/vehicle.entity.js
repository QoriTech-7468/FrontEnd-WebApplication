export class Vehicle {
    /**
     * Creates an instance of Vehicle.
     * @param id - The unique identifier of the vehicle.
     * @param plate - The license plate of the vehicle.
     * @param capacity - The load capacity of the vehicle.
     * @param state - The current state of the vehicle ('Enabled' or 'Disabled').
     */
    constructor({ id = null, plate = '', capacity = null, capacityKg = null, state = 'Enabled', isActive = null }) {
        this.id = id;
        this.plate = plate;
        this.capacityKg = capacityKg || capacity;
        // Support both 'state' and 'isActive' for backward compatibility
        this.state = state || (isActive === 'Enabled' || isActive === 'Disabled' ? isActive : 'Enabled');
    }
}