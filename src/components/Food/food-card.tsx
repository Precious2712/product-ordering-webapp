'use client';

import { useAppContext } from "@/useContext/context";
import { ShoppingCart } from "lucide-react";

interface FoodCardProps {
  name: string;
  price: number;
  image: string;
}

export function FoodCard({ name, price, image }: FoodCardProps) {

  const { handleOrderItem } = useAppContext();

  return (
    <div className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-serif font-semibold mb-2 text-gray-800 dark:text-gray-100">
          {name}
        </h3>

        <p className="text-2xl font-bold text-amber-600 dark:text-amber-500 mb-4">
          ${price.toFixed(2)}
        </p>

        <button
          onClick={() => handleOrderItem(name, price, image)}
          className="w-full py-3 px-4 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 transition-colors rounded-md font-medium"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Buy
        </button>
      </div>
    </div>
  );
}
