# Ollie North Skateshop - AI Agent Instructions

## Architecture Overview

This is a **Next.js 15 (App Router) + Convex + Clerk** e-commerce application for skateboarding products. The key architectural pattern is:
- **Frontend**: Next.js client components in `src/app/` using React 19 (no server components with Convex)
- **Backend**: Convex serverless backend in `convex/` with real-time queries/mutations
- **Auth**: Dual authentication system:
  - Customer auth via Clerk (synced to Convex `users` table)
  - Admin auth via custom Convex system (separate `adminUsers` table)
- **State**: Convex React hooks provide real-time reactive data (no Redux/Zustand needed)
- **Styling**: Tailwind CSS v4 with `cn()` utility ([src/lib/utils.ts](../src/lib/utils.ts)) for conditional classes

## Critical Workflows

### Development Setup
Always run **two terminals simultaneously**:
```bash
# Terminal 1: Next.js with Turbopack
npm run dev

# Terminal 2: Convex backend (required for all database operations)
npx convex dev
```
**⚠️ CRITICAL**: Convex dev must be running or all database queries/mutations will fail silently.

### First-Time Setup
1. Install dependencies: `npm install`
2. Create `.env.local` with Clerk and Convex credentials (see Environment Variables section)
3. Start Convex: `npx convex dev` (creates deployment if needed)
4. Seed products: Run `seedProducts:seed` mutation via Convex dashboard
5. Create admin user: Run `admin:createAdminUser` mutation with `{ username: "Nobz", password: "LETmeinnow36$" }`

## Key Patterns & Conventions

### 1. Customer Authentication Flow
- Clerk middleware protects routes except `/sign-in`, `/sign-up`, and `/admin/*` (see [src/middleware.ts](../src/middleware.ts))
- `<SyncUser />` component in [src/app/Providers.tsx](../src/app/Providers.tsx) automatically syncs Clerk users to Convex `users` table
- Always use `useConvexUser()` hook to get the Convex user ID for cart/profile operations:
  ```typescript
  const { convexUser, isLoading } = useConvexUser();
  // Use convexUser._id for userId in mutations
  ```

### 2. Admin Authentication Flow
- Admin routes use custom `useAdminAuth()` hook from [src/hooks/useAdminAuth.ts](../src/hooks/useAdminAuth.ts)
- Admin layout in [src/app/admin/layout.tsx](../src/app/admin/layout.tsx) enforces authentication
- Separate from Clerk - uses Convex `adminUsers` table with password hashing
- Session management via localStorage with 24-hour timeout

### 3. Convex Data Layer
- **Query Pattern**: Use Convex React hooks for real-time data
  ```typescript
  const products = useQuery(api.products.list); // Auto-updates on changes
  ```
- **Mutation Pattern**: Use `useMutation` for writes
  ```typescript
  const addToCart = useMutation(api.cart.addToCart);
  await addToCart({ userId: convexUser._id, productId });
  ```
- **ID Types**: Convex uses typed IDs like `Id<"users">`, `Id<"products">` - never use strings
- **Conditional Queries**: Use `"skip"` to disable queries when dependencies aren't ready:
  ```typescript
  const product = useQuery(api.products.getById, productId ? { id: productId } : "skip");
  ```

### 4. Product Categorization
Products have a **3-level hierarchy** (see [convex/schema.ts](../convex/schema.ts)):
- `category`: Top-level (Boards, Hardware, Apparel)
- `subcategory`: Secondary (Skateboards, T-Shirts, Trucks, etc.)
- `productType`: Specific (Decks, Complete Skateboards, Wheels, etc.)

### 5. Pricing Convention
**All prices stored in CENTS** in database. Always divide by 100 for display:
```typescript
const displayPrice = (product.price / 100).toFixed(2); // $49.99
```

### 6. Cart Operations
Cart uses a **composite index** `by_user_and_product` for efficient lookups:
- `addToCart`: Auto-increments quantity if item exists, else creates new cart item
- `updateQuantity`: Deletes item if quantity <= 0
- `getUserCart`: Joins cart items with product details via `Promise.all`

### 7. Admin CMS Operations
Admin panel at `/admin` provides three main tabs:

**Products Management**:
- View all products in searchable table
- Create new products with `ProductForm` component
- Edit existing products (fetches via `api.products.getById`)
- Delete products with confirmation
- Real-time updates via Convex subscriptions

**Categories & Types**:
- Auto-generated from existing products
- Add new categories/subcategories/types via "+ Add New" in product form dropdowns
- No manual category management needed

