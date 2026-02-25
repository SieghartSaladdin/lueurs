import { prisma } from "@/app/lib/prisma";
import ProductForm from "../components/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  // Convert Decimal to number for the form
  const formattedProduct = {
    ...product,
    variants: product.variants.map((v) => ({
      ...v,
      price: Number(v.price),
    })),
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-medium text-gray-900 mb-2">
          Edit Product
        </h1>
        <p className="text-gray-500 font-light">
          Update perfume details and variants.
        </p>
      </div>

      <ProductForm categories={categories} initialData={formattedProduct} />
    </div>
  );
}
