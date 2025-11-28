import { InvitationResource } from "./invitation.resource.js";
import { Invitation } from "../domain/invitation.entity.js";
import { Organization } from "../../subscriptions/presentation/views/organization.entity.js";
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

        // Crear Organization si hay organizationName, aunque otros atributos estén vacíos
        let organization = null;
        if (resource.organizationName) {
            organization = new Organization({
                id: null,
                name: resource.organizationName,
                ruc: ''
            });
        }

        // Crear User si hay userId o role, aunque otros atributos estén vacíos
        let user = null;
        if (resource.userId || resource.role) {
            user = new User({
                id: resource.userId || null,
                name: '',
                surname: '',
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

