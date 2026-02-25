import { prisma } from "@/app/lib/prisma";
import ProductForm from "../components/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-medium text-gray-900 mb-2">
          Add New Product
        </h1>
        <p className="text-gray-500 font-light">
          Create a new perfume product and its variants.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
