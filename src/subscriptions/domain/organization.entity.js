import { User } from '../../iam/domain/user.entity.js';

export class Organization {
    /**
     * Creates an instance of Organization.
     * @param id
     * @param name
     * @param ruc
     * @param user
     */
    constructor({ id = null, name = '', ruc = '', user = null }) {
        this.id = id;
        this.name = name;
        this.ruc = ruc;
        this.user = user instanceof User ? user : null;
    }
}

