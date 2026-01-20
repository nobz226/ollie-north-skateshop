import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add item to wishlist
export const addToWishlist = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    // Check if item already exists in wishlist
    const existingItem = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user_and_product", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (existingItem) {
      // Already in wishlist, return existing ID
      return existingItem._id;
    }

    // Add new item to wishlist
    const wishlistItemId = await ctx.db.insert("wishlistItems", {
      userId: args.userId,
      productId: args.productId,
      addedAt: Date.now(),
    });
    
    return wishlistItemId;
  },
});

// Remove item from wishlist
export const removeFromWishlist = mutation({
  args: {
    wishlistItemId: v.id("wishlistItems"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.wishlistItemId);
  },
});

// Remove by product ID
export const removeFromWishlistByProduct = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user_and_product", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (item) {
      await ctx.db.delete(item._id);
    }
  },
});

// Get user's wishlist with product details
export const getUserWishlist = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const wishlistItems = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Fetch product details for each wishlist item
    const wishlistWithProducts = await Promise.all(
      wishlistItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    return wishlistWithProducts;
  },
});

// Check if product is in user's wishlist
export const isInWishlist = query({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user_and_product", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    return !!item;
  },
});
