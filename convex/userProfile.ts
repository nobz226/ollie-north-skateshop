import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Update shipping address
export const updateShippingAddress = mutation({
  args: {
    userId: v.id("users"),
    fullName: v.string(),
    addressLine1: v.string(),
    addressLine2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    postalCode: v.string(),
    country: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, ...address } = args;
    
    await ctx.db.patch(userId, {
      shippingAddress: address,
    });
    
    return userId;
  },
});

// Update payment method
export const updatePaymentMethod = mutation({
  args: {
    userId: v.id("users"),
    cardHolderName: v.string(),
    cardLastFour: v.string(),
    cardType: v.string(),
    expiryMonth: v.string(),
    expiryYear: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, ...paymentMethod } = args;
    
    await ctx.db.patch(userId, {
      paymentMethod,
    });
    
    return userId;
  },
});

// Get user profile with payment and shipping info
export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
