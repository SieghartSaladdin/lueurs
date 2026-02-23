"use client";

import { useState } from "react";
import { useCartStore } from "@/app/lib/store/cart";
import toast from "react-hot-toast";
import { formatCurrency } from "@/app/lib/utils";

type Variant = {
  id: string;
  volume: number;
  price: number;
  stock: number;
  weight: number;
};

type Product = {
  id: string;
  name: string;
  images: string[];
};

export default function AddToCartButton({
  variants,
  product,
}: {
  variants: Variant[];
  product: Product;
}) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[0]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addItem({
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      price: selectedVariant.price,
      volume: selectedVariant.volume,
      quantity: quantity,
      image: product.images[0] || "",
      weight: selectedVariant.weight,
    });
    
    toast.success("Added to bag!");

    // Fly to cart animation
    const productImage = document.getElementById("product-image");
    const cartIcon = document.getElementById("navbar-cart-icon");

    if (productImage && cartIcon) {
      const imgRect = productImage.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      const clone = productImage.cloneNode(true) as HTMLElement;
      
      // Style the clone
      clone.style.position = "fixed";
      clone.style.top = `${imgRect.top}px`;
      clone.style.left = `${imgRect.left}px`;
      clone.style.width = `${imgRect.width}px`;
      clone.style.height = `${imgRect.height}px`;
      clone.style.zIndex = "9999";
      clone.style.transition = "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease-in-out";
      clone.style.pointerEvents = "none";
      clone.style.borderRadius = "8px";
      clone.style.opacity = "0.8";
      clone.style.transformOrigin = "top left";

      document.body.appendChild(clone);

      // Force reflow
      clone.offsetWidth;

      // Calculate translation and scale
      const targetX = cartRect.left + cartRect.width / 2;
      const targetY = cartRect.top + cartRect.height / 2;
      
      const translateX = targetX - imgRect.left;
      const translateY = targetY - imgRect.top;
      const scale = 20 / imgRect.width; // scale down to 20px width

      // Animate to cart
      clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      clone.style.opacity = "0";

      // Clean up
      setTimeout(() => {
        if (document.body.contains(clone)) {
          document.body.removeChild(clone);
        }
        // Optional: Add a little bump animation to the cart icon
        cartIcon.style.transform = "scale(1.2)";
        cartIcon.style.transition = "transform 0.2s ease-in-out";
        setTimeout(() => {
          cartIcon.style.transform = "scale(1)";
        }, 200);
      }, 800);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-2xl font-medium mb-4">{selectedVariant ? formatCurrency(selectedVariant.price) : ""}</p>
        
        <div className="flex gap-4 mb-2">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              className={`px-6 py-3 border text-sm font-medium transition-colors ${
                selectedVariant?.id === variant.id
                  ? "border-black bg-black text-white"
                  : "border-gray-300 text-gray-700 hover:border-black"
              }`}
            >
              {variant.volume}ml
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          {selectedVariant?.volume === 5 && "Discovery Size"}
          {selectedVariant?.volume === 50 && "Standard Size"}
          {selectedVariant?.volume === 100 && "Signature Size"}
        </p>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center border border-gray-300">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-3 text-gray-500 hover:text-black transition-colors"
          >
            -
          </button>
          <span className="px-4 py-3 font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-3 text-gray-500 hover:text-black transition-colors"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock === 0}
          className="flex-1 bg-black text-white font-bold uppercase tracking-widest py-4 px-8 hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {selectedVariant?.stock === 0 ? "Out of Stock" : "Add to Bag"}
        </button>
      </div>
    </div>
  );
}
