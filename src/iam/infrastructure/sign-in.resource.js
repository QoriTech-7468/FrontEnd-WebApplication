export class SignInResource {
    constructor({ id, name, surname, organizationId, role, token }) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.organizationId = organizationId;
        this.role = role;
        this.token = token;
    }
}

