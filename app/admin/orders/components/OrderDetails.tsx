"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatCurrency } from "@/app/lib/utils";
import Image from "next/image";

type OrderDetailsProps = {
  order: any;
};

export default function OrderDetails({ order }: OrderDetailsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      toast.success("Order updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const shippingAddress = typeof order.shippingAddress === 'string' 
    ? JSON.parse(order.shippingAddress) 
    : order.shippingAddress;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Order Items */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-display font-medium text-gray-900 mb-6">
            Order Items
          </h2>
          <div className="space-y-6">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center text-gray-400">
                    {item.variant.product.images && item.variant.product.images[0] ? (
                      <Image
                        src={item.variant.product.images[0]}
                        alt={item.variant.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <i className="fas fa-image"></i>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.variant.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.variant.volume}ml
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-medium text-gray-900">
                  {formatCurrency(Number(item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-display font-medium text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> <span className="font-medium">{order.user.name || "Guest"}</span></p>
              <p><span className="text-gray-500">Email:</span> <span className="font-medium">{order.user.email}</span></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-display font-medium text-gray-900 mb-4">
              Shipping Address
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{shippingAddress?.street}</p>
              <p>{shippingAddress?.cityName}, {shippingAddress?.provinceName}</p>
              <p>{shippingAddress?.postalCode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary & Actions */}
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-display font-medium text-gray-900 mb-6">
            Order Summary
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">
                {formatCurrency(Number(order.totalAmount) - Number(order.shippingCost))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping ({order.courier})</span>
              <span className="font-medium">
                {formatCurrency(Number(order.shippingCost))}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900 text-lg">
                {formatCurrency(Number(order.totalAmount))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-display font-medium text-gray-900">
            Update Order
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g., JNE1234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full bg-black text-white px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
