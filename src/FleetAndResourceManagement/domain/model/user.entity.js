
import {Vehicle} from "./vehicle.entity.js";
export class User{

    /**
     * Creates an instance of Category.
     * @param id - The unique identifier of the category.
     * @param fullname
     * @param email - The name of the category.
     * @param role
     * @param password
     * @param vehicleId
     * @param vehicle
     */
    constructor({id=null,fullname= '',email='', role='',password='', vehicleId=null,vehicle='' }) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.role = role;
        this.password = password;
        this.vehicleId = vehicleId;
        this.vehicle = vehicle instanceof Vehicle ? vehicle: null;
    }
}
