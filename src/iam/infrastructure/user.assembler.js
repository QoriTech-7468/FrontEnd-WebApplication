import { User } from "../domain/user.entity.js";

export class UserAssembler {
    static toEntityFromResource(resource) {
        if (resource.status !== 200) {
            console.error(`${resource.status}: ${resource.statusText}`);
            return null;
        }
        // For organization users, don't map organizationId (it's already known)
        const userData = { ...resource.data };
        // Remove organizationId from the data as it's not needed in the entity
        delete userData.organizationId;
        return new User(userData);
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : (response.data?.users || []);
        return resources.map(resource => {
            // Create a User entity without organizationId (it's already known from context)
            const userData = {
                id: resource.id || null,
                name: resource.name || '',
                surname: resource.surname || '',
                email: resource.email || '',
                role: resource.role || '',
                // Don't include organizationId as it's already known
            };
            return new User(userData);
        });
    }
}