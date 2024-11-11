export class User {
    id?: number;
    user_name?: string;
    password?: string;
    email?: string;
    phone?: string;
    role_id?: number;

    constructor(id: number, user_name: string, password: string, email: string, phone: string, role_id: number) {
        if (id !== null) this.id = id;
        if (user_name !== null) this.user_name = user_name;
        if (password !== null) this.password = password;
        if (email !== null) this.email = email;
        if (phone !== null) this.phone = phone;
        if (role_id !== null) this.role_id = role_id;
    }
}
