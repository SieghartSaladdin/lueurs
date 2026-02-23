"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/app/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  perfumeType: string;
  images: string[];
  variants: { price: number }[];
};

export default function NewArrivalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products/new-arrivals');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch new arrivals", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const scrollTrending = (direction: number) => {
    if (scrollRef.current) {
      const scrollAmount = 350; // approximate width
      scrollRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 px-6 md:px-12 bg-stone-50">
      <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
        <div>
          <span className="text-amber-700 font-bold uppercase tracking-widest text-xs mb-2 block">
            Just In
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-medium">New Arrivals</h2>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-white hover:bg-gray-100 w-12 h-12 flex items-center justify-center transition-colors border border-gray-200"
            onClick={() => scrollTrending(-1)}
          >
            <i className="fas fa-arrow-left font-light"></i>
          </button>
          <button
            className="bg-white hover:bg-gray-100 w-12 h-12 flex items-center justify-center transition-colors border border-gray-200"
            onClick={() => scrollTrending(1)}
          >
            <i className="fas fa-arrow-right font-light"></i>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex space-x-8 overflow-x-auto no-scrollbar scroll-smooth pb-10"
      >
        {loading ? (
          <div className="w-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id} className="min-w-[500px] cursor-pointer group block">
              <div className="bg-white aspect-1/1 mb-6 relative overflow-hidden border border-gray-100">
                <Image
                  src={product.images[0] || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"}
                  alt={product.name}
                  fill
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-black text-white text-xs font-bold uppercase tracking-widest py-3 px-8 shadow-lg hover:bg-amber-900 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-display text-xl mb-1">{product.name}</h3>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                  {product.perfumeType}
                </p>
                <p className="font-bold text-amber-900">
                  {product.variants && product.variants.length > 0 
                    ? formatCurrency(product.variants[0].price)
                    : "Price Unavailable"}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="w-full text-center py-10 text-gray-500">No new arrivals found.</div>
        )}
      </div>
    </section>
  );
}
