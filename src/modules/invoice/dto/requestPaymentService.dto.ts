export interface RequestPaymentService {
    paymentOption: string,
    currencyType: string,
    totalPrice: number;
    paymentMethod: string;
    customerName: string;
    note: string;
    hotel_id: number;
    selectedService: {
        id: number,
        name: string,
        unit_price: number,
        quantity: number,
    }[];
    discountForm: {
        discount: number;
        note: string;
    };
    user_id: number;
}
