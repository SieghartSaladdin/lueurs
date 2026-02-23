"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  perfumeType: string;
  images: string[];
  variants: { price: number }[];
};

export default function TrendingSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products/trending');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch trending products", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
        <div>
          <span className="text-amber-700 font-bold uppercase tracking-widest text-xs mb-2 block">
            Curated Selection
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-medium">Trending Now</h2>
        </div>
      </div>

      {loading ? (
        <div className="w-full flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {products.slice(0, 4).map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id} className="relative group block h-[500px] md:h-[700px] overflow-hidden">
              <Image
                src={product.images[0] || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"}
                alt={product.name}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"></div>
              
              <div className="absolute bottom-10 left-10 right-10 text-white z-10">
                <p className="text-sm font-medium mb-2 drop-shadow-md">{product.perfumeType}</p>
                <h3 className="text-4xl md:text-5xl font-display font-medium mb-8 drop-shadow-md">{product.name}</h3>
                <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                  Shop
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-10 text-gray-500">No trending products found.</div>
      )}
    </section>
  );
}
