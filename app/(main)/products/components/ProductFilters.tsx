"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function ProductFilters({
  categories,
  currentCategory,
}: {
  categories: Category[];
  currentCategory?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (search) params.set("search", search);
    else params.delete("search");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentCategory === slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/products", { scroll: false });
  };

  return (
    <div className="space-y-8 sticky top-24">
      {/* Search */}
      <div>
        <h3 className="font-display text-lg mb-4 border-b pb-2">Search</h3>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleFilter();
          }} 
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Search notes, names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
          >
            Go
          </button>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-display text-lg mb-4 border-b pb-2">Olfactory Families</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => handleCategoryChange(cat.slug)}
                className={`text-sm hover:text-black transition-colors ${
                  currentCategory === cat.slug ? "font-bold text-black" : "text-gray-500"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-display text-lg mb-4 border-b pb-2">Price Range</h3>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleFilter();
          }}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Clear Filters */}
      {(search || minPrice || maxPrice || currentCategory) && (
        <button
          onClick={clearFilters}
          className="w-full border border-black text-black px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
