export class SignUpResource {
    constructor({ email, password, name, surname, phone }) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.phone = phone;
    }
}