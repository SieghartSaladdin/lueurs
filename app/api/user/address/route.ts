import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: 'desc' },
    });

    return NextResponse.json(addresses, { status: 200 });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      street, 
      addressId,
      addressName,
      countryName,
      countryCode,
      provinceName,
      provinceType,
      cityName,
      cityType,
      districtName,
      districtType,
      postalCode,
      latitude,
      longitude,
      isDefault 
    } = body;

    if (!street || !addressId || !postalCode) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Jika alamat ini dijadikan default, reset alamat default lainnya
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        street,
        biteshipId: addressId,
        addressName,
        countryName,
        countryCode,
        provinceName,
        provinceType,
        cityName,
        cityType,
        districtName,
        districtType,
        postalCode,
        latitude: latitude !== undefined && latitude !== null ? Number(latitude) : null,
        longitude: longitude !== undefined && longitude !== null ? Number(longitude) : null,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      id,
      street, 
      addressId,
      addressName,
      countryName,
      countryCode,
      provinceName,
      provinceType,
      cityName,
      cityType,
      districtName,
      districtType,
      postalCode,
      latitude,
      longitude,
      isDefault 
    } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing address ID" }, { status: 400 });
    }

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json({ message: "Address not found or unauthorized" }, { status: 404 });
    }

    // Jika alamat ini dijadikan default, reset alamat default lainnya
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, id: { not: id }, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        street,
        biteshipId: addressId,
        addressName,
        countryName,
        countryCode,
        provinceName,
        provinceType,
        cityName,
        cityType,
        districtName,
        districtType,
        postalCode,
        latitude: latitude !== undefined && latitude !== null ? Number(latitude) : null,
        longitude: longitude !== undefined && longitude !== null ? Number(longitude) : null,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Address ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json({ message: "Address not found or unauthorized" }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Address deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
