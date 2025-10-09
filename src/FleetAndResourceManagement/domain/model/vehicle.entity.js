export class Vehicle{

    /**
     * Creates an instance of Category.
     * @param id - The unique identifier of the category.
     * @param plate - The name of the category.
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
