import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getBySubcategory = query({
  args: { subcategory: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_subcategory", (q) => q.eq("subcategory", args.subcategory))
      .collect();
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const allProducts = await ctx.db.query("products").collect();
    return allProducts.filter((p) => p.featured === true);
  },
});