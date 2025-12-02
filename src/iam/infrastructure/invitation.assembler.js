import { InvitationResource } from "./invitation.resource.js";
import { Invitation } from "../domain/invitation.entity.js";
import { Organization } from "../../subscriptions/domain/organization.entity.js";
import { User } from "../domain/user.entity.js";

export class InvitationAssembler {
    static toResourceFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return null;
        }
        return new InvitationResource({ ...response.data });
    }

    static toResourcesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const data = response.data instanceof Array ? response.data : (response.data?.invitations || []);
        return data.map(resource => new InvitationResource({ ...resource }));
    }

    static toEntityFromResource(resource) {
        if (!resource) {
            return null;
        }

        // Create Organization if there's organizationName, even if other attributes are empty
        let organization = null;
        if (resource.organizationName) {
            organization = new Organization({
                id: null,
                name: resource.organizationName,
                ruc: ''
            });
        }

        // Create User if there's userId, populate with all available user information
        let user = null;
        if (resource.userId) {
            user = new User({
                id: resource.userId || null,
                name: resource.userName || '',
                surname: resource.userSurname || '',
                email: resource.userEmail || '',
                organizationId: null,
                role: resource.role || ''
            });
        }

        return new Invitation({
            id: resource.id || null,
            user: user,
            organization: organization,
            status: resource.status || '',
            createdAt: resource.createdAt || null
        });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = this.toResourcesFromResponse(response);
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    static toEntityFromResponse(response) {
        const resource = this.toResourceFromResponse(response);
        return this.toEntityFromResource(resource);
    }
}

