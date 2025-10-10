
import {Client} from './client.entity.js';
export class Location{

    /**
     * Creates an instance of Location.
     * @param id
     * @param latitude
     * @param longitude
     * @param address
     * @param type
     * @param isActive
     * @param clientsId
     * @param clients
     */
    constructor({id=null,latitude= '',longitude='', address='',type='', isActive='',clientsId=null,clients=null }) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.type = type;
        this.isActive = isActive;
        this.clientsId = clientsId;
        this.clients = clients instanceof Client ? clients: null;
    }
}
