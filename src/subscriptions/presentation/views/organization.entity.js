export class Organization {
    /**
     * Creates an instance of Organization.
     * @param id
     * @param name
     * @param ruc
     * @param managerName
     */
    constructor({ id = null, name = '', ruc = '' }) {
        this.id = id;
        this.name = name;
        this.ruc = ruc;
    }
}

