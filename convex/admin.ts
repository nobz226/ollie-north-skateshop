import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Simple password hashing for Convex environment
// Note: This is basic hashing for demo purposes
// In production, consider using Clerk for admin auth instead
function hashPassword(password: string): string {
  // Simple string encoding that works in Convex
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Initialize admin user (run this once via Convex dashboard)
export const createAdminUser = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if admin already exists
    const existingAdmin = await ctx.db
      .query("adminUsers")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingAdmin) {
      throw new Error("Admin user already exists");
    }

    // Create admin user
    const adminId = await ctx.db.insert("adminUsers", {
      username: args.username,
      passwordHash: hashPassword(args.password),
      createdAt: Date.now(),
    });

    return adminId;
  },
});

// Verify admin login credentials - Changed to MUTATION instead of query
export const verifyAdminLogin = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("adminUsers")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!admin) {
      return { success: false, message: "Invalid credentials" };
    }

    const isValid = verifyPassword(args.password, admin.passwordHash);

    if (!isValid) {
      return { success: false, message: "Invalid credentials" };
    }

    return { 
      success: true, 
      adminId: admin._id,
      username: admin.username 
    };
  },
});