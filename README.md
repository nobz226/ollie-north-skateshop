# Mojo Coffee E-Commerce Platform

A full-stack e-commerce application built with Next.js 15, React 19, Convex, and Clerk authentication. This platform provides a complete shopping experience for coffee products with advanced filtering, real-time cart management, and user authentication.

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework

### Backend
- **Convex** - Real-time serverless database and backend
- **Clerk** - Authentication and user management

### Additional Tools
- **clsx** - Conditional className utility
- **tailwind-merge** - Merge Tailwind classes without conflicts

## Project Structure

```
mojo-coffee/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── apparel/           # Apparel category page
│   │   ├── boards/            # Boards category page
│   │   ├── cart/              # Shopping cart page
│   │   ├── hardware/          # Hardware category page
│   │   ├── products/          # Products listing and detail pages
│   │   │   ├── [id]/         # Dynamic product detail page
│   │   │   └── page.tsx      # All products with filtering
│   │   ├── profile/           # User profile page
│   │   ├── sign-in/          # Clerk sign-in page
│   │   ├── sign-up/          # Clerk sign-up page
│   │   ├── Header.tsx         # Site header component
│   │   ├── Footer.tsx         # Site footer component
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable React components
│   │   ├── ConvexClientProvider.tsx  # Convex client setup
│   │   ├── ProductCard.tsx    # Product display card
│   │   └── SyncUser.tsx       # Clerk to Convex user sync
│   ├── hooks/                 # Custom React hooks
│   │   └── useConvexUser.ts   # Hook to get Convex user
│   ├── lib/                   # Utility functions
│   │   └── utils.ts           # Helper functions (cn)
│   └── middleware.ts          # Clerk auth middleware
├── convex/                    # Convex backend
│   ├── _generated/           # Auto-generated Convex types
│   ├── addUser.ts            # User creation mutation
│   ├── cart.ts               # Cart queries and mutations
│   ├── products.ts           # Product queries
│   ├── schema.ts             # Database schema
│   ├── seedProducts.ts       # Product seeding script
│   ├── tsconfig.json         # Convex TypeScript config
│   └── users.ts              # User queries
├── public/                    # Static assets
└── package.json              # Dependencies
```

## Database Schema

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

## Product Categorization Hierarchy

### Categories
1. **Boards** - Skateboarding decks and complete setups
2. **Hardware** - Components and accessories
3. **Apparel** - Clothing and wearables

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

## Core Features

### 1. Authentication System
- Powered by Clerk for secure authentication
- Protected routes via middleware
- Public routes: `/sign-in`, `/sign-up`
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

## API Reference

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

## Page Routes

### Public Routes
- `/sign-in` - User sign in page
- `/sign-up` - User registration page

### Protected Routes
- `/` - Homepage with hero, categories, and featured products
- `/products` - All products with advanced filtering and pagination
- `/products/[id]` - Individual product detail page
- `/boards` - Boards category page
- `/hardware` - Hardware category page
- `/apparel` - Apparel category page
- `/cart` - Shopping cart page
- `/profile` - User profile and account settings

## Custom Hooks

### useConvexUser
Hook to retrieve the Convex user record for the currently authenticated Clerk user.

```typescript
const convexUser = useConvexUser();
// Returns: User record from Convex or undefined
```

**Usage:**
```typescript
const convexUser = useConvexUser();
if (!convexUser) return <div>Loading...</div>;
// Use convexUser._id for cart operations
```

## Components

### Header
- Site navigation
- Category links
- Cart icon with item count badge
- User menu with sign out option
- Responsive design

### Footer
- Site links (Shop, About, Contact)
- Social media links (placeholder)
- Contact information
- Copyright notice

### ProductCard
Reusable product display component.

**Props:**
- `product` - Product object with all fields

**Features:**
- Product image
- Name and description
- Price display (formatted from cents)
- Add to Cart button
- Click to view product details
- Toast notifications on add to cart

### SyncUser
Client component that syncs Clerk authenticated users to Convex database.

**Functionality:**
- Runs on mount when user is signed in
- Creates user record if doesn't exist
- Updates existing user record if found
- Handles errors silently (logs to console)

