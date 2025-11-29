export class InvitationResource {
    constructor({ id, organizationName, userId, role, status, createdAt }) {
        this.id = id;
        this.organizationName = organizationName;
        this.userId = userId;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
    }
}

