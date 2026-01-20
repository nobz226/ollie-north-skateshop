import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
  }).index("by_clerk_user_id", ["clerkUserId"]),

  // Add admin users table
  adminUsers: defineTable({
    username: v.string(),
    passwordHash: v.string(), // Will store hashed password
    createdAt: v.number(),
  }).index("by_username", ["username"]),

  // Add orders table for order history
  orders: defineTable({
    userId: v.id("users"),
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      quantity: v.number(),
      price: v.number(), // Price at time of purchase
    })),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    status: v.string(), // "pending", "processing", "shipped", "delivered", "cancelled"
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(), // in cents
    imageUrl: v.string(),
    category: v.string(), // "Boards", "Hardware", "Apparel"
    subcategory: v.string(), // "Skateboards", "Longboards", "T-Shirts", etc.
    productType: v.string(), // "Decks", "Trucks", "Wheels", "Completes", "Bolts", etc.
    size: v.optional(v.string()), // "7.5", "8.0", "S", "M", "29", etc.
    inStock: v.boolean(),
    featured: v.optional(v.boolean()), // for homepage
    createdAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_category", ["category"])
    .index("by_subcategory", ["subcategory"])
    .index("by_product_type", ["productType"]),

  cartItems: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),
});