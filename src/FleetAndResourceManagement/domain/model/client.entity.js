export class Client{

    /**
     * Creates an instance of client.
     * @param id
     * @param name
     * @param isActive
     */
    constructor({id=null,name= '',isActive=null}) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
    }
}
