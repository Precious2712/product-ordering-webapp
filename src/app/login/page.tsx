'use client';

import axios, { isAxiosError } from 'axios';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

class Snowflake {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    size: number;
    speed: number;
    wind: number;
    opacity: number;
    wobble: number;
    wobbleSpeed: number;
    wobbleOffset: number;
    color: string;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.wind = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.wobble = Math.random() * 0.05;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.color =
            Math.random() > 0.7
                ? `rgba(173, 216, 230, ${this.opacity})`
                : `rgba(255, 255, 255, ${this.opacity})`;
    }

    update() {
        this.y += this.speed;
        this.x +=
            this.wind +
            Math.sin(Date.now() * this.wobbleSpeed + this.wobbleOffset) *
            this.wobble;

        if (this.y > this.canvas.height) {
            this.y = -10;
            this.x = Math.random() * this.canvas.width;
        }

        if (this.x > this.canvas.width + 10) this.x = -10;
        if (this.x < -10) this.x = this.canvas.width + 10;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }
}

export default function LoginPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let snowflakes: Snowflake[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            snowflakes = Array.from({ length: 150 }, () => new Snowflake(canvas));
        };

        const animate = () => {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            snowflakes.forEach((flake) => {
                flake.update();
                flake.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    const handleSubmitForm = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await axios.post(
                'https://foodorder-api-29b9.onrender.com/api/v1/sign-in-user',
                { email, password }
            );

            if (res.data?.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userId', res.data.id);
                localStorage.setItem('name', res.data.name);

                toast.success(res.data.message || 'Login successful');
                router.push('/home');
            } else {
                toast.error('Invalid credentials');
            }
        } catch (error) {
            let err = 'An error has occur'
            if (isAxiosError(error)) {
                err = error.response?.data.message;
            }
            toast.error(
                err || 'Login failed'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 relative">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            <form
                onSubmit={handleSubmitForm}
                className="relative z-10 w-[90%] max-w-md bg-slate-800 p-8 rounded-xl space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-white">
                    Welcome Back
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded bg-slate-700 text-white"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded bg-slate-700 text-white"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 py-3 rounded text-white cursor-pointer font-sans"
                >
                    {loading ? 'Loading...' : 'Sign In'}
                </button>

                <p className="text-center text-slate-400 text-sm">
                    Don’t have an account?{' '}
                    <Link href="/" className="text-cyan-400">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}
