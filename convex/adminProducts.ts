import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all products for admin view (no pagination, includes all fields)
export const getAllProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products;
  },
});

// Update product
export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    productType: v.optional(v.string()),
    size: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    stockQuantity: v.optional(v.number()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { productId, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(productId, cleanUpdates);
    return productId;
  },
});

// Create new product
export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(), // in cents
    imageUrl: v.string(),
    category: v.string(),
    subcategory: v.string(),
    productType: v.string(),
    size: v.optional(v.string()),
    inStock: v.boolean(),
    stockQuantity: v.number(),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const productId = await ctx.db.insert("products", {
      ...args,
      createdAt: Date.now(),
    });
    return productId;
  },
});

// Delete product
export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.productId);
    return { success: true };
  },
});

// Get unique categories, subcategories, and product types for dropdowns
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    
    const categories = [...new Set(products.map(p => p.category))];
    const subcategories = [...new Set(products.map(p => p.subcategory))];
    const productTypes = [...new Set(products.map(p => p.productType))];
    
    return {
      categories: categories.sort(),
      subcategories: subcategories.sort(),
      productTypes: productTypes.sort(),
    };
  },
});