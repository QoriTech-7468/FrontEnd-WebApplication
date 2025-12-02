import { TeamMember } from '../domain/team-member.entity.js';

export class TeamMemberAssembler {
    /**
     * Transform a resource into a TeamMember entity
     * @param {Object} resource - API resource object
     * @returns {TeamMember} - TeamMember entity instance
     */
    static toEntityFromResource(resource) {
        return new TeamMember({
            id: resource.id,
            email: resource.email || '',
            name: resource.name || '',
            surname: resource.surname || ''
        });
    }

    /**
     * Transform a response into an array of TeamMember entities
     * @param {Object} response - API response object
     * @returns {Array<TeamMember>} - Array of TeamMember entities
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array ? response.data : [];
        return resources.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Transform a TeamMember entity or plain object into a resource for API requests
     * @param {TeamMember|Object} teamMember - TeamMember entity instance or plain object
     * @returns {Object} - API resource object
     */
    static toResourceFromEntity(teamMember) {
        const resource = {
            email: teamMember.email || '',
            name: teamMember.name || '',
            surname: teamMember.surname || ''
        };

        // Include id only if it's not null (for updates)
        if (teamMember.id !== null && teamMember.id !== undefined) {
            resource.id = teamMember.id;
        }

        return resource;
    }
}

export default TeamMemberAssembler;

