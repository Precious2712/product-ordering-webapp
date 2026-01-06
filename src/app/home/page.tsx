'use client';

import { Modal } from "@/components/Food/Modal";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Food/Header";
import { useAppContext } from "@/useContext/context";
import { ScrollLockGallery } from "@/components/Food/screen-lock-gallary";
import { FoodCard } from "@/components/Food/food-card";
import { food } from "@/data/food-items";

export default function Home() {
    const { open, setOpen, cartItem, amount } = useAppContext();
    const [sendEmail, setSendEmail] = useState(true);

    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-in-up");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        const cards =
            menuRef.current?.querySelectorAll<HTMLDivElement>(
                ".food-card-wrapper"
            );

        cards?.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black">
            <div style={{ maxHeight: "100vh", overflow: "hidden" }}>
                <Header />
                <ScrollLockGallery />
            </div>

            <section className="py-16 px-4 relative overflow-hidden">
                <div className="relative z-10">
                    {food.length > 0 ? (
                        <div
                            ref={menuRef}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                        >
                            {food.map((item) => (
                                <div
                                    key={item.id}
                                    className="food-card-wrapper transition-all duration-500 hover:scale-[1.02]"
                                >
                                    <FoodCard {...item} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-300">
                            Menu items loading...
                        </p>
                    )}
                </div>
            </section>

            {open && (
                <Modal
                    closeButton={() => setOpen(false)}
                    items={cartItem}
                    grandTotal={amount}
                />
            )}

            {/* {sendEmail && (
                <EmailModal onClose={() => setSendEmail(false)} />
            )} */}

        </div>
    );
}
