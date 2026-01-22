import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all orders with user details
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    
    // Fetch user details for each order
    const ordersWithUsers = await Promise.all(
      orders.map(async (order) => {
        // Handle guest orders (no userId)
        const user = order.userId ? await ctx.db.get(order.userId) : null;
        return {
          ...order,
          user: user ? {
            _id: user._id,
            clerkUserId: user.clerkUserId,
          } : null,
        };
      })
    );
    
    // Sort by most recent first
    return ordersWithUsers.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get orders for a specific user
export const getOrdersByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    // Sort by most recent first
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get all users for the dropdown filter
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    // Get order counts for each user
    const usersWithOrderCounts = await Promise.all(
      users.map(async (user) => {
        const orders = await ctx.db
          .query("orders")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();
        
        return {
          _id: user._id,
          clerkUserId: user.clerkUserId,
          orderCount: orders.length,
        };
      })
    );
    
    // Sort by users with most orders first
    return usersWithOrderCounts.sort((a, b) => b.orderCount - a.orderCount);
  },
});

// Get order statistics
export const getOrderStats = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalOrders,
      totalRevenue, // in cents
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      statusCounts,
    };
  },
});