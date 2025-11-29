import { OrganizationResource } from "./organization.resource.js";
import { Organization } from "../domain/organization.entity.js";
import { User } from "../../iam/domain/user.entity.js";

export class OrganizationAssembler {
    static toResourceFromResponse(response) {
        if (response.status !== 200 && response.status !== 201) {
            console.error(`${response.status}: ${response.statusText}`);
            return null;
        }
        return new OrganizationResource({ ...response.data });
    }

    static toEntityFromResource(resource) {
        if (!resource) {
            return null;
        }

        // Crear User si hay userId, aunque otros atributos estén vacíos
        let user = null;
        if (resource.userId) {
            user = new User({
                id: resource.userId,
                name: '',
                surname: '',
                organizationId: resource.id || null,
                organization: null,
                role: ''
            });
        }

        return new Organization({
            id: resource.id || null,
            name: resource.name || '',
            ruc: resource.ruc || '',
            user: user
        });
    }

    static toEntityFromResponse(response) {
        const resource = this.toResourceFromResponse(response);
        return this.toEntityFromResource(resource);
    }

    static entityToRequest(organization) {
        if (!organization) {
            return null;
        }

        // Si tiene user, extraer userId del objeto user
        const userId = organization.user?.id || null;

        return {
            name: organization.name || '',
            ruc: organization.ruc || '',
            userId: userId
        };
    }

    static toRequest(organizationData) {
        // Método helper para convertir datos simples a request
        // Acepta tanto entidad Organization como objeto simple {name, ruc, userId} o {name, ruc, user: {id}}
        if (!organizationData) {
            return null;
        }

        // Si es una instancia de Organization, usar entityToRequest
        if (organizationData instanceof Organization) {
            return this.entityToRequest(organizationData);
        }

        // Si es un objeto simple, extraer userId de user?.id o userId directamente
        const userId = organizationData.user?.id || organizationData.userId || null;

        return {
            name: organizationData.name || '',
            ruc: organizationData.ruc || '',
            userId: userId
        };
    }
}

