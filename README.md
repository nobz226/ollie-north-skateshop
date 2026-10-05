# MD Plants

An online shop for carnivorous plants (Venus flytraps, pitcher plants, Nepenthes, sundews and butterworts) plus seeds and growing supplies. Built with **Next.js 15**, **React 19**, **Convex**, and **Clerk**. Features authentication, real-time cart, wishlist, Stripe checkout, and order management.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework

### Backend
- **Convex** - Real-time serverless database and backend
- **Clerk** - Authentication and user management

### Payments & Tools
- **Stripe** - Payment processing
- **Framer Motion** - Animations
- **Lucide React** - Icons

---

## 📁 Project Structure

```
md-plants/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── api/               # API routes (Stripe, address validation)
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout flow (cart → payment → success/cancel)
│   │   ├── plants/            # Category landing pages (driven by src/lib/catalog.ts)
│   │   ├── seeds/
│   │   ├── supplies/
│   │   ├── care/              # Carnivorous plant care guide
│   │   ├── products/          # Products listing with filters + product detail
│   │   ├── profile/           # User profile, orders, addresses
│   │   ├── sign-in/           # Clerk sign-in
│   │   ├── wishlist/          # User wishlist
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Site footer
│   │   ├── layout.tsx         # Root layout + metadata
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable React components
│   │   ├── ProductCard.tsx    # Product display card
│   │   ├── Breadcrumbs.tsx    # Navigation breadcrumbs
│   │   ├── Providers.tsx      # Context providers
│   │   └── SyncUser.tsx       # Clerk → Convex user sync
│   ├── hooks/                 # Custom React hooks
│   │   ├── useConvexUser.ts   # Get Convex user for Clerk auth
│   │   └── useGuestCart.ts    # localStorage cart for guests
│   ├── lib/
│   │   ├── catalog.ts         # Shop name, categories, images, care info
│   │   └── utils.ts           # Utility functions (cn)
│   └── middleware.ts          # Clerk auth middleware
├── convex/                    # Convex backend
│   ├── _generated/           # Auto-generated types
│   ├── admin.ts              # Admin authentication
│   ├── adminOrders.ts        # Admin order queries
│   ├── adminProducts.ts      # Admin product management
│   ├── cart.ts               # Cart queries & mutations
│   ├── fileStorage.ts        # File upload URLs
│   ├── orders.ts             # Order creation & queries
│   ├── products.ts           # Product queries
│   ├── schema.ts             # Database schema
│   ├── seedProducts.ts       # Sample product seeding
│   ├── tsconfig.json         # Convex TypeScript config
│   ├── userProfile.ts        # User profile (shipping/payment)
│   ├── users.ts              # User queries
│   └── wishlist.ts           # Wishlist queries & mutations
├── public/                    # Static assets
└── package.json              # Dependencies
```

---

## 🗄️ Database Schema (Convex)

### Users Table
```typescript
users: defineTable({
  clerkUserId: v.string(),
  shippingAddress: v.optional(v.object({
    fullName: v.string(),
    addressLine1: v.string(),
    addressLine2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    postalCode: v.string(),
    country: v.string(),
    phone: v.string(),
  })),
  paymentMethod: v.optional(v.object({
    cardHolderName: v.string(),
    cardLastFour: v.string(),
    cardType: v.string(),
    expiryMonth: v.string(),
    expiryYear: v.string(),
  })),
}).index("by_clerk_user_id", ["clerkUserId"])
```

### Products Table
```typescript
products: defineTable({
  name: v.string(),
  description: v.string(),
  price: v.number(),        // in cents
  imageUrl: v.string(),
  category: v.string(),     // e.g., "Category 1"
  subcategory: v.string(),  // e.g., "Subcategory A"
  productType: v.string(),  // e.g., "Type 1"
  size: v.optional(v.string()),
  inStock: v.boolean(),
  stockQuantity: v.optional(v.number()),
  featured: v.optional(v.boolean()),
  createdAt: v.number(),
})
  .index("by_category", ["category"])
  .index("by_subcategory", ["subcategory"])
  .index("by_product_type", ["productType"])
```

### Cart Items Table
```typescript
cartItems: defineTable({
  userId: v.id("users"),
  productId: v.id("products"),
  quantity: v.number(),
  addedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_and_product", ["userId", "productId"])
```

### Wishlist Items Table
```typescript
wishlistItems: defineTable({
  userId: v.id("users"),
  productId: v.id("products"),
  addedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_and_product", ["userId", "productId"])
```

### Orders Table
```typescript
orders: defineTable({
  userId: v.optional(v.id("users")),
  guestEmail: v.optional(v.string()),
  items: v.array(v.object({
    productId: v.string(),
    productName: v.string(),
    quantity: v.number(),
    price: v.number(),
  })),
  subtotal: v.number(),
  tax: v.number(),
  total: v.number(),
  status: v.string(), // "pending", "processing", "shipped", "delivered", "cancelled"
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_guest_email", ["guestEmail"])
  .index("by_status", ["status"])
  .index("by_created_at", ["createdAt"])
```

---

## ✨ Core Features

