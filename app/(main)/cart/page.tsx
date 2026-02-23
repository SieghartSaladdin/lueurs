"use client";

import { useCartStore } from "@/app/lib/store/cart";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/app/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h1 className="text-4xl font-display font-medium mb-12">Your Bag</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">Your bag is currently empty.</p>
            <Link
              href="/products"
              className="inline-block bg-black text-white font-bold uppercase tracking-widest py-4 px-8 hover:bg-gray-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="border-b border-gray-200 pb-4 mb-6 hidden md:grid grid-cols-12 gap-4 text-sm font-bold uppercase tracking-widest text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-100 pb-8">
                    {/* Product Info */}
                    <div className="col-span-1 md:col-span-6 flex gap-6">
                      <div className="w-24 h-32 bg-stone-50 relative shrink-0">
                        <Image
                          src={item.image || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-display text-lg mb-1">{item.name}</h3>
                        <p className="text-gray-500 text-sm mb-2">{item.volume}ml</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-gray-400 hover:text-black transition-colors text-left underline underline-offset-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price (Desktop) */}
                    <div className="hidden md:block col-span-2 text-center">
                      {formatCurrency(item.price)}
                    </div>

                    {/* Quantity */}
                    <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                      <span className="md:hidden text-sm text-gray-500">Quantity:</span>
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1 text-gray-500 hover:text-black transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-500 hover:text-black transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center font-medium">
                      <span className="md:hidden text-sm text-gray-500">Total:</span>
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-stone-50 p-8">
                <h2 className="font-display text-2xl mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-8">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-black text-white text-center font-bold uppercase tracking-widest py-4 hover:bg-gray-900 transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
