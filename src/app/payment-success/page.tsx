'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

const REDIRECT_TIME = 5000;

const PaymentSuccess = () => {
    const router = useRouter();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        localStorage.removeItem("payment_reference");

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                return prev + 100 / (REDIRECT_TIME / 100);
            });
        }, 100);

        const timer = setTimeout(() => {
            router.push("/home");
        }, REDIRECT_TIME);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4
      bg-gray-50 dark:bg-gray-900 transition-colors">

            <div className="bg-white dark:bg-gray-800 max-w-md w-full rounded-2xl
        shadow-xl p-8 text-center">

                <div className="flex justify-center mb-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/40
            text-indigo-600 dark:text-indigo-400 rounded-full p-4">
                        <CheckCircle size={42} />
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    Payment Successful 🎉
                </h2>

                <p className="text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                    Thank you for your purchase. Your payment has been received and is
                    being confirmed.
                </p>

                <div className="mt-6">
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="text-sm text-gray-400 mt-2">
                        Redirecting to home…
                    </p>
                </div>

                <button
                    onClick={() => router.push("/home")}
                    className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl
            hover:bg-indigo-700 transition"
                >
                    Go to Home Now
                </button>

            </div>
        </div>
    );
};

export default PaymentSuccess;
