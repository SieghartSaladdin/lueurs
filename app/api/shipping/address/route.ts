import { NextResponse } from "next/server";

export async function GET(request : Request) {
  try {
    const apiKey = process.env.BITESHIP_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "Biteship API key is not configured" }, { status: 500 });
    }

    // Tangkap kata kunci pencarian dari URL, misal: /api/lokasi?search=bandung
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search");

    if (!searchQuery) {
      return NextResponse.json({ message: "Parameter 'search' dibutuhkan" }, { status: 400 });
    }

    // Panggil endpoint Maps/Areas dari Biteship
    const response = await fetch(`https://api.biteship.com/v1/maps/areas?countries=ID&input=${searchQuery}&type=single`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey, // Biteship hanya butuh API key di header Authorization
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.error || "Gagal mengambil data dari Biteship" }, { status: response.status });
    }

    // Biteship mengembalikan data di dalam object "areas"
    return NextResponse.json(data.areas);

  } catch (error) {
    console.error("Error fetching areas:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}