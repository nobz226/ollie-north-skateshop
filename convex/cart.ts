import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add item to cart (or increment quantity if already exists)
export const addToCart = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    // Check if item already exists in cart
    const existingItem = await ctx.db
      .query("cartItems")
      .withIndex("by_user_and_product", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (existingItem) {
      // Increment quantity if already in cart
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + 1,
      });
      return existingItem._id;
    } else {
      // Add new item to cart
      const cartItemId = await ctx.db.insert("cartItems", {
        userId: args.userId,
        productId: args.productId,
        quantity: 1,
        addedAt: Date.now(),
      });
      return cartItemId;
    }
  },
});

// Update cart item quantity
export const updateQuantity = mutation({
  args: {
    cartItemId: v.id("cartItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.quantity <= 0) {
      // Remove item if quantity is 0 or less
      await ctx.db.delete(args.cartItemId);
      return null;
    }

    await ctx.db.patch(args.cartItemId, {
      quantity: args.quantity,
    });
    return args.cartItemId;
  },
});

// Remove item from cart
export const removeFromCart = mutation({
  args: {
    cartItemId: v.id("cartItems"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.cartItemId);
  },
});

// Clear entire cart for a user
export const clearCart = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Delete all cart items
    await Promise.all(
      cartItems.map((item) => ctx.db.delete(item._id))
    );
  },
});

// Get user's cart with product details
export const getUserCart = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Fetch product details for each cart item
    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          _id: item._id,
          quantity: item.quantity,
          addedAt: item.addedAt,
          product: product || null,
        };
      })
    );

    // Filter out items where product was deleted
    return cartWithProducts.filter((item) => item.product !== null);
  },
});

// Get cart item count for a user
export const getCartCount = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return cartItems.reduce((total, item) => total + item.quantity, 0);
  },
});