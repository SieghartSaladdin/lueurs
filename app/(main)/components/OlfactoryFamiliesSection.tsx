"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

const defaultImages: Record<string, string> = {
  "floral": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1200&auto=format&fit=crop",
  "woody": "https://images.unsplash.com/photo-1596276020587-8044fe049813?q=80&w=1200&auto=format&fit=crop",
  "fresh": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=1200&auto=format&fit=crop",
  "oriental": "https://images.unsplash.com/photo-1594619411454-ca18c19dd018?q=80&w=1674&auto=format&fit=crop",
};

export default function OlfactoryFamiliesSection() {
  const [families, setFamilies] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setFamilies(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-medium mb-4">
          Olfactory Families
        </h2>
        <p className="text-gray-500 font-light">
          Find the notes that resonate with your spirit. A guide to your perfect match.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : families.length > 0 ? (
          families.map((family) => (
            <Link
              key={family.id}
              href={`/products?category=${family.slug}`}
              className="group relative h-80 overflow-hidden block"
            >
              <Image
                src={defaultImages[family.slug] || "https://images.unsplash.com/photo-1596276020587-8044fe049813?q=80&w=1200&auto=format&fit=crop"}
                alt={family.name}
                fill
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white font-display text-2xl md:text-3xl italic group-hover:not-italic transition-all">
                  {family.name}
                </h3>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">No categories found.</div>
        )}
      </div>
    </section>
  );
}
