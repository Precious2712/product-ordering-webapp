'use client';

import axios, { AxiosError } from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface SignupValues {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
}


export default function AuthPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useRouter();

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
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      this.canvas = canvas;
      this.ctx = ctx;
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

      if (this.x > this.canvas.width + 10) {
        this.x = -10;
      } else if (this.x < -10) {
        this.x = this.canvas.width + 10;
      }
    }

    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      this.ctx.closePath();

      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
      this.ctx.fill();
      this.ctx.closePath();

      if (Math.random() > 0.8) {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(173, 216, 230, ${this.opacity * 0.1})`;
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }

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

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );

      gradient.addColorStop(0, 'rgba(30, 41, 59, 0.3)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      snowflakes.forEach((snowflake) => {
        snowflake.update();
        snowflake.draw();
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

    const values: SignupValues = {
      name,
      email,
      password,
      age,
      gender,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        'https://foodorder-api-29b9.onrender.com/api/v1/create-user',
        values
      );

      if (res.data?.status) {
        toast.success(res.data.message);
        navigate.push('/login');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-900">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      <div className='overflow-y-auto h-96'>
        <form
          onSubmit={handleSubmitForm}
          className="w-full max-w-md bg-linear-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-md rounded-xl shadow-2xl p-8 space-y-6 border border-slate-700/50 relative z-10 transform transition-all duration-300 hover:shadow-blue-900/20 hover:shadow-xl md:w-225"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              Create Your Account
            </h2>
            <p className="text-slate-400 text-sm mt-2">Join our community today</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white placeholder-slate-500 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="john@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white placeholder-slate-500 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white placeholder-slate-500 transition-all duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Age
              </label>
              <input
                type="number"
                placeholder="20"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white placeholder-slate-500 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white transition-all duration-200"
                required
              >
                <option value="" className="text-slate-500">Select gender</option>
                <option value="Male" className="text-white">Male</option>
                <option value="Female" className="text-white">Female</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-emerald-600 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-cyan-600 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-emerald-500/30"
          >
            {loading ? 'Loading' : 'Create Account'}
          </button>

          <div className="text-center pt-4 border-t border-slate-800">
            <Link
              href='/login'
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors duration-200"
            >
              <span className="text-cyan-400">←</span>
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}