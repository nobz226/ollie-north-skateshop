# Ollie North Skateshop E-Commerce Platform

A full-stack, modern e-commerce platform for skateboarding equipment and apparel. Built with Next.js 15, React 19, Convex, and Clerk authentication, this platform provides a complete shopping experience with advanced filtering, real-time cart management, guest checkout, a wishlist, and a fully-featured admin CMS.

---

## 🧑‍💻 Demo

- **Live preview:** [Add your deployment URL here]
- **Local setup:** See [Getting Started](#getting-started) below.

---

## ⚡ Features

- **Product Search & Filter** — Hierarchical filters (category → subcategory → product type → size → price range), URL-driven state, cascading options
- **Shopping Cart** — Add, update, remove items; real-time header badge; 8% tax + free shipping calculation
- **Guest Checkout** — Full cart and checkout flow without an account (localStorage-based); see [GUEST_CHECKOUT.md](./GUEST_CHECKOUT.md)
- **Authenticated Checkout** — Convex-backed cart with real-time reactive updates across tabs/devices
- **Wishlist** — Save favourite products (authenticated users)
- **User Authentication** — Clerk-powered sign-up/sign-in with automatic Convex user sync
- **User Profile** — Account info, cart summary, order history (placeholder), member benefits
- **Admin CMS** — Separate admin panel at `/admin` with product CRUD, category management, and order history
- **150+ Seeded Products** — Realistic skateboarding catalog with Unsplash images
- **Responsive UI** — Tailwind CSS v4 with adaptive layouts and toast notifications

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** — React framework with App Router
- **React 19** — UI library
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Utility-first CSS framework

### Backend
- **Convex** — Real-time serverless database and backend
- **Clerk** — Authentication and user management

### Additional Tools
- **clsx** — Conditional className utility
- **tailwind-merge** — Merge Tailwind classes without conflicts

---

## 📁 Project Structure

```
ollie-north-skateshop/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── admin/             # Admin CMS (login + dashboard)
│   │   ├── apparel/           # Apparel category page
│   │   ├── boards/            # Boards category page
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout page (guest + authenticated)
│   │   ├── hardware/          # Hardware category page
│   │   ├── products/          # Products listing and detail pages
│   │   │   ├── [id]/         # Dynamic product detail page
│   │   │   └── page.tsx      # All products with filtering
│   │   ├── profile/           # User profile page
│   │   ├── sign-in/          # Clerk sign-in page
│   │   ├── sign-up/          # Clerk sign-up page
│   │   ├── wishlist/          # Wishlist page (authenticated)
│   │   ├── Header.tsx         # Site header component
│   │   ├── Footer.tsx         # Site footer component
│   │   ├── Providers.tsx      # Convex + Clerk provider wrapper + SyncUser
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable React components
│   │   ├── ConvexClientProvider.tsx  # Convex client setup
│   │   ├── ProductCard.tsx    # Product display card
│   │   └── SyncUser.tsx       # Clerk to Convex user sync
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAdminAuth.ts    # Admin session management hook
│   │   ├── useConvexUser.ts   # Hook to get Convex user
│   │   └── useGuestCart.ts    # localStorage cart for guests
│   ├── lib/                   # Utility functions
│   │   └── utils.ts           # Helper functions (cn)
│   └── middleware.ts          # Clerk auth middleware
├── convex/                    # Convex backend (see convex/README.md)
│   ├── _generated/           # Auto-generated Convex types
│   ├── addUser.ts            # User creation mutation
│   ├── admin.ts              # Admin authentication (login, session)
│   ├── adminOrders.ts        # Order history queries for admin
│   ├── adminProducts.ts      # Product CRUD mutations for admin
│   ├── cart.ts               # Cart queries and mutations
│   ├── fileStorage.ts        # File/image storage helpers
│   ├── orders.ts             # Customer order operations
│   ├── products.ts           # Product queries
│   ├── schema.ts             # Database schema
│   ├── seedProducts.ts       # Product seeding script
│   ├── userProfile.ts        # User profile queries/mutations
│   ├── users.ts              # User queries
│   └── wishlist.ts           # Wishlist queries and mutations
├── docs/                      # Additional documentation
│   └── ADDRESS_VALIDATION.md
├── public/                    # Static assets
└── package.json              # Dependencies
```

---

## 🗄️ Database Schema

### Users Table
Stores user information synced from Clerk authentication.

```typescript
users: defineTable({
  clerkUserId: v.string(),
})
.index("by_clerk_id", ["clerkUserId"])
```

**Fields:**
- `clerkUserId` - Unique identifier from Clerk (indexed)

### Products Table
Contains all product information with hierarchical categorization.

```typescript
products: defineTable({
  name: v.string(),
  description: v.string(),
  price: v.number(),
  imageUrl: v.string(),
  category: v.string(),
  subcategory: v.string(),
  productType: v.string(),
  size: v.optional(v.string()),
  inStock: v.boolean(),
  featured: v.boolean(),
  createdAt: v.number(),
})
.index("by_name", ["name"])
.index("by_category", ["category"])
.index("by_subcategory", ["subcategory"])
.index("by_product_type", ["productType"])
```

**Fields:**
- `name` - Product name
- `description` - Product description
- `price` - Price in cents (e.g., 4999 = $49.99)
- `imageUrl` - Product image URL
- `category` - Top-level category (Boards, Hardware, Apparel)
- `subcategory` - Secondary category (Skateboards, T-Shirts, etc.)
- `productType` - Specific product type (Decks, Trucks, Wheels)
- `size` - Optional size specification (7.5", M, 29, etc.)
- `inStock` - Availability status
- `featured` - Featured on homepage flag
- `createdAt` - Timestamp of creation

### Cart Items Table
Manages shopping cart items for each user.

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

**Fields:**
- `userId` - Reference to user
- `productId` - Reference to product
- `quantity` - Number of items
- `addedAt` - Timestamp when added to cart

## 🗂️ Product Categorization Hierarchy

### Categories
1. **Boards** — Skateboarding decks and complete setups
2. **Hardware** — Components and accessories
3. **Apparel** — Clothing and wearables

### Subcategories by Category

**Boards:**
- Skateboards
- Longboards
- Pennyboards

**Hardware:**
- Trucks
- Wheels
- Bearings
- Griptape
- Bolts

**Apparel:**
- T-Shirts
- Hoodies
- Hats
- Accessories

### Product Types
Each subcategory contains specific product types:
- **Skateboards**: Decks, Complete Skateboards
- **Longboards**: Longboard Decks, Complete Longboards
- **Trucks**: Standard Trucks, Longboard Trucks
- **Wheels**: Skateboard Wheels, Longboard Wheels
- And more...

---

## 🔑 Authentication

- Powered by [Clerk](https://clerk.com) for secure sign-up/sign-in
- Middleware (`src/middleware.ts`) protects all routes except `/sign-in`, `/sign-up`, and `/admin/*`
- `<SyncUser />` component (in `Providers.tsx`) automatically syncs Clerk users to the Convex `users` table on every sign-in
- Use the `useConvexUser()` hook to access the Convex user record in components

---

## 🛒 Shopping Cart: Guest & Authenticated Flows

Both guest and authenticated users can add products to a cart and proceed to checkout. The two flows use different storage mechanisms:

| Scenario | Storage | Persistence |
|---|---|---|
| **Guest user** | `localStorage` via `useGuestCart` hook | Browser-only; lost if cache is cleared |
| **Authenticated user** | Convex `cartItems` table | Cross-device, real-time reactive |

- **Guest cart**: No sign-in required. Cart badge and cart page work seamlessly. Checkout collects shipping/payment info (demo only, no real payment processing).
- **Authenticated cart**: Real-time updates via Convex subscriptions. Cart data persists across devices.
- **Cart migration**: Guest cart does **not** automatically transfer on sign-in (planned enhancement).

See [GUEST_CHECKOUT.md](./GUEST_CHECKOUT.md) for complete technical details, data flow diagram, and known limitations.

---

## 🛡️ Admin CMS

An admin panel is available at `/admin` for shop management. It uses a **separate** authentication system from Clerk (custom Convex `adminUsers` table).

**Admin Features:**
- **Products** — Create, edit, delete products; searchable table with real-time updates
- **Categories & Types** — Auto-generated from existing products; add new types via product form dropdowns
- **Order History** — View all orders with user details, revenue stats, and per-user filtering

**Admin Login:**
- Navigate to `/admin` — automatically redirects to login if not authenticated
- Default credentials set during initial setup (see [Getting Started](#-getting-started))
- Sessions managed via localStorage with a 24-hour timeout

---

## ❤️ Wishlist

Authenticated users can save products to a wishlist at `/wishlist`. Wishlist data is stored in Convex and queries/mutations live in `convex/wishlist.ts`.

---

## 🔧 Core Features

### 1. Authentication System
- Powered by Clerk for secure authentication
- Protected routes via middleware
- Public routes: `/sign-in`, `/sign-up`, `/admin/*`
- All other routes require authentication
- Automatic user sync from Clerk to Convex database

### 2. Product Management

**Seeded Products:**
- 150+ products across all categories
- Realistic pricing and descriptions
- Product images from Unsplash
- Various sizes and configurations

**Product Queries:**
- List all products
- Get product by ID
- Filter by category
- Filter by subcategory
- Get featured products (homepage)

### 3. Advanced Product Filtering

The `/products` page provides comprehensive filtering:

**Search:**
- Text search across product names and descriptions
- Case-insensitive matching

**Category Filters:**
- Top-level category selection
- Cascading subcategory options
- Product type filtering
- Size filtering (when applicable)

**Price Filtering:**
- Range slider from $0 to $200
- Real-time price updates

**Filter Behavior:**
- Filters cascade (selecting category updates subcategory options)
- URL parameter support (e.g., `?subcategory=skateboards`)
- Reset all filters button
- Active filters indication

### 4. Pagination
- 12 products per page
- Page navigation controls (Previous/Next)
- Direct page number selection
- Automatic reset to page 1 when filters change
- Results counter showing current range

### 5. Shopping Cart

**Features:**
- Add products to cart with single click
- Update quantities with +/- buttons
- Remove individual items
- Clear entire cart
- Real-time cart updates
- Cart badge in header showing item count

**Cart Calculations:**
- Subtotal calculation
- 8% tax calculation
- Free shipping
- Total with tax

**Cart Operations:**
- `addToCart` - Add product or increment quantity if already in cart
- `updateQuantity` - Change item quantity
- `removeFromCart` - Delete item from cart
- `clearCart` - Empty entire cart
- `getUserCart` - Get cart items with full product details

### 6. User Profile
Located at `/profile`, displays:
- User account information
- Current cart summary
- Order history section (placeholder)
- Member benefits
- Account settings

### 7. Wishlist
Located at `/wishlist`, authenticated users can:
- Save products for later
- View and manage saved items
- Add wishlist items to cart

---

## 🌐 API Reference

### Convex Queries

**Products:**
```typescript
products.list()
// Returns: Array of all products

products.getById({ productId: Id<"products"> })
// Returns: Single product or null

products.getByCategory({ category: string })
// Returns: Array of products in category

products.getBySubcategory({ subcategory: string })
// Returns: Array of products in subcategory

products.getFeatured()
// Returns: Array of featured products
```

**Cart:**
```typescript
cart.getUserCart({ userId: Id<"users"> })
// Returns: Array of cart items with product details
```

**Users:**
```typescript
users.getByClerkId({ clerkUserId: string })
// Returns: User record or null
```

### Convex Mutations

**User Management:**
```typescript
addUser.default({ clerkUserId: string, email: string })
// Creates or updates user in Convex
```

**Cart Management:**
```typescript
cart.addToCart({ 
  userId: Id<"users">, 
  productId: Id<"products">, 
  quantity: number 
})
// Adds product to cart or increments quantity

cart.updateQuantity({ 
  itemId: Id<"cartItems">, 
  quantity: number 
})
// Updates cart item quantity

cart.removeFromCart({ itemId: Id<"cartItems"> })
// Removes item from cart

cart.clearCart({ userId: Id<"users"> })
// Removes all items from user's cart
```

**Product Seeding:**
```typescript
seedProducts.seed()
// Populates database with 150+ products
// Run once during initial setup
```

## 📍 Page Routes

### Public Routes
- `/sign-in` — User sign-in page
- `/sign-up` — User registration page
- `/admin` — Admin CMS (redirects to login if not authenticated)

### Protected Routes
- `/` — Homepage with hero, categories, and featured products
- `/products` — All products with advanced filtering and pagination
- `/products/[id]` — Individual product detail page
- `/boards` — Boards category page
- `/hardware` — Hardware category page
- `/apparel` — Apparel category page
- `/cart` — Shopping cart page (guest and authenticated)
- `/checkout` — Checkout page (guest and authenticated)
- `/profile` — User profile and account settings
- `/wishlist` — Saved products (authenticated only)
- `/about` — About page

---

## 🪝 Custom Hooks

### useConvexUser
Hook to retrieve the Convex user record for the currently authenticated Clerk user. Returns an object with `convexUser` (the Convex user record or `undefined`) and `isLoading` (boolean).

```typescript
const { convexUser, isLoading } = useConvexUser();
// convexUser._id is used for all Convex cart/profile mutations
```

### useGuestCart
Hook for managing a localStorage-based cart for non-authenticated (guest) users.

```typescript
const { guestCart, addToCart, updateQuantity, removeFromCart, clearCart, isLoaded } = useGuestCart();
```

### useAdminAuth
Hook for managing the admin session (separate from Clerk). Reads/writes admin session state in localStorage with a 24-hour timeout.

---

## 🧩 Components

### Header
- Site navigation with category links
- Cart icon with real-time item count badge (guest + authenticated)
- User menu with sign-out option
- Responsive design

### Footer
- Site links (Shop, About, Contact)
- Social media links (placeholder)
- Contact information
- Copyright notice

### ProductCard
Reusable product display component.

**Props:**
- `product` — Product object with all fields

**Features:**
- Product image
- Name and description
- Price display (formatted from cents)
- Add to Cart button (supports guest and authenticated users)
- Click to view product details
- Toast notifications on add to cart

### SyncUser
Client component that syncs Clerk authenticated users to Convex database.

**Functionality:**
- Runs on mount when user is signed in
- Creates user record if it doesn't exist
- Handles errors silently (logs to console)

---

## 🌍 Environment Variables

Required environment variables (create `.env.local`):

```env
# Convex
CONVEX_DEPLOYMENT=your-deployment-url
NEXT_PUBLIC_CONVEX_URL=your-convex-url

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Convex account
- Clerk account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ollie-north-skateshop
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. Initialize Convex:
```bash
npx convex dev
```

5. Seed the database:
    - Open the [Convex dashboard](https://dashboard.convex.dev)
    - Navigate to **Functions**
    - Run the `seedProducts:seed` mutation once
    - Verify 150+ products are created

6. Create the default admin user:
    - In the Convex dashboard, run the `admin:createAdminUser` mutation with:
      ```json
      { "username": "Nobz", "password": "LETmeinnow36$" }
      ```
    - Change the credentials for your own deployment

7. Start the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000)

---

## 🔄 Development Workflow

### Running Locally
```bash
# Terminal 1: Next.js dev server (required)
npm run dev

# Terminal 2: Convex backend (required — all DB operations fail without this)
npx convex dev
```

> ⚠️ **Both processes must be running simultaneously** for the app to work correctly.

### Database Seeding
To populate the database with products:

1. Open [Convex dashboard](https://dashboard.convex.dev)
2. Navigate to Functions
3. Run `seedProducts:seed` mutation
4. Verify 150+ products created

### Adding New Products
Modify `convex/seedProducts.ts` and add products to the respective category arrays, then re-run the seed function.

---

## ⚠️ Known Issues and Limitations

### Current Implementation Issues

1. **useMemo Misuse in products/page.tsx**
   - Currently using `useMemo` for side effects (setting page state)
   - Should use `useEffect` instead
   - Fix needed:
   ```typescript
   // Change from useMemo to useEffect
   useEffect(() => {
     setCurrentPage(1);
   }, [searchQuery, selectedCategory, selectedSubcategory, selectedProductType, selectedSize, priceRange]);
   ```

2. **Missing Type Definitions**
   - Some mutation parameters lack explicit TypeScript types
   - Should add proper type annotations for better IDE support

3. **No Error Boundaries**
   - Application lacks error boundaries for graceful error handling
   - Should wrap main sections in error boundary components

### Feature Gaps

1. **Checkout/Payment System**
   - Demo checkout exists but no real payment processing
   - No integration with Stripe, PayPal, or other payment providers

2. **Order Management**
   - No order history tracking for customers
   - No order confirmation emails
   - Orders table exists in schema but customer order creation is not yet wired up

3. **Product Stock Management**
   - `inStock` field exists but not enforced at cart/checkout time
   - No inventory tracking or low-stock warnings

4. **Product Reviews**
   - No rating system or user reviews

5. **Wishlist** *(partially implemented)*
   - Wishlist hook and route exist; full UI and edge-case handling ongoing

6. **Limited Search**
   - Basic text search only
   - No fuzzy matching, suggestions, or search history

7. **Mobile Navigation**
   - No hamburger menu for mobile
   - Navigation may overflow on small screens

---

## 🛠️ Recommended Improvements

### Short-term Fixes
1. Replace `useMemo` with `useEffect` for page reset logic in `src/app/products/page.tsx`
2. Add TypeScript types for all mutation parameters
3. Implement error boundaries around major sections
4. Add stock checking before adding to cart
5. Implement proper loading states for all async operations

### Feature Enhancements

**Payment Integration:**
- Integrate Stripe or PayPal for real checkout
- Add order confirmation page and receipt emails

**Order Management:**
- Wire up customer-facing order creation via `convex/orders.ts`
- Implement order history page and tracking

**User Experience:**
- Add product reviews and ratings system
- Add product quick-view modal
- Improve mobile navigation with hamburger menu
- Add product image gallery/carousel

**Search & Discovery:**
- Implement fuzzy search with relevance scoring
- Add search autocomplete/suggestions
- Create recently viewed products section

**Performance:**
- Debounce search input to reduce queries
- Optimize image loading with `next/image`
- Add client-side caching for filter results

**Admin Enhancements:**
- Add inventory management system
- Implement sales analytics
- Build customer management tools

### Performance Optimizations

1. **Debounce Search Input**
   ```typescript
   const [debouncedSearch] = useDebounce(searchQuery, 300);
   ```

2. **Image Optimization**
   - Use Next.js `<Image>` component consistently
   - Add blur placeholders for perceived performance

3. **Virtual Scrolling**
   - For product lists exceeding 50+ items

4. **Caching Strategy**
   - Cache filter results on client side
   - Add stale-while-revalidate patterns

### Security Considerations

**Current Security:**
- Clerk middleware protects all customer routes
- Admin routes use separate custom auth (not Clerk)
- Convex validates all mutations server-side
- User IDs properly isolated per user

**Recommendations:**
1. Add rate limiting for cart operations
2. Validate all price calculations server-side
3. Add input sanitization for user-generated content
4. Use a proper password hashing library (e.g. `bcrypt`) for admin credentials in production

---

## 🔀 Data Flow Architecture

```
User Authentication (Clerk)
        ↓
   Middleware Check
        ↓
   SyncUser Component
        ↓
   Convex Database
        ↓
    ┌───┴───┐
    ↓       ↓
Products   Cart Items
    ↓       ↓
React Components (Queries)
    ↓
User Interactions
    ↓
Convex Mutations
    ↓
Real-time Updates
```

---

## 🤝 Contributing

When contributing to this project:

1. Follow the existing code structure and Convex patterns
2. Use TypeScript for type safety throughout
3. Write descriptive commit messages
4. Test all cart operations for both guest and authenticated flows
5. Ensure Clerk authentication works correctly
6. Verify Convex queries return expected data
7. Check mobile responsiveness

---

## 📄 License

[Add your license here]

---

## 📚 Further Reading & Support

- [Convex documentation](https://docs.convex.dev)
- [Clerk documentation](https://clerk.com/docs)
- [Next.js documentation](https://nextjs.org/docs)
- For questions, check existing issues in the repository
