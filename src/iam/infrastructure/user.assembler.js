import { User } from "../domain/user.entity.js";
export class UserAssembler {
    static toEntityFromResource(resource) {
        if(resource.status !== 200) {
            console.error(`${resource.status}: ${resource.statusText}`);
            return null;
        }
        return new User({...resource.data});
    }
    static toEntitiesFromResponse(response) {
        if(response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['users'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}