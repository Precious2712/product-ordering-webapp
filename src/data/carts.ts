// .............Cart-item...............
export interface CartItem {
    _id: string;
    itemName: string;
    image: string;
    itemPrice: number;
    quantity: number;
    total: number;
}

export interface UserOrder {
    _id: string;
    userId: string;
    userName: string;
    items: CartItem[];
    grandTotal: number;
    receiptSent: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CartApiResponse {
    success: boolean;
    count: number;
    data: UserOrder[];
}