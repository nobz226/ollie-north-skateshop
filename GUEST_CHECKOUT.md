# Guest Checkout Implementation

## Overview
This feature allows users to browse products, add items to cart, and checkout **without creating an account**. The cart data for guest users is stored in the browser's localStorage.

## Key Components

### 1. Guest Cart Hook (`src/hooks/useGuestCart.ts`)
- **Purpose**: Manages localStorage-based cart for non-authenticated users
- **Storage Key**: `guestCart`
- **Data Structure**:
  ```typescript
  interface GuestCartItem {
    productId: string;  // Convex product ID
    quantity: number;
    addedAt: number;    // Timestamp
  }
  ```
- **Methods**:
  - `addToCart(productId, quantity)` - Adds item or increments quantity
  - `updateQuantity(productId, quantity)` - Updates quantity (removes if ≤ 0)
  - `removeFromCart(productId)` - Removes item completely
  - `clearCart()` - Empties entire cart
  - `guestCart` - Current cart items array
  - `isLoaded` - Boolean indicating localStorage has loaded

### 2. Updated Components

#### ProductCard (`src/components/ProductCard.tsx`)
- Detects user authentication status via `useConvexUser()`
- **If authenticated**: Uses Convex mutation `api.cart.addToCart`
- **If guest**: Uses `useGuestCart().addToCart` for localStorage
- No redirect to sign-in required

#### Cart Page (`src/app/cart/page.tsx`)
- Displays unified cart for both guest and authenticated users
- **For guests**:
  - Fetches product details from Convex using `api.products.list`
  - Joins localStorage cart items with product data
  - Shows info banner: "You're shopping as a guest. Sign in to save your cart."
- **For authenticated users**:
  - Uses existing Convex cart query
- Both paths share same UI and checkout button

#### Header (`src/app/Header.tsx`)
- Cart badge shows count from:
  - **Guest users**: `useGuestCart().guestCart` count
  - **Authenticated users**: Convex cart query count
- Badge updates in real-time as items are added/removed

#### Product Detail Page (`src/app/products/[id]/page.tsx`)
- "Add to Cart" button works for both guest and authenticated users
- Same logic as ProductCard - branches on authentication status

### 3. Checkout Page (`src/app/checkout/page.tsx`)
**NEW PAGE** - `/checkout`

#### Features:
- Accepts both guest and authenticated users
- **Guest checkout flow**:
  1. Shows order summary with cart items
  2. Requires shipping information form (name, address, phone)
  3. Requires payment information form (demo only - not real processing)
  4. On submit: Clears localStorage cart and shows success message
  5. Suggests creating account to track orders

- **Authenticated checkout flow**:
  - Pre-fills forms if user has saved shipping/payment (future feature)
  - Creates order record in Convex (TODO - not yet implemented)

#### Form Validation:
- All shipping fields required except Address Line 2
- All payment fields required
- Client-side validation before submission
- **Important**: Payment processing is simulated (2 second delay)
- Includes disclaimer: "This is a demo site. Do not enter real payment information."

## User Flows

### Guest Shopping Journey
1. Browse products (no login required)
2. Click "Add to Cart" → Item stored in localStorage
3. View cart badge update in header
4. Navigate to `/cart` → See items with product details
5. Click "Proceed to Checkout" → Redirects to `/checkout`
6. Fill shipping and payment forms
7. Submit order → Cart cleared, success message shown
8. Optional: Prompted to create account for order tracking

### Sign-In Mid-Session
**Current Limitation**: Guest cart does NOT automatically migrate to user account upon sign-in.

**Future Enhancement**: Could implement cart migration by:
1. Detecting sign-in event in `SyncUser` component
2. Checking for localStorage cart
3. Moving items to Convex cart via mutations
4. Clearing localStorage cart

## Technical Details

### Data Flow Diagram
```
Guest User:
  ProductCard → useGuestCart → localStorage
              ↓
  Header reads localStorage → shows cart count
              ↓
  Cart Page fetches products from Convex → joins with localStorage
              ↓
  Checkout Page → clears localStorage on success

Authenticated User:
  ProductCard → Convex mutation → users table
              ↓
  Header queries Convex → shows cart count
              ↓
  Cart Page queries Convex → displays cart items
              ↓
  Checkout Page → creates order (TODO)
```

### Storage Comparison

| Feature | Guest Cart | Authenticated Cart |
|---------|-----------|-------------------|
| Storage | localStorage | Convex database |
| Persistence | Browser-only | Cross-device |
| Product IDs | Strings | Typed `Id<"products">` |
| Quantity Updates | Instant (no network) | Real-time reactive |
| Data Loss Risk | Clear cookies/cache | None |

### Conditional Logic Pattern
All cart-related components use this pattern:
```typescript
const { convexUser } = useConvexUser();
const { guestCart, addToCart: addToGuestCart } = useGuestCart();

const isGuest = !convexUser;

if (isGuest) {
  // Use localStorage operations
  addToGuestCart(productId, quantity);
} else {
  // Use Convex mutations
  await addToCart({ userId: convexUser._id, productId });
}
```

## Known Limitations

1. **No cart migration**: Guest cart doesn't transfer to account upon sign-in
2. **No order tracking for guests**: Orders aren't saved to database (only simulation)
3. **Browser-specific**: Guest cart tied to single browser/device
4. **No persistence**: Clearing browser data loses cart
5. **Wishlist requires auth**: Only cart supports guest mode, not wishlist

## Future Improvements

### High Priority
- [ ] Implement cart migration on sign-in
- [ ] Create guest order records in Convex (with email for tracking)
- [ ] Add "Create Account" flow at checkout completion
- [ ] Email order confirmation for guests

### Medium Priority
- [ ] Guest cart expiration (e.g., 30 days)
- [ ] Stock validation at checkout (prevent overselling)
- [ ] Saved cart recovery via email link
- [ ] Guest wishlist support

### Low Priority
- [ ] Cart comparison tool (localStorage vs Convex)
- [ ] Analytics on guest vs authenticated conversion rates
- [ ] Multi-device cart sync for guests (via magic link)

## Testing Checklist

- [x] Guest can add products to cart
- [x] Cart count updates in header for guests
- [x] Cart page displays guest items correctly
- [x] Guest cart persists across page refreshes
- [x] Checkout page accepts guest orders
- [x] Form validation works
- [x] Cart clears after successful checkout
- [ ] Authenticated user cart still works (no regression)
- [ ] Cart items fetch correct product details
- [ ] Stock levels respected at checkout
- [ ] Sign-in flow doesn't break cart

## Files Modified/Created

### Created:
- `src/hooks/useGuestCart.ts` - localStorage cart management hook
- `src/app/checkout/page.tsx` - Checkout page with forms

### Modified:
- `src/components/ProductCard.tsx` - Added guest cart support
- `src/app/cart/page.tsx` - Unified guest/auth cart display
- `src/app/Header.tsx` - Guest cart count in badge
- `src/app/products/[id]/page.tsx` - Guest cart support on detail page

## Environment Impact
- **No new dependencies** - Uses existing React hooks and localStorage API
- **No database changes** - Guest carts don't hit Convex until checkout
- **No API changes** - Existing Convex queries/mutations unchanged

## Performance Considerations
- localStorage operations are synchronous (blocking) but fast for small carts
- Cart page fetches all products to join with guest cart (could optimize with filtered query)
- Real-time reactivity only applies to authenticated carts (Convex subscriptions)
- Guest cart updates require manual state management (no auto-refresh)
