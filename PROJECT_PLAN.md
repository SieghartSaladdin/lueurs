# Project Plan: Lueurs E-Commerce (Perfume Store)

## 1. Tech Stack & Tools
- **Frontend & Backend:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** PrimeReact (Tailwind CSS Unstyled Mode / Passthrough)
- **Database ORM:** Prisma
- **Database:** PostgreSQL / MySQL (via Prisma)
- **Payment Gateway:** Xendit
- **Shipping API:** RajaOngkir
- **Authentication:** NextAuth.js (Auth.js)
- **State Management:** Zustand / React Context (jika diperlukan)
- **Image Hosting:** Cloudinary / AWS S3 / Vercel Blob

---

## 2. Development Phases

### Phase 1: Setup & Database Design (Hari 1)
- [x] Inisialisasi Next.js & Tailwind CSS
- [x] Setup PrimeReact (Tailwind CSS Unstyled Mode / Tailwind Passthrough)
- [x] Setup Layout & UI Dasar (Main & Admin)
- [x] Setup Prisma & Koneksi Database
- [x] Membuat Schema Database Khusus Parfum (User, Product, Variant, Review, Order, dll)
- [x] Seeding Data Dummy (Produk Parfum, Notes, & Kategori)

### Phase 2: Authentication & User Management (Hari 2)
- [x] Setup NextAuth.js (Email/Password & Google OAuth)
- [x] Halaman Login & Register
- [x] Role-based Access Control (Admin vs Customer)
- [x] Halaman Profil User (Alamat, Riwayat Pesanan, Ulasan Saya)

### Phase 3: Core E-Commerce Features (Hari 3)
- [x] Menampilkan Daftar Parfum (Halaman Utama & Kategori Olfactory)
- [x] Halaman Detail Parfum (Menampilkan Piramida Aroma: Top, Heart, Base Notes)
- [x] Pemilihan Varian Ukuran Botol (Discovery Set 5ml, 50ml, 100ml)
- [x] Implementasi Shopping Cart berbasis Varian (State Management / Database)
- [x] Fitur Pencarian & Filter (Berdasarkan Notes, Kategori, Harga)
- [x] Sistem Ulasan & Rating (Longevity, Sillage, Overall)

### Phase 4: Checkout & Integrasi API (Hari 4)
- [x] Halaman Checkout
- [x] Integrasi RajaOngkir (Hitung Ongkos Kirim berdasarkan berat Varian Botol)
- [x] Integrasi Xendit (Invoice API untuk Pembayaran)
- [x] Webhook Xendit (Update status pesanan otomatis setelah dibayar)

### Phase 5: Admin Dashboard (Hari 5)
- [x] CRUD Produk Parfum & Varian Ukuran
- [x] Manajemen Kategori (Olfactory Families) & Notes
- [x] Manajemen Pesanan (Update status pengiriman, input resi)
- [x] Moderasi Ulasan Pelanggan
- [x] Dashboard Analytics (Penjualan per Varian/Ukuran)

### Phase 6: Testing & Deployment (Hari 6)
- [-] Testing alur checkout dari awal sampai akhir (Dalam Proses)
- [ ] Optimasi SEO & Performa (Image optimization, Meta tags)
- [ ] Deployment ke Vercel / VPS

---

## 3. Database Schema (Prisma)

Berikut adalah rancangan struktur database yang disesuaikan khusus untuk penjualan parfum:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // atau mysql
  url      = env("DATABASE_URL")
}

// --- USER MANAGEMENT ---
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  password      String?
  role          Role      @default(CUSTOMER)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  addresses     Address[]
  orders        Order[]
  cartItems     CartItem[]
  reviews       Review[]
}

enum Role {
  ADMIN
  CUSTOMER
}

model Address {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  street      String
  cityId      String   // ID Kota dari RajaOngkir
  cityName    String
  provinceId  String   // ID Provinsi dari RajaOngkir
  provinceName String
  postalCode  String
  isDefault   Boolean  @default(false)
}

// --- PRODUCT MANAGEMENT (PERFUME SPECIFIC) ---
model Category {
  id          String    @id @default(cuid())
  name        String    @unique // e.g., Floral, Woody, Oriental, Fresh
  slug        String    @unique
  products    Product[]
}

model Product {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String    @db.Text
  perfumeType String    // e.g., Eau de Parfum, Extrait de Parfum, Cologne
  
  // Olfactory Pyramid (Piramida Aroma)
  topNotes    String    // e.g., "Bergamot, Lemon, Pink Pepper"
  middleNotes String    // e.g., "Rose, Jasmine, Ylang-Ylang"
  baseNotes   String    // e.g., "Vanilla, Musk, Sandalwood"
  
  images      String[]  // Array URL gambar
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  variants    ProductVariant[]
  reviews     Review[]
}

// Tabel Varian untuk Ukuran Botol (5ml, 50ml, 100ml)
model ProductVariant {
  id          String    @id @default(cuid())
  productId   String
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  volume      Int       // Volume dalam ml (e.g., 5, 50, 100)
  price       Decimal   @db.Decimal(10, 2)
  stock       Int       @default(0)
  weight      Int       // Berat kotor dalam gram (Botol + Cairan + Packaging) untuk RajaOngkir
  sku         String?   @unique
  
  cartItems   CartItem[]
  orderItems  OrderItem[]
}

// --- REVIEWS & RATINGS ---
model Review {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId   String
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  rating      Int       // 1-5 stars
  longevity   Int?      // Rating spesifik ketahanan (1-5)
  sillage     Int?      // Rating spesifik jejak aroma (1-5)
  comment     String?   @db.Text
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([userId, productId]) // Satu user hanya bisa review satu produk 1 kali
}

// --- SHOPPING CART ---
model CartItem {
  id        String         @id @default(cuid())
  userId    String
  user      User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
  quantity  Int            @default(1)

  @@unique([userId, variantId])
}

// --- ORDER & PAYMENT ---
model Order {
  id              String      @id @default(cuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  status          OrderStatus @default(PENDING)
  
  // Pengiriman
  shippingCost    Decimal     @db.Decimal(10, 2)
  courier         String      // JNE, POS, TIKI
  trackingNumber  String?
  shippingAddress Json        // Simpan snapshot alamat saat checkout

  // Pembayaran
  totalAmount     Decimal     @db.Decimal(10, 2) // Subtotal + Ongkir
  paymentMethod   String?
  paymentStatus   PaymentStatus @default(UNPAID)
  xenditInvoiceId String?     @unique // ID Invoice untuk Xendit
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  items           OrderItem[]
}

model OrderItem {
  id        String         @id @default(cuid())
  orderId   String
  order     Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variantId String
  variant   ProductVariant @relation(fields: [variantId], references: [id])
  quantity  Int
  price     Decimal        @db.Decimal(10, 2) // Harga saat dibeli (snapshot)
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  UNPAID
  PAID
  FAILED
  EXPIRED
}
```

## 4. Langkah Selanjutnya (Action Items)
1. **Setup Prisma:** Jalankan `npm install prisma --save-dev` dan `npx prisma init`.
2. **Siapkan Database:** Buat database di lokal (PostgreSQL/MySQL) atau gunakan layanan cloud seperti Supabase/Neon.
3. **Terapkan Schema:** Salin schema di atas ke `prisma/schema.prisma` lalu jalankan `npx prisma db push`.
4. **Buat API Routes:** Mulai buat endpoint di `app/api/products/route.ts` untuk mengambil data produk beserta variannya.

