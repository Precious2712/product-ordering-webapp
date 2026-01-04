'use client';

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAppContext } from "@/useContext/context";

interface PaystackInitResponse {
    reference: string;
    authorization_url: string;
}

export default function Checkout() {
    const [loading, setLoading] = useState<boolean>(false);
    const hasInitialized = useRef<boolean>(false);

    const { amount } = useAppContext();

    useEffect(() => {
        if (!amount || hasInitialized.current) return;

        hasInitialized.current = true;

        const initPayment = async (): Promise<void> => {
            try {
                setLoading(true);

                const token = localStorage.getItem("token");

                const res = await axios.post<PaystackInitResponse>(
                    "https://foodorder-api-29b9.onrender.com/api/v1/paystack/payments/init",
                    { amount },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                localStorage.setItem("payment_reference", res.data.reference);
                window.location.href = res.data.authorization_url;
            } catch (err) {
                console.error("PAYMENT ERROR", err);
                setLoading(false);
            }
        };

        initPayment();
    }, [amount]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            {loading && (
                <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
                    <h2 className="font-semibold text-lg">
                        Preparing your payment
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        You will be redirected to Paystack shortly
                    </p>
                </div>
            )}
        </div>
    );
}