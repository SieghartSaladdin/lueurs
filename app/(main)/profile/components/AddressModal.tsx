"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: any;
}

export default function AddressModal({ isOpen, onClose, addressToEdit }: AddressModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    cityName: "",
    provinceName: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        street: addressToEdit.street || "",
        cityName: addressToEdit.cityName || "",
        provinceName: addressToEdit.provinceName || "",
        postalCode: addressToEdit.postalCode || "",
        isDefault: addressToEdit.isDefault || false,
      });
    } else {
      setFormData({
        street: "",
        cityName: "",
        provinceName: "",
        postalCode: "",
        isDefault: false,
      });
    }
  }, [addressToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "/api/user/address";
      const method = addressToEdit ? "PUT" : "POST";
      const body = addressToEdit 
        ? { ...formData, id: addressToEdit.id, cityId: "1", provinceId: "1" }
        : { ...formData, cityId: "1", provinceId: "1" };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(addressToEdit ? "Address updated successfully!" : "Address added successfully!");
        onClose();
        router.refresh(); // Refresh the page to show new address
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save address");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const footerContent = (
    <div className="flex justify-end gap-2 mt-4">
      <Button label="Cancel" icon="pi pi-times" onClick={onClose} text disabled={loading} />
      <Button label={loading ? "Saving..." : "Save"} icon="pi pi-check" onClick={handleSubmit} disabled={loading} />
    </div>
  );

  return (
    <Dialog 
      header={addressToEdit ? "Edit Address" : "Add New Address"} 
      visible={isOpen} 
      onHide={onClose}
      footer={footerContent}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="street" className="text-sm font-medium text-gray-700">Street Address</label>
          <InputTextarea
            id="street"
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            placeholder="Jl. Sudirman No. 123, RT 01/RW 02"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="cityName" className="text-sm font-medium text-gray-700">City</label>
            <InputText
              id="cityName"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              placeholder="Jakarta Selatan"
              value={formData.cityName}
              onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="provinceName" className="text-sm font-medium text-gray-700">Province</label>
            <InputText
              id="provinceName"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              placeholder="DKI Jakarta"
              value={formData.provinceName}
              onChange={(e) => setFormData({ ...formData, provinceName: e.target.value })}
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">Postal Code</label>
          <InputText
            id="postalCode"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            placeholder="12345"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Checkbox
            inputId="isDefault"
            checked={formData.isDefault}
            onChange={(e) => setFormData({ ...formData, isDefault: e.checked || false })}
            className="border-gray-300 rounded text-black focus:ring-black"
          />
          <label htmlFor="isDefault" className="text-sm text-gray-900 cursor-pointer">
            Set as default address
          </label>
        </div>
      </form>
    </Dialog>
  );
}
