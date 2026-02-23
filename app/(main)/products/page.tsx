import { getProducts, getCategories } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";
import ProductFilters from "./components/ProductFilters";
import { Suspense } from "react";
import { formatCurrency } from "@/app/lib/utils";

export const metadata = {
  title: "All Fragrances | LUEURS",
  description: "Discover our collection of luxury fragrances.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;
  const minPrice = typeof resolvedSearchParams.minPrice === "string" ? resolvedSearchParams.minPrice : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === "string" ? resolvedSearchParams.maxPrice : undefined;

  const products = await getProducts({ category, search, minPrice, maxPrice });
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* Header */}
      <div className="bg-stone-100 py-16 px-6 md:px-12 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-medium mb-4">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : "All Fragrances"}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our curated selection of ethereal essences. Find the perfect scent that resonates with your spirit.
        </p>
      </div>

      <div className="px-6 md:px-12 flex flex-col md:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ProductFilters categories={categories} currentCategory={category} />
          </Suspense>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <p className="text-sm text-gray-500">{products.length} Results</p>
            {/* Sort could go here */}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id} className="group block">
                  <div className="bg-stone-50 aspect-4/5 mb-4 relative overflow-hidden">
                    <Image
                      src={product.images[0] || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"}
                      alt={product.name}
                      fill
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white text-black text-xs font-bold uppercase tracking-widest py-3 px-8 shadow-lg hover:bg-black hover:text-white transition-colors">
                        Quick View
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-display text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                      {product.perfumeType}
                    </p>
                    <p className="font-medium">
                      {product.variants && product.variants.length > 0 
                        ? `From ${formatCurrency(product.variants[0].price)}` 
                        : "Price Unavailable"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-display mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
