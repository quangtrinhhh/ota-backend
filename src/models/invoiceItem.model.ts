export class InvoiceItem {
    id?: number;
    service_id?: number;
    item_name?: string;
    quantity?: number;
    unit_price?: number;
    total_price?: number;
    category?: 'Booking' | 'Service' | 'Other';
    invoice_id?: number;

    constructor(
        id?: number,
        service_id?: number,
        item_name?: string,
        quantity?: number,
        unit_price?: number,
        total_price?: number,
        category?: 'Booking' | 'Service' | 'Other',
        invoice_id?: number
    ) {
        if (id !== null) this.id = id;
        if (service_id !== null) this.service_id = service_id;
        if (item_name !== null) this.item_name = item_name;
        if (quantity !== null) this.quantity = quantity;
        if (unit_price !== null) this.unit_price = unit_price;
        if (total_price !== null) {
            this.total_price = total_price;
        } else if (quantity !== null && unit_price !== null) {
            this.total_price = quantity * unit_price; // Tính toán nếu không được cung cấp
        }
        if (category !== null) this.category = category;
        if (invoice_id !== null) this.invoice_id = invoice_id;
    }
}