## Environment Variables

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

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Convex account
- Clerk account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mojo-coffee
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

5. Seed the database (in a separate terminal):
```bash
# In Convex dashboard or via CLI
# Run the seedProducts.seed() mutation once
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Running Locally
```bash
# Terminal 1: Next.js dev server
npm run dev

# Terminal 2: Convex backend
npx convex dev
```

### Database Seeding
To populate the database with products:

1. Open Convex dashboard
2. Navigate to Functions
3. Run `seedProducts:seed` mutation
4. Verify 150+ products created

### Adding New Products
Modify `convex/seedProducts.ts` and add products to the respective category arrays, then re-run the seed function.

## Known Issues and Limitations

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

1. **No Checkout System**
   - Cart exists but no payment processing
   - No integration with Stripe, PayPal, or other payment providers
   - Checkout flow not implemented

2. **No Order Management**
   - No order history tracking
   - No order confirmation emails
   - No order status updates
   - Orders table not implemented in schema

3. **No Product Stock Management**
   - `inStock` field exists but not enforced
   - No inventory tracking
   - No low stock warnings
   - Can add out-of-stock items to cart

4. **No Product Reviews**
   - No rating system
   - No user reviews or testimonials
   - No review moderation

5. **No Wishlist Feature**
   - Users cannot save products for later
   - No favorites functionality

6. **Limited Search**
   - Basic text search only
   - No fuzzy matching
   - No search suggestions
   - No search history

7. **Mobile Navigation**
   - No hamburger menu for mobile
   - Navigation menu may overflow on small screens

## Recommended Improvements

### Short-term Fixes
1. Replace `useMemo` with `useEffect` for page reset logic
2. Add TypeScript types for all mutation parameters
3. Implement error boundaries around major sections
4. Add stock checking before adding to cart
5. Implement proper loading states for all async operations

### Feature Enhancements

**Payment Integration:**
- Integrate Stripe or PayPal for checkout
- Add order confirmation page
- Implement order receipt emails

**Order Management:**
- Create orders table in Convex schema
- Implement order history page
- Add order tracking functionality
- Build order status updates

**User Experience:**
- Add product reviews and ratings system
- Implement wishlist functionality
- Add product quick view modal
- Improve mobile navigation with hamburger menu
- Add product image gallery/carousel

**Search & Discovery:**
- Implement fuzzy search with relevance scoring
- Add search autocomplete/suggestions
- Create recently viewed products section
- Add related products recommendations

**Performance:**
- Debounce search input to reduce queries
- Implement virtual scrolling for large lists
- Optimize image loading with next/image
- Add client-side caching for filter results

**Admin Features:**
- Create admin dashboard for product management
- Add inventory management system
- Implement sales analytics
- Build customer management tools

### Performance Optimizations

1. **Debounce Search Input**
   ```typescript
   const [debouncedSearch] = useDebounce(searchQuery, 300);
   ```

2. **Image Optimization**
   - Use Next.js Image component consistently
   - Implement proper loading states
   - Add blur placeholders

3. **Virtual Scrolling**
   - For product lists exceeding 50+ items
   - Reduces DOM nodes and improves performance

4. **Caching Strategy**
   - Cache filter results on client side
   - Implement query result caching in Convex
   - Add stale-while-revalidate patterns

### Security Considerations

**Current Security:**
- Clerk middleware protects all routes except sign-in/sign-up
- Convex validates all mutations server-side
- User IDs properly isolated per user

**Recommendations:**
1. Add rate limiting for cart operations
2. Validate all price calculations server-side
3. Implement CSRF protection for mutations
4. Add input sanitization for user-generated content
5. Implement proper error messages without exposing system details
6. Add request logging for security auditing

## Data Flow Architecture

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

## Contributing

When contributing to this project:

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Write descriptive commit messages
4. Test all cart operations thoroughly
5. Ensure Clerk authentication works correctly
6. Verify Convex queries return expected data
7. Check mobile responsiveness

## License

[Add your license here]

## Support

For issues or questions:
- Check existing issues in the repository
- Review Convex documentation: https://docs.convex.dev
- Review Clerk documentation: https://clerk.com/docs
- Review Next.js documentation: https://nextjs.org/docs