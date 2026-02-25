import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    // Update product and its variants
    // We'll delete existing variants and recreate them for simplicity
    // In a real app, you might want to update existing ones to preserve order history
    
    const product = await prisma.$transaction(async (tx) => {
      // Delete existing variants
      await tx.productVariant.deleteMany({
        where: { productId: id },
      });

      // Update product and create new variants
      return await tx.product.update({
        where: { id },
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
        include: {
          variants: true,
        },
      });
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
