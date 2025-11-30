export class InvitationResource {
    constructor({ id, organizationName, userId, userName, userSurname, userEmail, role, status, createdAt }) {
        this.id = id;
        this.organizationName = organizationName;
        this.userId = userId;
        this.userName = userName;
        this.userSurname = userSurname;
        this.userEmail = userEmail;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
    }
}

