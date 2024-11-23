export class Receipt {
    id?: number; // ID giao dịch (Primary Key)
    code?: string; // Mã giao dịch duy nhất
    amount?: number; // Số tiền giao dịch
    payment_method?: 'Cash' | 'Credit_card' | 'Bank_transfer'; // Phương thức thanh toán
    note?: string; // Ghi chú thêm
    customer_name?: string;
    created_by?: string;
    hotel_id?: number;
    category?: 'Room_Payment' | 'Service' | 'Other';
    invoice_id?: number;

    constructor(
        id?: number,
        code?: string,
        amount?: number,
        payment_method?: 'Cash' | 'Credit_card' | 'Bank_transfer',
        note?: string,
        customer_name?: string,
        created_by?: string,
        hotel_id?: number,
        category?: 'Room_Payment' | 'Service' | 'Other',
        invoice_id?: number,
    ) {
        if (id !== null) this.id = id;
        if (code !== null) this.code = code;
        if (amount !== null) this.amount = amount;
        if (payment_method !== null) this.payment_method = payment_method;
        if (note !== null) this.note = note;
        if (customer_name !== null) this.customer_name = customer_name;
        if (created_by !== null) this.created_by = created_by;
        if (hotel_id !== null) this.hotel_id = hotel_id;
        if (category !== null) this.category = category;
        if (invoice_id !== null) this.invoice_id = invoice_id;
    }
}
