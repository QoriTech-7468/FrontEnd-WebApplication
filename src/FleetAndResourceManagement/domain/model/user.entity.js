export class User {
    /**
     * Creates an instance of User.
     * @param id
     * @param fullname
     * @param email
     * @param role
     * @param password
     * @param vehicleId
     */
    constructor({ id = null, fullname = '', email = '', role = '', password = '', vehicleId = null }) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.role = role;
        this.password = password;
        this.vehicleId = vehicleId;
    }
}