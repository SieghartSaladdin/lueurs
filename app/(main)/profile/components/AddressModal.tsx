"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { AutoComplete } from "primereact/autocomplete";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.375rem'
};

const defaultCenter = {
  lat: -6.200000, // Default Jakarta
  lng: 106.816666
};

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: any;
}

export default function AddressModal({ isOpen, onClose, addressToEdit }: AddressModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    street: "",
    addressId: "",
    addressName: "",
    countryName: "",
    countryCode: "",
    provinceName: "",
    provinceType: "",
    cityName: "",
    cityType: "",
    districtName: "",
    districtType: "",
    postalCode: "",
    latitude: null as number | null,
    longitude: null as number | null,
    isDefault: false,
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDckv5CWgT0ni00bpPOjybLzIoSE2PynPw"
  });

  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    if (isOpen) {
      // search will be performed on demand by AutoComplete
    }
  }, [isOpen]);

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        street: addressToEdit.street || "",
        addressId: addressToEdit.biteshipId || addressToEdit.addressId || "",
        addressName: addressToEdit.addressName || addressToEdit.name || "",
        countryName: addressToEdit.countryName || "",
        countryCode: addressToEdit.countryCode || "",
        provinceName: addressToEdit.provinceName || addressToEdit.administrative_division_level_1_name || "",
        provinceType: addressToEdit.provinceType || addressToEdit.administrative_division_level_1_type || "",
        cityName: addressToEdit.cityName || addressToEdit.administrative_division_level_2_name || "",
        cityType: addressToEdit.cityType || addressToEdit.administrative_division_level_2_type || "",
        districtName: addressToEdit.districtName || addressToEdit.administrative_division_level_3_name || "",
        districtType: addressToEdit.districtType || addressToEdit.administrative_division_level_3_type || "",
        postalCode: addressToEdit.postalCode || addressToEdit.postal_code || "",
        latitude: addressToEdit.latitude || null,
        longitude: addressToEdit.longitude || null,
        isDefault: addressToEdit.isDefault || false,
      });
      
      if (addressToEdit.latitude && addressToEdit.longitude) {
        setMapCenter({ lat: addressToEdit.latitude, lng: addressToEdit.longitude });
      }

      // preload single selected address into suggestions so autocomplete shows value
      if (addressToEdit.addressId || addressToEdit.biteshipId) {
        setAddresses([{ 
          id: addressToEdit.addressId || addressToEdit.biteshipId, 
          name: addressToEdit.addressName || addressToEdit.name || '', 
          postal_code: addressToEdit.postal_code || addressToEdit.postalCode,
          latitude: addressToEdit.latitude,
          longitude: addressToEdit.longitude
        }]);
      }
    } else {
      setFormData({
        street: "",
        addressId: "",
        addressName: "",
        countryName: "",
        countryCode: "",
        provinceName: "",
        provinceType: "",
        cityName: "",
        cityType: "",
        districtName: "",
        districtType: "",
        postalCode: "",
        latitude: null,
        longitude: null,
        isDefault: false,
      });
      setAddresses([]);
      setMapCenter(defaultCenter);
    }
  }, [addressToEdit, isOpen]);

  const handleAddressChange = async (e: any) => {
    const selected = addresses.find((a) => String(a.id) === String(e.value?.id || e.value));
    if (selected) {
      const addressName = selected.name || selected.address_name || "";
      
      setFormData({
        ...formData,
        addressId: String(selected.id),
        addressName: addressName,
        countryName: selected.country_name || "",
        countryCode: selected.country_code || "",
        provinceName: selected.administrative_division_level_1_name || "",
        provinceType: selected.administrative_division_level_1_type || "",
        cityName: selected.administrative_division_level_2_name || "",
        cityType: selected.administrative_division_level_2_type || "",
        districtName: selected.administrative_division_level_3_name || "",
        districtType: selected.administrative_division_level_3_type || "",
        postalCode: String(selected.postal_code || formData.postalCode || ""),
        latitude: selected.latitude || null,
        longitude: selected.longitude || null,
      });
      
      if (selected.latitude && selected.longitude) {
        setMapCenter({ lat: selected.latitude, lng: selected.longitude });
      } else if (addressName) {
        // Geocode the selected area to center the map
        try {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address: addressName }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const location = results[0].geometry.location;
              setMapCenter({ lat: location.lat(), lng: location.lng() });
              // Optionally set the marker to the center of the area
              // setFormData(prev => ({ ...prev, latitude: location.lat(), longitude: location.lng() }));
            }
          });
        } catch (err) {
          console.error("Geocoding error:", err);
        }
      }
    } else {
      setFormData({ ...formData, addressId: "", addressName: e.value || "", latitude: null, longitude: null });
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setFormData({ ...formData, latitude: lat, longitude: lng });
    }
  };

  const searchAddresses = async (event: any) => {
    const q = event.query || "";
    if (!q) {
      setAddresses([]);
      return;
    }
    try {
      const res = await fetch(`/api/shipping/address?search=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setAddresses(data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.street || !formData.addressId || !formData.postalCode) {
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
          <label htmlFor="addressName" className="text-sm font-medium text-gray-700">Address</label>
          <AutoComplete
            id="addressName"
            value={formData.addressName}
            suggestions={addresses}
            completeMethod={searchAddresses}
            field="name"
            onChange={(e) => handleAddressChange(e)}
            placeholder="Search an address (e.g. Kiaracondong, Bandung, Jawa Barat. 40281)"
            dropdown={true}
            aria-label="address"
            className="w-full border border-gray-300 rounded-md"
          />
        </div>

        {isLoaded && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Pinpoint Location</label>
            <p className="text-xs text-gray-500">Click on the map to set your exact location.</p>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={15}
                onClick={handleMapClick}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                }}
              >
                {formData.latitude && formData.longitude && (
                  <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
                )}
              </GoogleMap>
            </div>
            {formData.latitude && formData.longitude && (
              <small className="text-green-600">
                ✓ Location selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </small>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="street" className="text-sm font-medium text-gray-700">Street Address (detail)</label>
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
          <div className="flex flex-col gap-2">
            <label htmlFor="provinceName" className="text-sm font-medium text-gray-700">Province / City</label>
            <InputText
              id="provinceName"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              value={`${formData.provinceName}${formData.cityName ? ` / ${formData.cityName}` : ''}`}
            />
          </div>
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
