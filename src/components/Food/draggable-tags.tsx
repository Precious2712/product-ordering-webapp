'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Tag {
    id: number;
    label: string;
}

const tags: Tag[] = [
    { id: 1, label: 'Grilled' },
    { id: 2, label: 'Beef' },
    { id: 3, label: 'Salmon' },
    { id: 4, label: 'Pizza' },
    { id: 5, label: 'Salad' },
    { id: 6, label: 'Onion Soup' },
    { id: 7, label: 'Chicken' },
    { id: 8, label: 'Pasta' },
    { id: 9, label: 'Carbonara' },
    { id: 10, label: 'Tartare' },
    { id: 11, label: 'Chops' },
    { id: 12, label: 'Ice-cream' },
    { id: 13, label: 'Yam' },
    { id: 14, label: 'Frieds' },
    { id: 15, label: 'Jolof' },
    { id: 16, label: 'Spagheti' },
];

type TagSize = 'sm' | 'md' | 'lg';

interface TagPosition extends Tag {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: TagSize;
    width: number;
    height: number;
}

const SIZE_CLASSES: Record<TagSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
};

const COLORS = [
    'bg-blue-500/20 text-blue-100 border-blue-400/30',
    'bg-purple-500/20 text-purple-100 border-purple-400/30',
    'bg-pink-500/20 text-pink-100 border-pink-400/30',
    'bg-emerald-500/20 text-emerald-100 border-emerald-400/30',
    'bg-amber-500/20 text-amber-100 border-amber-400/30',
];

const calcSize = (label: string, size: TagSize) => {
    const len = label.length;
    if (size === 'sm') return { width: len * 8 + 32, height: 36 };
    if (size === 'md') return { width: len * 9 + 40, height: 44 };
    return { width: len * 10 + 48, height: 52 };
};

export function DraggableTags() {
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);

    const [positions, setPositions] = useState<TagPosition[]>([]);
    const [hovered, setHovered] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

   
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const generatePositions = useCallback((width: number, height: number) => {
        const results: TagPosition[] = [];
        const padding = 96;
        const centerSafeRadius = 160;
        const maxTries = 80;

        tags.forEach(tag => {
            const size: TagSize = ['sm', 'md', 'lg'][Math.floor(Math.random() * 3)] as TagSize;
            const dims = calcSize(tag.label, size);

            let x = 0;
            let y = 0;
            let valid = false;
            let tries = 0;

            while (!valid && tries < maxTries) {
                tries++;

                x = padding + Math.random() * (width - padding * 2);
                y = padding + Math.random() * (height - padding * 2);

                
                const dx = x - width / 2;
                const dy = y - height / 2;
                if (Math.sqrt(dx * dx + dy * dy) < centerSafeRadius) continue;

                valid = results.every(existing => {
                    const distX = x - existing.x;
                    const distY = y - existing.y;
                    const dist = Math.sqrt(distX * distX + distY * distY);
                    return dist > (dims.width + existing.width) / 2 + 28;
                });
            }

            results.push({
                ...tag,
                x,
                y,
                baseX: x,
                baseY: y,
                size,
                width: dims.width,
                height: dims.height,
            });
        });

        return results;
    }, []);

    
    useEffect(() => {
        if (isMobile) return;
        const el = containerRef.current;
        if (!el) return;

        const { width, height } = el.getBoundingClientRect();
        setPositions(generatePositions(width, height));
    }, [isMobile, generatePositions]);

    
    useEffect(() => {
        if (isMobile) return;
        const el = containerRef.current;
        if (!el) return;

        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            if (rafRef.current) cancelAnimationFrame(rafRef.current);

            rafRef.current = requestAnimationFrame(() => {
                setPositions(prev =>
                    prev.map(tag => {
                        const dx = mx - tag.baseX;
                        const dy = my - tag.baseY;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist > 220) return tag;

                        const strength = (1 - dist / 220) * 28;
                        return {
                            ...tag,
                            x: tag.baseX + (dx / dist) * strength,
                            y: tag.baseY + (dy / dist) * strength,
                        };
                    })
                );
            });
        };

        const reset = () =>
            setPositions(prev =>
                prev.map(t => ({ ...t, x: t.baseX, y: t.baseY }))
            );

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', reset);

        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', reset);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isMobile]);

    
    if (isMobile) {
        return (
            <div className="bg-linear-to-br from-gray-900 via-gray-800 to-black px-4 py-8">
                <h1 className="text-3xl font-bold text-center text-white mb-6">
                    Explore Food
                </h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {tags.map(tag => (
                        <button
                            key={tag.id}
                            className="rounded-full px-4 py-2 text-sm font-semibold
                bg-linear-to-r from-blue-500/20 to-purple-500/20
                border border-white/10 text-white"
                        >
                            {tag.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    
    return (
        <div
            ref={containerRef}
            className="relative w-full min-h-[70vh] md:h-[calc(100vh-80px)]
        overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-black"
        >
            {positions.map((tag, i) => {
                const isHovered = hovered === tag.id;
                return (
                    <button
                        key={tag.id}
                        onMouseEnter={() => setHovered(tag.id)}
                        onMouseLeave={() => setHovered(null)}
                        className={`absolute rounded-full border font-semibold select-none
              transition-all duration-300
              ${SIZE_CLASSES[tag.size]}
              ${COLORS[i % COLORS.length]}`}
                        style={{
                            left: tag.x,
                            top: tag.y,
                            transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1})`,
                            boxShadow: isHovered
                                ? '0 20px 40px rgba(0,0,0,0.45)'
                                : '0 6px 18px rgba(0,0,0,0.25)',
                        }}
                    >
                        {tag.label}
                    </button>
                );
            })}

            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h1 className="text-5xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Explore Food
                </h1>
            </div>
        </div>
    );
}
