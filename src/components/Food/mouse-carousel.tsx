'use client';

import { useEffect, useRef, useState, useCallback } from "react";

interface CarouselItem {
    id: number;
    label: string;
    color: string;
}

const items: CarouselItem[] = [
    { id: 1, label: "Full Stack Developers", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
    { id: 2, label: "Front End Developers", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { id: 3, label: "iOS Developers", color: "bg-gradient-to-br from-pink-500 to-rose-500" },
    { id: 4, label: "Android Developers", color: "bg-gradient-to-br from-green-500 to-emerald-500" },
    { id: 5, label: "React Developers", color: "bg-gradient-to-br from-cyan-500 to-blue-500" },
    { id: 6, label: "Node JS Developers", color: "bg-gradient-to-br from-yellow-500 to-amber-500" },
    { id: 7, label: "Vue JS Developers", color: "bg-gradient-to-br from-red-500 to-orange-500" },
    { id: 8, label: "Flutter Developers", color: "bg-gradient-to-br from-indigo-500 to-purple-500" },
    { id: 9, label: "Blockchain Developers", color: "bg-gradient-to-br from-orange-500 to-yellow-500" },
    { id: 10, label: "AI/ML Engineers", color: "bg-gradient-to-br from-teal-500 to-emerald-500" },
];

export function MouseCarousel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>(0);
    const [isHovered, setIsHovered] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const container = containerRef.current;
        const scroller = scrollRef.current;
        if (!container || !scroller) return;

        const rect = container.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));

        // Calculate progress for indicator
        const percentage = x / rect.width;
        setScrollProgress(percentage);

        if (!isHovered) return;

        // Calculate target scroll position
        const maxScroll = scroller.scrollWidth - rect.width;
        const targetScroll = percentage * maxScroll;

        // Smooth scrolling animation
        const animateScroll = () => {
            const currentScroll = scroller.scrollLeft;
            const diff = targetScroll - currentScroll;

            if (Math.abs(diff) > 0.5) {
                scroller.scrollLeft = currentScroll + diff * 0.1;
                animationFrameRef.current = requestAnimationFrame(animateScroll);
            }
        };

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(animateScroll);
    }, [isHovered]);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [handleMouseMove]);

    const handleItemClick = useCallback((item: CarouselItem) => {
        console.log(`Clicked: ${item.label}`);
        // Add your click handler logic here
    }, []);

    return (
        <section className="w-full bg-linear-to-b from-white to-slate-50 py-12 overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
                    Find Developers by Expertise
                </h2>
                <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
                    Move your mouse horizontally to scroll through different developer categories
                </p>
            </div>

            <div
                ref={containerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full group"
            >
                {/* Progress indicator */}
                <div className="absolute -top-6 left-0 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${scrollProgress * 100}%` }}
                        aria-label="Scroll progress"
                    />
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 px-8 overflow-x-hidden scroll-smooth py-4"
                    style={{ scrollBehavior: "smooth" }}
                    role="list"
                    aria-label="Developer categories carousel"
                >
                    {items.map((item) => (
                        <button
                            key={item.id}
                            className={`shrink-0 w-64 h-40 rounded-2xl ${item.color} flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.03] shadow-xl hover:shadow-2xl backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            onClick={() => handleItemClick(item)}
                            role="listitem"
                            aria-label={`View ${item.label}`}
                            type="button"
                        >
                            <div className="text-white text-center font-bold text-xl px-6 backdrop-blur-sm">
                                <div className="text-balance mb-2">{item.label}</div>
                                <div className="text-sm font-normal opacity-90">
                                    Click to explore →
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Gradient overlays */}
                <div
                    className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-white via-white/90 to-transparent pointer-events-none"
                    aria-hidden="true"
                />
                <div
                    className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-white via-white/90 to-transparent pointer-events-none"
                    aria-hidden="true"
                />

                {/* Hover instruction */}
                <div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    aria-hidden="true"
                >
                    ← Move mouse to scroll →
                </div>
            </div>

            {/* Footer note */}
            <div className="text-center mt-8 text-slate-500 text-sm">
                <p>Click on any card to explore developers in that category</p>
            </div>
        </section>
    );
}