### 1. Authentication (Clerk)
- Secure sign-up/sign-in with email/password, OAuth providers
- Protected routes via middleware
- Automatic user sync from Clerk → Convex database

### 2. Product Management
- **Seeded Products**: 30+ generic template products across 3 categories
- **Product Queries**: List all, get by ID, filter by category/subcategory/type, get featured
- **Admin Functions**: Create, update, delete products via Convex dashboard

### 3. Advanced Product Filtering (`/products`)
- **Search**: Text search across names/descriptions
- **Category Filters**: URL-locked category → subcategory cascade
- **Product Type Filter**: Dropdown for specific types
- **Size Filter**: Dynamic based on selected product type
- **Price Range**: Slider ($0-$200)
- **Pagination**: 12 products/page with full navigation

### 4. Shopping Cart
- **Dual Mode**: Convex (authenticated) + localStorage (guests)
- Add/update/remove items with quantity controls
- Real-time cart badge in header
- Subtotal, 8% tax, total calculations

### 5. Wishlist
- Heart icon on product cards (authenticated users)
- Dedicated `/wishlist` page with remove/add-to-cart

### 6. Checkout Flow
- **Shipping Form**: Full address with US/Canada validation (Zippopotam.us API)
- **Payment Form**: Card details with validation
- **Stripe Checkout**: Creates session, redirects to Stripe
- **Order Creation**: On success, creates order in Convex, clears cart

### 7. User Profile (`/profile`)
- Account info & cart summary
- Order history with status tracking
- Shipping address management (with validation)
- Payment method management
- Member perks display

---

## 🛣️ Page Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, categories, featured products |
| `/products` | All products with filters & pagination |
| `/products/[id]` | Product detail page |
| `/category-1` | Category 1 subcategories |
| `/category-2` | Category 2 subcategories |
| `/category-3` | Category 3 subcategories |
| `/cart` | Shopping cart |
| `/checkout` | Multi-step checkout |
| `/checkout/success` | Order confirmation |
| `/checkout/cancel` | Cancelled checkout |
| `/profile` | User account & orders |
| `/wishlist` | Saved products |
| `/sign-in` | Authentication |
| `/about` | Template overview & features |

---

## 🔧 Customization Guide

### 1. Update Branding
- **Layout metadata** (`src/app/layout.tsx`): Site title, description
- **Header** (`src/app/Header.tsx`): Logo text, navigation links
- **Footer** (`src/app/Footer.tsx`): Contact info, social links
- **Homepage** (`src/app/page.tsx`): Hero text, category images/links

### 2. Modify Categories
- **Seed file** (`convex/seedProducts.ts`): Add your categories, subcategories, product types
- **Category pages** (`src/app/category-1/`, etc.): Update subcategory names/images
- **Products page**: Filters auto-adapt to your data

### 3. Add Products
Run the seed mutation in Convex dashboard:
```bash
# In Convex dashboard Functions tab, run:
seedProducts.seed()
```
Or add products manually via admin functions.

### 4. Configure Stripe
Set environment variables:
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_URL=http://localhost:3000
```

### 5. Styling
- **Colors**: Edit Tailwind classes (cyan-500 is primary)
- **Fonts**: Update Google Fonts in `layout.tsx`
- **Components**: Modify `ProductCard.tsx`, forms, etc.

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn
- Convex account (free tier)
- Clerk account (free tier)
- Stripe account (for payments)

### Installation

```bash
# 1. Clone and install
git clone <your-repo>
cd e-shop-template
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Add your Convex, Clerk, and Stripe keys

# 3. Initialize Convex
npx convex dev

# 4. Seed database (in Convex dashboard → Functions → seedProducts.seed)

# 5. Start development
npm run dev
```

### Environment Variables
```env
# Convex
CONVEX_DEPLOYMENT=your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_URL=http://localhost:3000
```

---

## 🛠️ Development Workflow

```bash
# Terminal 1: Next.js dev server
npm run dev

# Terminal 2: Convex backend
npx convex dev
```

### Database Operations
```bash
# View data in Convex dashboard
# Run mutations/queries in Functions tab
# Use convex CLI for migrations
npx convex run adminProducts.createProduct {...}
```

---

## 🎯 Key Implementation Details

### Dual Cart System
```typescript
// Authenticated users → Convex cart (real-time, synced)
// Guest users → localStorage (persists across sessions)
```

### Category Locking in Products Page
```typescript
// URL params `?category=X&subcategory=Y` lock filters
// User can still filter by type/size/price within locked scope
```

### Stripe Checkout Flow
```
Cart → Create Session API → Stripe Checkout → Success/Cancel URL
                              ↓
                        Webhook/Metadata → Create Order
                              ↓
                        Clear Cart
```

### Address Validation
- US ZIP codes + Canadian postal codes
- Real-time validation via Zippopotam.us API
- Mandatory validation before saving/order placement

---

## 📝 License

MIT License - Feel free to use this template for your projects.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a PR

---

## 📞 Support

- **Convex Docs**: https://docs.convex.dev
- **Clerk Docs**: https://clerk.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Stripe Docs**: https://stripe.com/docs

Built with ❤️ for the developer community.