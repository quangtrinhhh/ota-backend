export class Service {
    id?: number;
    name?: string;
    description?: string;
    unit_price?: number;
    category_id?: number;
    status?: 'in_business' | 'out_of_business'

    constructor(id?: number, name?: string, description?: string, unit_price?: number, category_id?: number, status?: 'in_business' | 'out_of_business',) {
        if (id !== null) this.id = id;
        if (name !== null) this.name = name;
        if (description !== null) this.description = description;
        if (unit_price !== null) this.unit_price = unit_price;
        if (category_id !== null) this.category_id = category_id;
        if (status !== null) this.status = status;
    }
}

