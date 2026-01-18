import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all products
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").order("desc").collect();
  },
});

// Get single product by ID
export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get products by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Get products by subcategory
export const getBySubcategory = query({
  args: { subcategory: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_subcategory", (q) => q.eq("subcategory", args.subcategory))
      .collect();
  },
});

// Get featured products
export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const allProducts = await ctx.db.query("products").collect();
    return allProducts.filter((p) => p.featured === true);
  },
});