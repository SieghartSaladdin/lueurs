"use client";

import { useRef } from "react";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Noir Intense",
    type: "Eau de Parfum",
    price: "$185.00",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Rose Poudrée",
    type: "Eau de Toilette",
    price: "$145.00",
    image: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Oud Royal",
    type: "Parfum Extract",
    price: "$250.00",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Citrus Vert",
    type: "Cologne",
    price: "$120.00",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Ambre Nuit",
    type: "Eau de Parfum",
    price: "$210.00",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
  },
];

export default function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
        <div>
          <span className="text-amber-700 font-bold uppercase tracking-widest text-xs mb-2 block">
            Curated Selection
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-medium">Trending Now</h2>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-gray-50 hover:bg-gray-100 w-12 h-12 flex items-center justify-center transition-colors"
            onClick={() => scrollTrending(-1)}
          >
            <i className="fas fa-arrow-left font-light"></i>
          </button>
          <button
            className="bg-gray-50 hover:bg-gray-100 w-12 h-12 flex items-center justify-center transition-colors"
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
        {products.map((product) => (
          <div key={product.id} className="min-w-[320px] cursor-pointer group">
            <div className="bg-stone-50 aspect-[4/5] mb-6 relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white text-black text-xs font-bold uppercase tracking-widest py-3 px-8 shadow-lg hover:bg-black hover:text-white transition-colors">
                  Add to Bag
                </button>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-display text-xl mb-1">{product.name}</h3>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                {product.type}
              </p>
              <p className="font-bold text-amber-900">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
