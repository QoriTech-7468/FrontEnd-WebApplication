import { Organization } from '../../subscriptions/domain/organization.entity.js';

export class User {
    /**
     * Creates an instance of User.
     * @param id
     * @param name
     * @param surname
     * @param email
     * @param organizationId
     * @param organization
     * @param role
     */
    constructor({ id = null, name = '', surname = '', email = '', organizationId = null, organization = null, role = '' }) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.organizationId = organizationId;
        this.organization = organization instanceof Organization ? organization : null;
        this.role = role;
    }
}