import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Buat connection pool menggunakan pg
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// 2. Inisialisasi adapter dengan pool tersebut
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 3. Oper adapter ke dalam PrismaClient
async function main() {
  console.log('Start seeding...');

  // 1. Create Categories (Olfactory Families)
  const floral = await prisma.category.upsert({
    where: { slug: 'floral' },
    update: {},
    create: { name: 'Floral', slug: 'floral' },
  });

  const woody = await prisma.category.upsert({
    where: { slug: 'woody' },
    update: {},
    create: { name: 'Woody', slug: 'woody' },
  });

  const oriental = await prisma.category.upsert({
    where: { slug: 'oriental' },
    update: {},
    create: { name: 'Oriental', slug: 'oriental' },
  });

  const fresh = await prisma.category.upsert({
    where: { slug: 'fresh' },
    update: {},
    create: { name: 'Fresh', slug: 'fresh' },
  });

  console.log('Categories seeded.');

  // 2. Create Products
  const noirIntense = await prisma.product.upsert({
    where: { slug: 'noir-intense' },
    update: {},
    create: {
      name: 'Noir Intense',
      slug: 'noir-intense',
      description: 'A deep, mysterious fragrance that captures the essence of a midnight stroll through an ancient forest. Rich, smoky, and undeniably seductive.',
      perfumeType: 'Eau de Parfum',
      topNotes: 'Bergamot, Black Pepper, Cardamom',
      middleNotes: 'Oud, Turkish Rose, Saffron',
      baseNotes: 'Sandalwood, Amber, Patchouli',
      images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop'],
      categoryId: woody.id,
      variants: {
        create: [
          { volume: 5, price: 25.00, stock: 100, weight: 50, sku: 'NI-EDP-05' },
          { volume: 50, price: 185.00, stock: 50, weight: 250, sku: 'NI-EDP-50' },
          { volume: 100, price: 280.00, stock: 30, weight: 400, sku: 'NI-EDP-100' },
        ]
      }
    },
  });

  const rosePoudree = await prisma.product.upsert({
    where: { slug: 'rose-poudree' },
    update: {},
    create: {
      name: 'Rose Poudrée',
      slug: 'rose-poudree',
      description: 'A delicate and romantic interpretation of the classic rose. Powdery, soft, and elegantly feminine, reminiscent of vintage cosmetics.',
      perfumeType: 'Eau de Toilette',
      topNotes: 'Lychee, Raspberry, Pink Grapefruit',
      middleNotes: 'Damask Rose, Peony, Violet',
      baseNotes: 'White Musk, Vanilla, Cedarwood',
      images: ['https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=800&auto=format&fit=crop'],
      categoryId: floral.id,
      variants: {
        create: [
          { volume: 5, price: 20.00, stock: 150, weight: 50, sku: 'RP-EDT-05' },
          { volume: 50, price: 145.00, stock: 80, weight: 250, sku: 'RP-EDT-50' },
          { volume: 100, price: 220.00, stock: 40, weight: 400, sku: 'RP-EDT-100' },
        ]
      }
    },
  });

  const oudRoyal = await prisma.product.upsert({
    where: { slug: 'oud-royal' },
    update: {},
    create: {
      name: 'Oud Royal',
      slug: 'oud-royal',
      description: 'The epitome of luxury. A majestic blend centered around the rare and precious agarwood, balanced with sweet spices and warm resins.',
      perfumeType: 'Extrait de Parfum',
      topNotes: 'Saffron, Nutmeg, Cinnamon',
      middleNotes: 'Agarwood (Oud), Rose, Leather',
      baseNotes: 'Amber, Vanilla, Frankincense',
      images: ['https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=800&auto=format&fit=crop'],
      categoryId: oriental.id,
      variants: {
        create: [
          { volume: 5, price: 35.00, stock: 50, weight: 50, sku: 'OR-EXT-05' },
          { volume: 50, price: 250.00, stock: 20, weight: 250, sku: 'OR-EXT-50' },
        ]
      }
    },
  });

  const citrusVert = await prisma.product.upsert({
    where: { slug: 'citrus-vert' },
    update: {},
    create: {
      name: 'Citrus Vert',
      slug: 'citrus-vert',
      description: 'An invigorating burst of sunshine. Crisp, clean, and vibrantly fresh, perfect for awakening the senses on a warm summer day.',
      perfumeType: 'Cologne',
      topNotes: 'Lemon, Bergamot, Mandarin Orange',
      middleNotes: 'Neroli, Petitgrain, Basil',
      baseNotes: 'Vetiver, Oakmoss, White Musk',
      images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop'],
      categoryId: fresh.id,
      variants: {
        create: [
          { volume: 50, price: 120.00, stock: 100, weight: 250, sku: 'CV-COL-50' },
          { volume: 100, price: 180.00, stock: 60, weight: 400, sku: 'CV-COL-100' },
        ]
      }
    },
  });

  console.log('Products and Variants seeded.');

  // 3. Create a Dummy User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lueurs.com' },
    update: {},
    create: {
      name: 'Admin Lueurs',
      email: 'admin@lueurs.com',
      password: 'hashed_password_here', // In real app, use bcrypt
      role: 'ADMIN',
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'Jane Doe',
      email: 'customer@example.com',
      password: 'hashed_password_here',
      role: 'CUSTOMER',
    },
  });

  console.log('Users seeded.');

  // 4. Create Dummy Reviews
  await prisma.review.upsert({
    where: {
      userId_productId: {
        userId: customerUser.id,
        productId: noirIntense.id,
      }
    },
    update: {},
    create: {
      userId: customerUser.id,
      productId: noirIntense.id,
      rating: 5,
      longevity: 5,
      sillage: 4,
      comment: 'Absolutely stunning. The oud is perfectly balanced and it lasts forever on my skin.',
    }
  });

  console.log('Reviews seeded.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
