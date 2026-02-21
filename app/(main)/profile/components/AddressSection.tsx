"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import AddressModal from "./AddressModal";

export default function AddressSection({ addresses }: { addresses: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const handleEdit = (address: any) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/user/address?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Address deleted successfully");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete address");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this address?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 border border-transparent px-4 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out',
      rejectClassName: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 px-4 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out',
      accept: () => handleDelete(id),
    });
  };

  return (
    <section id="addresses" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <ConfirmDialog />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">Addresses</h2>
        <button 
          onClick={handleAddNew}
          className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors"
        >
          + Add New
        </button>
      </div>
      
      {addresses.length === 0 ? (
        <p className="text-gray-500">You haven't saved any addresses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 rounded-lg p-4 relative">
              {address.isDefault && (
                <span className="absolute top-4 right-4 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                  Default
                </span>
              )}
              <p className="font-medium mb-1">{address.street}</p>
              <p className="text-sm text-gray-600">{address.cityName}, {address.provinceName}</p>
              <p className="text-sm text-gray-600">{address.postalCode}</p>
              <div className="mt-4 flex space-x-3">
                <button 
                  onClick={() => handleEdit(address)}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => confirmDelete(address.id)}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        addressToEdit={selectedAddress}
      />
    </section>
  );
}
