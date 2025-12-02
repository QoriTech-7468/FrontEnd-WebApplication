export class TeamMember {
    /**
     * Creates an instance of TeamMember.
     * @param {Object} params - TeamMember parameters
     * @param {number|null} params.id - TeamMember ID
     * @param {string} params.email - Email address
     * @param {string} params.name - First name
     * @param {string} params.surname - Last name
     */
    constructor({ 
        id = null,
        email = '', 
        name = '', 
        surname = ''
    }) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
    }

    /**
     * Get full name (name + surname)
     * @returns {string} - Full name or empty string
     */
    getFullName() {
        const parts = [this.name, this.surname].filter(part => part && part.trim());
        return parts.length > 0 ? parts.join(' ') : '';
    }

    /**
     * Check if team member has valid email
     * @returns {boolean} - True if email is not empty
     */
    hasEmail() {
        return this.email && this.email.trim().length > 0;
    }
}

