export class Invoice {
    id?: number;
    issue_at?: Date;
    total_amount?: number;
    payment_method?: 'Cash' | 'Credit_card' | 'Bank_transfer';
    status?: 'Paid' | 'Unpaid';
    booking_id?: number;
    hotel_id?: number;

    constructor(
        id: number,
        issue_at: Date,
        total_amount: number,
        payment_method: 'Cash' | 'Credit_card' | 'Bank_transfer',
        status: 'Paid' | 'Unpaid',
        booking_id: number,
        hotel_id: number,
    ) {
        if (id !== null) this.id = id;
        if (issue_at !== null) this.issue_at = issue_at;
        if (total_amount !== null) this.total_amount = total_amount;
        if (payment_method !== null) this.payment_method = payment_method;
        if (status !== null) this.status = status;
        if (booking_id !== null) this.booking_id = booking_id;
        if (hotel_id !== null) this.hotel_id = hotel_id;
    }
}
