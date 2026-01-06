'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const PaymentSuccess = () => {
    const navigate = useRouter();

    useEffect(() => {
        localStorage.removeItem("payment_reference");

        const timer = window.setTimeout(() => {
            navigate.push("/home");
        }, 3000);

        return () => window.clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center shadow-md">
                <h2 className="text-xl font-semibold">Payment received 🎉</h2>
                <p className="text-gray-500 mt-2">
                    We are confirming your payment. Redirecting…
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess