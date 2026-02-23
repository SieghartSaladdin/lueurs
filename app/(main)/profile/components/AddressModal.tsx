"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: any;
}

export default function AddressModal({ isOpen, onClose, addressToEdit }: AddressModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    street: "",
    provinceId: "",
    provinceName: "",
    cityId: "",
    cityName: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (isOpen) {
      fetchProvinces();
    }
  }, [isOpen]);

  const fetchProvinces = async () => {
    try {
      const res = await fetch("/api/shipping/provinces");
      if (res.ok) {
        const data = await res.json();
        setProvinces(data);
      }
    } catch (error) {
      console.error("Failed to fetch provinces", error);
    }
  };

  const fetchCities = async (provinceId: string) => {
    try {
      const res = await fetch(`/api/shipping/cities?province=${provinceId}`);
      if (res.ok) {
        const data = await res.json();
        setCities(data);
      }
    } catch (error) {
      console.error("Failed to fetch cities", error);
    }
  };

  useEffect(() => {
    if (formData.provinceId) {
      fetchCities(formData.provinceId);
    } else {
      setCities([]);
    }
  }, [formData.provinceId]);

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        street: addressToEdit.street || "",
        provinceId: String(addressToEdit.provinceId) || "",
        provinceName: addressToEdit.provinceName || "",
        cityId: String(addressToEdit.cityId) || "",
        cityName: addressToEdit.cityName || "",
        postalCode: addressToEdit.postalCode || "",
        isDefault: addressToEdit.isDefault || false,
      });
    } else {
      setFormData({
        street: "",
        provinceId: "",
        provinceName: "",
        cityId: "",
        cityName: "",
        postalCode: "",
        isDefault: false,
      });
    }
  }, [addressToEdit, isOpen]);

  const handleProvinceChange = (e: any) => {
    const selectedProvince = provinces.find(p => String(p.id) === String(e.value));
    setFormData({
      ...formData,
      provinceId: String(e.value),
      provinceName: selectedProvince ? selectedProvince.name : "",
      cityId: "",
      cityName: "",
    });
  };

  const handleCityChange = (e: any) => {
    const selectedCity = cities.find(c => String(c.id) === String(e.value));
    setFormData({
      ...formData,
      cityId: String(e.value),
      cityName: selectedCity ? selectedCity.name : "",
      // If postal code is not provided by the API, keep the existing one
      postalCode: selectedCity?.postal_code || formData.postalCode,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.street || !formData.provinceId || !formData.cityId || !formData.postalCode) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const url = "/api/user/address";
      const method = addressToEdit ? "PUT" : "POST";
      const body = addressToEdit 
        ? { ...formData, id: addressToEdit.id }
        : { ...formData };

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
            <label htmlFor="provinceId" className="text-sm font-medium text-gray-700">Province</label>
            <Dropdown
              id="provinceId"
              value={formData.provinceId ? Number(formData.provinceId) : null}
              onChange={handleProvinceChange}
              options={provinces}
              optionLabel="name"
              optionValue="id"
              placeholder="Select a Province"
              filter
              className="w-full border border-gray-300 rounded-md"
              pt={{
                input: { className: 'px-3 py-2' },
                trigger: { className: 'px-3' }
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="cityId" className="text-sm font-medium text-gray-700">City</label>
            <Dropdown
              id="cityId"
              value={formData.cityId ? Number(formData.cityId) : null}
              onChange={handleCityChange}
              options={cities}
              optionLabel="name"
              optionValue="id"
              placeholder="Select a City"
              filter
              disabled={!formData.provinceId}
              className="w-full border border-gray-300 rounded-md"
              pt={{
                input: { className: 'px-3 py-2' },
                trigger: { className: 'px-3' }
              }}
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
