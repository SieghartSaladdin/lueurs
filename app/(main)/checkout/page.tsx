"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/lib/store/cart";
import { formatCurrency } from "@/app/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [courier, setCourier] = useState<string>("jne");
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [shippingService, setShippingService] = useState<string>("");
  const [shippingNote, setShippingNote] = useState<string>("Select address and courier to calculate shipping cost.");
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchAddresses();
    }
  }, [session]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/address");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
        const defaultAddress = data.find((a: any) => a.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    }
  };

  useEffect(() => {
    if (selectedAddressId && items.length > 0) {
      calculateShipping();
    }
  }, [selectedAddressId, courier, items]);

  const calculateShipping = async () => {
    const address = addresses.find((a) => a.id === selectedAddressId);
    if (!address) {
      setShippingCost(0);
      setShippingService("");
      setShippingNote("Please select a shipping address first.");
      return;
    }

    setIsCalculating(true);
    setShippingNote("Calculating shipping cost...");
    try {
      // Calculate total weight (assuming each item has a weight property, default to 250g if not)
      const totalWeight = items.reduce((acc, item) => acc + (item.weight || 250) * item.quantity, 0);

      const res = await fetch("/api/shipping/cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: address.cityId,
          weight: totalWeight,
          courier,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.costs && data.costs.length > 0) {
          // Get the first available service cost
          const firstCost = data.costs[0];
          setShippingCost(firstCost.cost);
          setShippingService(firstCost.service || "");
          setShippingNote("Shipping cost is ready.");
        } else {
          setShippingCost(0);
          setShippingService("");
          setShippingNote("Shipping cost is not available for this destination.");
          toast.error("Shipping cost not available for this destination");
        }
      } else {
        const data = await res.json();
        setShippingCost(0);
        setShippingService("");
        setShippingNote(data.message || "Failed to calculate shipping cost.");
        toast.error(data.message || "Failed to calculate shipping cost");
      }
    } catch (error) {
      console.error("Failed to calculate shipping", error);
      setShippingCost(0);
      setShippingService("");
      setShippingNote("Failed to calculate shipping cost. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCheckout = async () => {
    if (shippingCost <= 0) {
      toast.error("Shipping cost is not available yet");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    const address = addresses.find((a) => a.id === selectedAddressId);

    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({ variantId: item.id, quantity: item.quantity })),
          shippingAddress: address,
          shippingCost,
          courier,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Checkout failed");
      }

      if (data.invoiceUrl) {
        clearCart();
        window.location.href = data.invoiceUrl;
      } else {
        throw new Error("Failed to get payment URL");
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || !session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6 text-center">
        <h1 className="text-3xl font-display mb-4">Your cart is empty</h1>
        <button onClick={() => router.push("/products")} className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm font-bold">
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-display mb-6">Shipping Address</h2>
            
            {addresses.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">You don't have any saved addresses.</p>
                <button onClick={() => router.push("/profile")} className="text-amber-700 font-medium hover:underline">
                  Add an address in your profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <label key={address.id} className={`block p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === address.id ? 'border-amber-700 bg-amber-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="mt-1 text-amber-700 focus:ring-amber-700"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{address.street}</p>
                        <p className="text-sm text-gray-500">{address.cityName}, {address.provinceName} {address.postalCode}</p>
                        {address.isDefault && <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Default</span>}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-display mb-6">Shipping Method</h2>
            <div className="grid grid-cols-3 gap-4">
              {['jne', 'pos', 'tiki'].map((c) => (
                <label key={c} className={`block p-4 border rounded-lg cursor-pointer text-center transition-colors ${courier === c ? 'border-amber-700 bg-amber-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="courier"
                    value={c}
                    checked={courier === c}
                    onChange={(e) => setCourier(e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-bold uppercase tracking-widest text-sm">{c}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 sticky top-28">
            <h2 className="text-2xl font-display mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-stone-50 relative shrink-0 rounded overflow-hidden">
                    <Image src={item.image || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.volume}ml x {item.quantity}</p>
                    <p className="text-sm font-medium mt-1">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping ({courier.toUpperCase()})</span>
                <span>{isCalculating ? "Calculating..." : formatCurrency(shippingCost)}</span>
              </div>
              <div className="text-xs text-gray-500">
                {shippingService ? `Service: ${shippingService}` : "Service: -"}
              </div>
              <div className="text-xs text-gray-500">
                {shippingNote}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading || isCalculating || !selectedAddressId || shippingCost <= 0}
              className="w-full mt-8 bg-black text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
