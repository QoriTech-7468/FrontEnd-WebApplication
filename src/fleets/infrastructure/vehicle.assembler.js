import { Vehicle } from "../domain/model/vehicle.entity.js";

export class VehicleAssembler {
    static toEntityFromResource(resource) {
        return new Vehicle({ ...resource });
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['vehicles'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Transforma una entidad Vehicle a un recurso para el API
     * @param {Vehicle|Object} vehicle - La entidad Vehicle o un objeto con los datos del vehículo
     * @param {boolean} isUpdate - Si es true, es una actualización (PUT), si es false, es creación (POST)
     * @returns {Object} - Recurso formateado para el API
     */
    static toResourceFromEntity(vehicle, isUpdate = false) {
        const resource = {
            plate: vehicle.plate || '',
            capacityKg: vehicle.capacityKg || vehicle.capacity || 0
        };

        // Para actualizaciones, incluir id y state
        if (isUpdate && vehicle.id !== null && vehicle.id !== undefined) {
            resource.id = vehicle.id;
        }

        // Manejar state (Enabled o Disabled)
        const state = vehicle.state || vehicle.isActive;
        if (state === 'Enabled' || state === 'Disabled') {
            resource.state = state;
        } else {
            // Default a Enabled si no se especifica
            resource.state = 'Enabled';
        }

        // Para creaciones, incluir organizationId
        if (!isUpdate) {
            let organizationId = null;
            try {
                const userDataStr = localStorage.getItem('userData');
                if (userDataStr) {
                    const userData = JSON.parse(userDataStr);
                    organizationId = userData.organizationId;
                }
            } catch (error) {
                console.error('Error getting organizationId from localStorage:', error);
            }

            if (organizationId !== null && organizationId !== undefined) {
                resource.organizationId = organizationId;
            }
        }

        return resource;
    }

    /**
     * Extensión: Combina vehículos con sus miembros de equipo (usuarios)
     * @param {Object[]} vehicles - Lista de vehículos
     * @param {Object[]} users - Lista de usuarios
     * @returns {Object[]} - Vehículos con su equipo asociado
     */
    static mapVehiclesWithTeamMembers(vehicles, users) {
        return vehicles.map(vehicle => ({
            ...vehicle,
            team: users.filter(user => user.vehicleId === vehicle.id)
        }));
    }
}
