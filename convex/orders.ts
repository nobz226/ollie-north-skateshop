import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new order
export const createOrder = mutation({
  args: {
    userId: v.optional(v.id("users")),
    guestEmail: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.string(),
      productName: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      guestEmail: args.guestEmail,
      items: args.items,
      subtotal: args.total,
      tax: 0,
      total: args.total,
      status: "processing",
      createdAt: now,
      updatedAt: now,
    });

    return orderId;
  },
});

// Get user's order history
export const getUserOrders = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Sort by most recent first
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});
