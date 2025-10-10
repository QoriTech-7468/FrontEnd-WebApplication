export class Vehicle{

    /**
     * Creates an instance of Vehicle.
     * @param id
     * @param plate
     * @param capacity
     * @param availability
     */
    constructor({id=null,plate= '',capacity=null,availability= ''}) {
        this.id = id;
        this.plate = plate;
        this.capacity = capacity;
        this.isActive = availability
    }
}
