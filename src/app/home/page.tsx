'use client';

import { Modal } from "@/components/Food/Modal";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Food/Header";
import { useAppContext } from "@/useContext/context";
import { FoodCard } from "@/components/Food/food-card";
import { food } from "@/data/food-items";
import { DraggableTags } from "@/components/Food/draggable-tags";

export default function Home() {
    const { open, setOpen, cartItem, amount } = useAppContext();
    const [showDraggableTags] = useState(true);

    const menuRef = useRef<HTMLDivElement | null>(null);

    /* ---- Animate menu cards on scroll ---- */
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
            <Header />

            {/* HERO / TAG CLOUD */}
            {showDraggableTags && (
                <section
                    className="
            relative w-full top-14
            min-h-[70vh] md:min-h-screen
            overflow-hidden
          "
                >
                    <DraggableTags />

                    {/* Soft fade so menu feels connected (Wellfound style) */}
                    <div
                        className="
              absolute bottom-0 left-0 w-full h-24
              bg-linear-to-t from-gray-900 to-transparent
              pointer-events-none z-10
            "
                    />
                </section>
            )}

            {/* MENU SECTION (PULLS UP CLOSER ON MOBILE) */}
            <section
                className="
          relative
          -mt-72 md:-mt-20 lg:mt-10
          py-16 px-4
          bg-gray-900
        "
            >
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-center text-white mb-12">
                        Our Menu
                    </h2>

                    {food.length > 0 ? (
                        <div
                            ref={menuRef}
                            className="
                grid grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-8
                max-w-7xl mx-auto
              "
                        >
                            {food.map((item) => (
                                <div
                                    key={item.id}
                                    className="
                    food-card-wrapper
                    transition-all duration-500
                    hover:scale-[1.02]
                  "
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

            {/* CART MODAL */}
            {open && (
                <Modal
                    closeButton={() => setOpen(false)}
                    items={cartItem}
                    grandTotal={amount}
                />
            )}
        </div>
    );
}
