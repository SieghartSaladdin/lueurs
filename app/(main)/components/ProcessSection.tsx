import Link from "next/link";
import Image from "next/image";

export default function ProcessSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-stone-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <div className="relative">
            <div className="w-full h-[600px] relative">
              <Image
                src="https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?q=80&w=2150&auto=format&fit=crop"
                alt="Process"
                fill
                className="object-cover filter grayscale contrast-125 hover:filter-none transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-white p-2 hidden md:block">
              <div className="w-full h-full relative">
                <Image
                  src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=800&auto=format&fit=crop"
                  alt="Detail"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 md:pl-8">
          <h3 className="text-amber-700 font-bold uppercase tracking-[0.2em] mb-4 text-xs">
            Our Process
          </h3>
          <h2 className="text-4xl md:text-6xl font-display font-medium mb-6 leading-tight">
            Mastery in <br />
            <i>Every Drop</i>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed font-light mb-8">
            We source the finest essences from Grasse, France to the hidden valleys of
            Morocco. Our perfumers blend tradition with innovation, aging each scent to
            perfection before it ever touches the bottle.
          </p>
          <ul className="space-y-4 mb-10 border-l-2 border-amber-900/20 pl-6">
            <li className="flex flex-col">
              <span className="font-bold uppercase tracking-widest text-xs mb-1">
                Sustainable Sourcing
              </span>
              <span className="text-gray-500 text-sm">
                Working directly with local farmers to ensure ethical practices.
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold uppercase tracking-widest text-xs mb-1">
                Slow Maceration
              </span>
              <span className="text-gray-500 text-sm">
                Allowing ingredients to marry for minimum 6 weeks.
              </span>
            </li>
          </ul>
          <Link
            href="#"
            className="inline-block border-b border-black pb-1 uppercase tracking-widest text-xs font-bold hover:text-amber-700 hover:border-amber-700 transition-colors"
          >
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
