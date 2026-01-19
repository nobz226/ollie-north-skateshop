import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    // Check if user already exists - use .first() instead of .unique()
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user if doesn't exist
    const userId = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
    });

    return userId;
  },
});
