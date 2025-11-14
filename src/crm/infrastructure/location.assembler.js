import {Location} from "../domain/model/locations.entity.js";

export class LocationAssembler {


    static toEntityFromResource(resource) {
        return new Location({...resource});
    }


    static toEntitiesfromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['vehicles'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}