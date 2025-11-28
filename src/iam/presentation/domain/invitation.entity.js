import { Organization } from '../../subscriptions/presentation/views/organization.entity.js';

export class Invitation {
    /**
     * Creates an instance of Invitation.
     * @param id
     * @param code
     * @param email
     * @param organization
     */
    constructor({ id = null, code = '', email = '', organization = null, userId = null, role = '', status = '', createdAt = null }) {
        this.id = id;
        this.code = code;
        this.email = email;
        this.organization = organization instanceof Organization ? organization : null;
        this.userId = userId;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
    }
}