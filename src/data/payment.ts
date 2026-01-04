export type PaymentStatus = "PAID" | "PENDING" | "FAILED";

export interface Payment {
    _id: string;
    user: string;
    name: string;
    email: string;
    amount: number;
    reference: string;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
    channel?: "card" | "bank" | string;
    __v: number;
}

export interface PaymentsResponse {
    message: string;
    userPayment: Payment[];
}
