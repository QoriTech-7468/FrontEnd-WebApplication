import {Client} from "../domain/model/client.entity.js";

export class ClientAssembler {


    static toEntityFromResource(resource) {
        return new Client({...resource});
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