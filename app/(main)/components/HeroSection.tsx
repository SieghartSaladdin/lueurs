import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] bg-gray-900 overflow-hidden flex items-end justify-center pb-16 md:pb-24 px-6 md:px-12">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2664&auto=format&fit=crop"
        alt="Luxury Perfume"
        fill
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

      <div className="relative z-10 text-white max-w-4xl text-center fade-in-up">
        <p className="text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4 text-amber-100/80">
          The Signature Collection
        </p>
        <h1 className="text-6xl md:text-8xl font-display italic font-medium mb-6 leading-tight">
          Ethereal <br />
          <span className="not-italic font-light">Essence</span>
        </h1>
        <p className="mb-10 text-lg md:text-xl font-light text-gray-200 max-w-lg mx-auto leading-relaxed">
          Discover a world of rare ingredients and master craftsmanship. Scents that linger
          like a memory.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-white text-black px-10 py-3 rounded-none uppercase tracking-widest text-sm font-bold hover:bg-amber-50 transition-colors min-w-[200px]"
          >
            Shop Collection
          </Link>
          <Link
            href="/products?category=floral"
            className="bg-transparent border border-white text-white px-10 py-3 rounded-none uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black transition-colors min-w-[200px]"
          >
            Explore Floral
          </Link>
        </div>
      </div>
    </section>
  );
}