**Order History**:
- View all orders with user details
- Filter by specific user
- Display order stats (total revenue, average order value)
- Orders sorted by most recent first

## Common Patterns

### Client Component Pattern
All interactive pages are `"use client"` components that use Convex hooks:
```typescript
"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
```
**Why no server components?** Convex React hooks require client-side reactivity. Next.js server components cannot subscribe to real-time Convex data.

### Filter Cascading
See [src/app/products/page.tsx](../src/app/products/page.tsx#L73-L91) for cascading filter pattern:
- Category selection filters subcategory options
- Subcategory filters productType options
- ProductType filters size options

### URL State Management
Use Next.js `useSearchParams()` for filter state in URLs:
```typescript
const subcategory = searchParams.get("subcategory") || "";
// Enables direct links like /products?subcategory=skateboards
```

### Modal Pattern
Admin uses modal pattern for forms (see `ProductForm` component):
- Fixed overlay with centered content
- Close on cancel or successful submission
- Form data validation before Convex mutation

### Price Conversion Pattern
Always convert cents ↔ dollars at the UI boundary:
```typescript
// Display: cents to dollars
const displayPrice = (product.price / 100).toFixed(2); // $49.99

// Submission: dollars to cents
const priceInCents = Math.round(parseFloat(formData.price) * 100);
```

## Known Issues to Fix

### ⚠️ useMemo Side Effect Anti-Pattern
**IMPORTANT**: [src/app/products/page.tsx](../src/app/products/page.tsx#L26-L28) incorrectly uses `useMemo` for side effects:
```typescript
// WRONG - useMemo should not have side effects
useMemo(() => {
  setCurrentPage(1);
}, [searchQuery, selectedCategory, ...]);

// CORRECT - use useEffect instead
useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, selectedCategory, ...]);
```
Fix this when modifying the products page.

## File Structure Conventions

- **`src/app/`**: Next.js routes + shared layout components (Header, Footer)
  - **`src/app/admin/`**: Admin CMS routes (login, dashboard)
- **`src/components/`**: Reusable React components (ProductCard, SyncUser, ProductForm)
- **`src/hooks/`**: Custom React hooks (useConvexUser, useAdminAuth)
- **`src/lib/utils.ts`**: Contains `cn()` utility for merging Tailwind classes
- **`convex/`**: All backend logic (queries, mutations, schema)
  - **`convex/admin.ts`**: Admin authentication
  - **`convex/adminProducts.ts`**: Product CRUD operations
  - **`convex/adminOrders.ts`**: Order history queries

## Environment Variables

Required for local development (create `.env.local`):
```env
NEXT_PUBLIC_CONVEX_URL=          # From Convex dashboard
CONVEX_DEPLOYMENT=               # From Convex dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## Testing Patterns

### Testing Cart Functionality
1. Ensure user is authenticated (Clerk)
2. Wait for `convexUser` to exist before calling mutations
3. Test quantity increment behavior (add same product twice)
4. Verify real-time updates (cart count badge in Header)

### Testing Admin System
1. Navigate to `/admin` (auto-redirects to login if not authenticated)
2. Login with username: `Nobz`, password: `LETmeinnow36$`
3. Test product CRUD operations
4. Verify real-time updates across tabs
5. Test session timeout (24 hours)

## Integration Points

- **Clerk ↔ Convex**: Synced via `addUser.default` mutation in [convex/addUser.ts](../convex/addUser.ts)
- **Next.js ↔ Convex**: Wrapped in `ConvexProvider` in [src/app/Providers.tsx](../src/app/Providers.tsx)
- **Admin Auth ↔ Convex**: Stored in `adminUsers` table, verified via `admin:verifyAdminLogin`
- **Image URLs**: Currently using Unsplash placeholder URLs (see seedProducts.ts)

## Limitations & Missing Features

Per README "Known Issues" section:
- No checkout/payment system (cart exists but no Stripe integration)
- Orders table exists but no customer order creation flow
- `inStock` field not enforced (can add out-of-stock items to cart)
- Basic text search only (no fuzzy matching)
- Missing mobile hamburger menu
- Admin password hashing is basic (production should use bcrypt or similar)

## Admin-Specific Notes

- Admin session uses localStorage (client-side only)
- Admin queries/mutations in separate files from customer operations
- ProductForm component handles both create and edit modes
- Categories auto-populate from existing products (no manual CRUD)
- Order history view-only (no status updates yet)

When adding features, follow the existing Convex patterns rather than introducing new state management.
