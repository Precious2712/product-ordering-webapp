'use client';

import { useEffect, useRef, useState } from "react";
import { galleryImages } from "@/data/gallary";

export function ScrollLockGallery() {
    const containerRef = useRef<HTMLElement | null>(null);
    const accumulatedScroll = useRef<number>(0);

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [scrollProgress, setScrollProgress] = useState<number>(0);

    const SCROLL_THRESHOLD = 150;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent): void => {
            const rect = container.getBoundingClientRect();
            const isInView = rect.top <= 0 && rect.bottom >= window.innerHeight;

            if (isInView) {
                accumulatedScroll.current += e.deltaY;

                const targetIndex = Math.floor(
                    Math.abs(accumulatedScroll.current) / SCROLL_THRESHOLD
                );

                const clampedIndex = Math.max(
                    0,
                    Math.min(targetIndex, galleryImages.length - 1)
                );

                if (clampedIndex < galleryImages.length - 1) {
                    e.preventDefault();
                    setCurrentIndex(clampedIndex);

                    const progress =
                        (Math.abs(accumulatedScroll.current) % SCROLL_THRESHOLD) /
                        SCROLL_THRESHOLD;

                    setScrollProgress(progress);
                } else {
                    setCurrentIndex(galleryImages.length - 1);
                    setScrollProgress(1);
                }
            } else if (rect.top > 0) {
                accumulatedScroll.current = 0;
                setCurrentIndex(0);
                setScrollProgress(0);
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-[50vh] w-full sm:h-[70vh] lg:h-screen"
        >
            <div className="sticky top-0 h-screen w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                {currentIndex < galleryImages.length - 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
                        <span className="text-white text-sm font-medium">
                            Scroll to explore
                        </span>
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                )}

                <div className="relative w-full h-full">
                    {galleryImages.map((item, index) => (
                        <div
                            key={item.id}
                            className="absolute inset-0 transition-all duration-500 ease-out"
                            style={{
                                opacity:
                                    index === currentIndex
                                        ? 1
                                        : index === currentIndex - 1
                                            ? 0.3
                                            : 0,
                                transform: `translateY(${index < currentIndex
                                        ? "-20%"
                                        : index === currentIndex
                                            ? "0%"
                                            : "20%"
                                    }) scale(${index === currentIndex ? 1 : 0.9})`,
                                zIndex: index === currentIndex ? 10 : 1,
                            }}
                        >
                            <img
                                src={item.url}
                                alt={item.alt}
                                className="w-full h-full object-cover"
                                loading={index === 0 ? "eager" : "lazy"}
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                            {/* <div className="absolute bottom-20 left-8 md:left-16 text-white max-w-2xl z-10">
                                <h3 className="text-4xl md:text-6xl font-serif font-bold mb-4">
                                    {item.}
                                </h3>
                                <p className="text-xl md:text-2xl text-zinc-200">
                                    {item.description}
                                </p>
                            </div> */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
