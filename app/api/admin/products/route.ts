import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      perfumeType,
      topNotes,
      middleNotes,
      baseNotes,
      categoryId,
      images,
      variants,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        perfumeType,
        topNotes,
        middleNotes,
        baseNotes,
        categoryId,
        images,
        variants: {
          create: variants.map((v: any) => ({
            volume: v.volume,
            price: v.price,
            stock: v.stock,
            weight: v.weight,
            sku: v.sku || null,
          })),
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
