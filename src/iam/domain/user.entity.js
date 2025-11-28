export class User {
    constructor({ id, name, surname, organizationId, role }) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.organizationId = organizationId;
        this.role = role;
    }
}