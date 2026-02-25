"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Category = {
  id: string;
  name: string;
};

type Variant = {
  id?: string;
  volume: number;
  price: number;
  stock: number;
  weight: number;
  sku: string;
};

type ProductFormProps = {
  categories: Category[];
  initialData?: any;
};

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    perfumeType: initialData?.perfumeType || "Eau de Parfum",
    topNotes: initialData?.topNotes || "",
    middleNotes: initialData?.middleNotes || "",
    baseNotes: initialData?.baseNotes || "",
    categoryId: initialData?.categoryId || (categories[0]?.id || ""),
    images: initialData?.images?.join("\n") || "",
  });

  const [variants, setVariants] = useState<Variant[]>(
    initialData?.variants || [
      { volume: 50, price: 0, stock: 0, weight: 200, sku: "" }
    ]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "name" && !initialData) {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      }));
    }
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { volume: 100, price: 0, stock: 0, weight: 300, sku: "" }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        images: formData.images.split("\n").filter((url: string) => url.trim() !== ""),
        variants: variants.map(v => ({
          ...v,
          volume: Number(v.volume),
          price: Number(v.price),
          stock: Number(v.stock),
          weight: Number(v.weight),
        }))
      };

      const url = initialData ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }

      toast.success(initialData ? "Product updated successfully" : "Product created successfully");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-display font-medium text-gray-900">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Perfume Type</label>
            <select
              name="perfumeType"
              value={formData.perfumeType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            >
              <option value="Eau de Parfum">Eau de Parfum</option>
              <option value="Extrait de Parfum">Extrait de Parfum</option>
              <option value="Eau de Toilette">Eau de Toilette</option>
              <option value="Cologne">Cologne</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-display font-medium text-gray-900">Olfactory Pyramid</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Top Notes</label>
            <input
              type="text"
              name="topNotes"
              value={formData.topNotes}
              onChange={handleChange}
              required
              placeholder="e.g., Bergamot, Lemon"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Middle Notes</label>
            <input
              type="text"
              name="middleNotes"
              value={formData.middleNotes}
              onChange={handleChange}
              required
              placeholder="e.g., Rose, Jasmine"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Notes</label>
            <input
              type="text"
              name="baseNotes"
              value={formData.baseNotes}
              onChange={handleChange}
              required
              placeholder="e.g., Vanilla, Musk"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-xl font-display font-medium text-gray-900">Images</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (One per line)</label>
          <textarea
            name="images"
            value={formData.images}
            onChange={handleChange}
            rows={4}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-display font-medium text-gray-900">Variants</h2>
          <button
            type="button"
            onClick={addVariant}
            className="text-sm font-medium text-black hover:underline"
          >
            + Add Variant
          </button>
        </div>
        
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg relative">
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Volume (ml)</label>
                  <input
                    type="number"
                    value={variant.volume}
                    onChange={(e) => handleVariantChange(index, "volume", e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Weight (g)</label>
                  <input
                    type="number"
                    value={variant.weight}
                    onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
