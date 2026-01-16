'use client';

import { useState, useEffect, useRef } from 'react';
import axios, { isAxiosError } from 'axios';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = 'https://foodorder-api-29b9.onrender.com/api/v1/create-admin';

class Snowflake {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  speed: number;
  wind: number;
  opacity: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speed = Math.random() * 1 + 0.5;
    this.wind = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.6 + 0.3;
  }

  update() {
    this.y += this.speed;
    this.x += this.wind;

    if (this.y > this.canvas.height) {
      this.y = -10;
      this.x = Math.random() * this.canvas.width;
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    this.ctx.fill();
  }
}

interface AdminFormData {
  fullName: string;
  email: string;
  password: string;
}

export default function AdminSignupPage() {
  const [formData, setFormData] = useState<AdminFormData>({
    fullName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const navigate = useRouter();

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
      snowflakes = Array.from({ length: 120 }, () => new Snowflake(canvas));
    };

    const animate = () => {
      ctx.fillStyle = '#020617';
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    console.log(formData);


    try {
      setLoading(true);
      await axios.post(API_URL, formData);
      toast.success('Admin account created successfully');

      navigate.push('/admin-dashboard');

    } catch (error) {
      let errmsg = 'An error has occur';
      if (isAxiosError(error)) {
        errmsg = error.response?.data.message;
      }
      toast.error(
        errmsg || 'Signup failed'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />


      <Card className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-white">
            Create Admin Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <Label className="text-slate-200">Full Name</Label>
              <Input
                name="fullName"
                className='mt-2 text-white '
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label className="text-slate-200">Email</Label>
              <Input
                name="email"
                type="email"
                className='mt-2'
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <Label className="text-slate-200">Password</Label>
              <Input
                name="password"
                type="password"
                className='mt-2 text-white'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              className="w-full cursor-pointer bg-linear-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Admin'}
            </Button>
          </form>
          <div className='flex justify-center mt-4'>
            <Link className='text-white text-center' href='/login-admin'>Already have an account login</Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
