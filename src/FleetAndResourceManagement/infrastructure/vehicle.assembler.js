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
