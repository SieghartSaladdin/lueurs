import { getProductBySlug } from "@/app/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "./components/AddToCartButton";
import ReviewSection from "./components/ReviewSection";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | LUEURS`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section 1: The Buy Module */}
        <div className="flex flex-col md:flex-row gap-12 mb-24">
          {/* Left: Image Gallery */}
          <div className="w-full md:w-1/2">
            <div id="product-image" className="bg-stone-50 aspect-4/5 relative">
              <Image
                src={product.images[0] || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"}
                alt={product.name}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>

          {/* Right: Product Info & Buy */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                {product.category.name}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-medium mb-2">
              {product.name}
            </h1>
            <p className="text-gray-500 uppercase tracking-wider text-sm mb-6">
              {product.perfumeType}
            </p>
            
            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            <AddToCartButton variants={product.variants} product={product} />

            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                <i className="fas fa-truck w-5 text-center"></i>
                <span>Free shipping on orders over Rp 2.000.000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <i className="fas fa-undo w-5 text-center"></i>
                <span>Complimentary returns within 30 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: The Scent Profile (Piramida Aroma) */}
        <div className="mb-24 bg-stone-50 py-16 px-8 text-center">
          <h2 className="text-3xl font-display font-medium mb-12">Olfactory Pyramid</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <span className="font-display text-xl">1</span>
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2">Top Notes</h3>
              <p className="text-gray-500 text-sm mb-2">The first impression. Evaporates in 15 minutes.</p>
              <p className="font-medium">{product.topNotes}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <span className="font-display text-xl">2</span>
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2">Heart Notes</h3>
              <p className="text-gray-500 text-sm mb-2">The main character. Lasts up to 4 hours.</p>
              <p className="font-medium">{product.middleNotes}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <span className="font-display text-xl">3</span>
              </div>
              <h3 className="font-bold uppercase tracking-widest text-sm mb-2">Base Notes</h3>
              <p className="text-gray-500 text-sm mb-2">The memory trail. Lasts all day.</p>
              <p className="font-medium">{product.baseNotes}</p>
            </div>
          </div>
        </div>

        {/* Section 4: Reviews & Ratings */}
        <ReviewSection reviews={product.reviews} productId={product.id} />
      </div>
    </div>
  );
}
