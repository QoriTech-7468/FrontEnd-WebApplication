export class Vehicle {
    /**
     * Creates an instance of Vehicle.
     * @param id - The unique identifier of the vehicle.
     * @param plate - The license plate of the vehicle.
     * @param capacity - The load capacity of the vehicle.
     * @param isActive - The current state of the vehicle (e.g., 'Enabled').
     */
    constructor({ id = null, plate = '', capacity = null, isActive = '' }) {
        this.id = id;
        this.plate = plate;
        this.capacityKg = capacityKg;
        this.isActive = isActive;
    }
}