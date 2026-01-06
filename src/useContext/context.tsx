'use client';

import axios, { isAxiosError } from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { CartItem } from "@/data/carts";
import { Payment } from "@/data/payment";
import { CartApiResponse } from "@/data/carts";
import { PaymentsResponse } from "@/data/payment";

const AppContext = createContext<AppContextType | null>(null);

interface AppContextType {
    cartItem: CartItem[];
    payments: Payment[];
    open: boolean;
    amount: number;

    handleOrderItem: (name: string, price: number, image: string) => Promise<void>;
    modal: () => void;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;

    increaseQty: (id: string, quantity: number) => Promise<void>;
    decreaseQty: (id: string, quantity: number) => Promise<void>;

    loading: boolean;
    fetchPayments: () => Promise<void>;
    deletePayment: (id: string) => Promise<void>;
    handleDeleteItem: (id: string) => void;
}


interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const router = useRouter();
    const [cartItem, setCartItem] = useState<CartItem[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);


    const handleOrderItem = async (
        name: string,
        price: number,
        image: string
    ): Promise<void> => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login first");
            return;
        }

        const payload = {
            items: [
                {
                    itemName: name,
                    image,
                    itemPrice: price,
                },
            ],
        };

        try {
            const res = await axios.post(
                "https://foodorder-api-29b9.onrender.com/api/v1/create-order",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(res.data.message);
            await cart();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add item");
        }
    };



    const cart = async (): Promise<void> => {
        const id = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!id || !token) return;

        try {
            const res = await axios.get<CartApiResponse>(
                `https://foodorder-api-29b9.onrender.com/api/v1/user-order/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const order = res.data.data[0];

            if (!order) return;

            setCartItem(order?.items ?? []);
            setAmount(order.grandTotal);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };


    const modal = (): void => {
        setOpen(true);
    };


    const increaseQty = async (id: string, quantity: number): Promise<void> => {
        const token = localStorage.getItem("token");
        const newQuantity = quantity + 1;
        try {
            await axios.put(
                `https://foodorder-api-29b9.onrender.com/api/v1/cart/${id}/quantity`,
                { quantity: newQuantity },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Quantity increased");
            await cart();
        } catch (error) {
            console.error(error);
        }
    };

    const decreaseQty = async (id: string, quantity: number): Promise<void> => {
        const token = localStorage.getItem("token");
        const newQuantity = quantity - 1;
        try {
            await axios.put(
                `https://foodorder-api-29b9.onrender.com/api/v1/cart/${id}/quantity`,
                { quantity: newQuantity },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Quantity decreased");
            await cart();
        } catch (error) {
            console.error(error);
        }
    };


    const fetchPayments = async (): Promise<void> => {
        const token = localStorage.getItem("adminToken");

        try {
            setLoading(true);
            const res = await axios.get<PaymentsResponse>(
                "https://foodorder-api-29b9.onrender.com/api/v1/get-all-payment",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPayments(res.data.userPayment);
        } catch (error) {
            console.log('admin-dashboard error', error);

            let err = 'An error has occurred';
            if (isAxiosError(error)) {
                err = error.response?.data.message
            }
            toast.error(err || "Failed to fetch payments");
            router.push("/home");
        } finally {
            setLoading(false);
        }
    };


    const deletePayment = async (id: string): Promise<void> => {
        const token = localStorage.getItem("adminToken");

        try {
            await axios.delete(
                `https://foodorder-api-29b9.onrender.com/api/v1/delete-payment/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Payment deleted");
            fetchPayments();
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleDeleteItem = async (id: string) => {
        toast.success(id);
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error('Authorized! Token missing. Login or Signup');
        }
        try {
            const res = await axios.delete(`https://foodorder-api-29b9.onrender.com/api/v1/delete-item/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('res-data', res.data);
            
            if (res.data) {
                toast.success(`Item removed from cart`);
            }
        } catch (error) {
            console.log('admin-dashboard error', error);

            let err = 'An error has occurred';
            if (isAxiosError(error)) {
                err = error.response?.data.message
            }
            toast.error(err || "Error");
        }
    }


    useEffect(() => {
        cart();
    }, []);


    return (
        <AppContext.Provider
            value={{
                cartItem,
                payments,
                open,
                amount,
                loading,
                handleOrderItem,
                modal,
                setOpen,
                increaseQty,
                decreaseQty,
                deletePayment,
                fetchPayments,
                handleDeleteItem
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// ===================== HOOK =====================
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be used within AppProvider");
    }

    return context;
};
