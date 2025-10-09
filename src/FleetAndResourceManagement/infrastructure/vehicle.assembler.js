import {Vehicle} from "../domain/model/vehicle.entity.js";

export class VehicleAssembler {


    static toEntityFromResource(resource) {
        return new Vehicle({...resource});
    }
    /**
     * Converts an API response containing multiple resources into an array of Category entities.
     * @param response - API response object.
     * @returns {Vehicle[]} - Array of Category domain entities.
     *
     * @example
     * const response = {
     *   status: 200,
     *   data: {
     *     categories: [
     *       { id: 1, name: 'Tech', description: 'Technology related articles' },
     *       { id: 2, name: 'Health', description: 'Health and wellness articles' }
     *     ]
     *   }
     * };
     * const categories = CategoryAssembler.toEntitiesFromResponse(response);
     */

    static toEntityfromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['vehicles'];
        return resources.map(resource => this.toEntityFromResource(resource));

    }
}

