import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getTrendingProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 12,
      include: {
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "desc" }, // Assuming newer products are trending for now
    });
    
    // Sort variants by volume and convert Decimal to number
    return products.map(p => ({
      ...p,
      variants: p.variants.sort((a, b) => a.volume - b.volume).map(v => ({
        ...v,
        price: v.price.toNumber()
      }))
    }));
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return [];
  }
}

export async function getNewArrivals() {
  try {
    const products = await prisma.product.findMany({
      take: 8,
      include: {
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "asc" }, // Just to show different products
    });
    
    // Sort variants by volume and convert Decimal to number
    return products.map(p => ({
      ...p,
      variants: p.variants.sort((a, b) => a.volume - b.volume).map(v => ({
        ...v,
        price: v.price.toNumber()
      }))
    }));
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

export async function getProducts(searchParams?: {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  try {
    const where: Prisma.ProductWhereInput = {};

    if (searchParams?.category) {
      where.category = { is: { slug: searchParams.category } };
    }

    if (searchParams?.search) {
      where.OR = [
        { name: { contains: searchParams.search, mode: "insensitive" } },
        { description: { contains: searchParams.search, mode: "insensitive" } },
        { topNotes: { contains: searchParams.search, mode: "insensitive" } },
        { middleNotes: { contains: searchParams.search, mode: "insensitive" } },
        { baseNotes: { contains: searchParams.search, mode: "insensitive" } },
      ];
    }

    // Price filtering is a bit tricky because price is on the variant level.
    // We'll filter products that have AT LEAST ONE variant within the price range.
    if (searchParams?.minPrice || searchParams?.maxPrice) {
      where.variants = {
        some: {
          price: {
            ...(searchParams.minPrice ? { gte: parseFloat(searchParams.minPrice) } : {}),
            ...(searchParams.maxPrice ? { lte: parseFloat(searchParams.maxPrice) } : {}),
          },
        },
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Sort variants by volume and convert Decimal to number
    return products.map(p => ({
      ...p,
      variants: p.variants.sort((a, b) => a.volume - b.volume).map(v => ({
        ...v,
        price: v.price.toNumber()
      }))
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        category: true,
        reviews: {
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
        },
      },
    });
    
    if (product) {
      product.variants.sort((a, b) => a.volume - b.volume);
      product.reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      return {
        ...product,
        variants: product.variants.map(v => ({
          ...v,
          price: v.price.toNumber()
        }))
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}
