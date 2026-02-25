import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Pastikan payload dari frontend mengirim 'destination' berupa area_id dari Biteship
    const { destination, weight, courier, items } = body;

    // Validasi dasar
    if (!destination || !weight) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.BITESHIP_API_KEY;
    // Gunakan Area ID Toko Anda (Bukan ID Kota RajaOngkir!)
    const origin = process.env.STORE_AREA_ID || "IDNP11IDNC167"; 

    if (!apiKey) {
      return NextResponse.json({ message: "API Key Error" }, { status: 500 });
    }

    // Format kurir: "jne,sicepat,jnt,anteraja" (tanpa spasi setelah koma)
    // Jika user pilih 'all', kita tembak kurir populer saja
    const selectedCouriers = (!courier || courier === 'all') 
      ? "jne,sicepat,jnt,anteraja" 
      : courier.toLowerCase();

    // -- REQUEST KE BITESHIP --
    const response = await fetch("https://api.biteship.com/v1/rates/couriers", { // <--- Endpoint yang Benar
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": apiKey, // Coba langsung key dulu, atau pakai `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        origin_area_id: origin,
        destination_area_id: destination,
        couriers: selectedCouriers,
        items: items && items.length > 0 ? items : [
          {
            name: "Produk Toko",
            description: "Aksesoris",
            value: 150000, // Harga barang (Wajib estimasi agar asuransi hitung)
            length: 10,
            width: 10,
            height: 5,
            weight: parseInt(weight), // Pastikan Integer (Gram)
            quantity: 1
          }
        ]
      }),
    });

    const data = await response.json();

    // Cek jika Biteship error (misal area_id tidak ditemukan)
    if (!data.success) {
      return NextResponse.json(
        { message: data.error || "Gagal cek ongkir dari Biteship" },
        { status: 400 }
      );
    }

    // -- MAPPING DATA UNTUK FRONTEND --
    // Biteship mengembalikan array di 'pricing'
    const costs = data.pricing.map((rate: any) => ({
      // Nama Kurir (JNE) + Layanan (REG)
      service: `${rate.courier_name} ${rate.service_type}`, 
      service_name: `${rate.courier_name} ${rate.service_type}`, // Tambahan field ini untuk frontend
      description: `Estimasi ${rate.duration}`, // Estimasi hari
      cost: rate.price, // Harga Ongkir
      price: rate.price, // Tambahan field ini untuk frontend
      etd: rate.duration, // Opsional: data tambahan
      courier_code: rate.courier_code, // Opsional: jne/sicepat
      courier_service_code: rate.courier_service_code // Tambahan untuk webhook xendit
    }));

    return NextResponse.json({ costs });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}