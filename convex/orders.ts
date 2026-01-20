import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new order
export const createOrder = mutation({
  args: {
    userId: v.id("users"),
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      quantity: v.number(),
      price: v.number(), // Price at time of purchase (in cents)
    })),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    shippingAddress: v.object({
      fullName: v.string(),
      addressLine1: v.string(),
      addressLine2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      postalCode: v.string(),
      country: v.string(),
      phone: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      items: args.items,
      subtotal: args.subtotal,
      tax: args.tax,
      total: args.total,
      status: "pending",
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
