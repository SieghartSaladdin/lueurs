import Link from "next/link";
import Image from "next/image";

const families = [
  {
    id: 1,
    name: "Floral",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Woody",
    image: "https://images.unsplash.com/photo-1596276020587-8044fe049813?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Fresh",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Oriental",
    image: "https://images.unsplash.com/photo-1594619411454-ca18c19dd018?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function OlfactoryFamiliesSection() {
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
        {families.map((family) => (
          <Link
            key={family.id}
            href="#"
            className="group relative h-80 overflow-hidden block"
          >
            <Image
              src={family.image}
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
        ))}
      </div>
    </section>
  );
}
