export class Employee {
    id?: number;
    code?: string;
    name?: string;
    birthDate?: Date;
    gender?: 'Male' | 'Female' | 'Other';
    idCard?: string;
    position?: string;
    startDate?: Date;
    user_id?: number;
    phoneNumber?: string;
    email?: string;
    facebook?: string;
    address?: string;
    notes?: string;
    img?: string;
    status?: 'Working' | 'Resigned';
    hotel_id?: number;

    constructor(
        id?: number,
        code?: string,
        name?: string,
        birthDate?: Date,
        gender?: 'Male' | 'Female' | 'Other',
        idCard?: string,
        position?: string,
        startDate?: Date,
        user_id?: number,
        phoneNumber?: string,
        email?: string,
        facebook?: string,
        address?: string,
        notes?: string,
        img?: string,
        status?: 'Working' | 'Resigned',
        hotel_id?: number
    ) {
        if (id !== null) this.id = id;
        if (code !== null) this.code = code;
        if (name !== null) this.name = name;
        if (birthDate !== null) this.birthDate = birthDate;
        if (gender !== null) this.gender = gender;
        if (idCard !== null) this.idCard = idCard;
        if (position !== null) this.position = position;
        if (startDate !== null) this.startDate = startDate;
        if (user_id !== null) this.user_id = user_id;
        if (phoneNumber !== null) this.phoneNumber = phoneNumber;
        if (email !== null) this.email = email;
        if (facebook !== null) this.facebook = facebook;
        if (address !== null) this.address = address;
        if (notes !== null) this.notes = notes;
        if (img !== null) this.img = img;
        if (status !== null) this.status = status;
        if (hotel_id !== null) this.hotel_id = hotel_id;
    }
}
