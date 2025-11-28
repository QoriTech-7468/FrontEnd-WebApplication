import { Organization } from '../../subscriptions/presentation/views/organization.entity.js';
import { User } from './user.entity.js';

export class Invitation {
    /**
     * Creates an instance of Invitation.
     * @param id
     * @param user
     * @param organization
     * @param status
     * @param createdAt
     */
    constructor({ id = null, user = null, organization = null, status = '', createdAt = null }) {
        this.id = id;
        this.user = user instanceof User ? user : null;
        this.organization = organization instanceof Organization ? organization : null;
        this.status = status;
        this.createdAt = createdAt;
    }
}