# Convex Backend — Ollie North Skateshop

This directory contains all Convex serverless backend logic for the Ollie North Skateshop e-commerce platform.

## What's in here

| File | Purpose |
|---|---|
| `schema.ts` | Database table definitions and indexes |
| `products.ts` | Product queries (list, filter, get by ID/category) |
| `cart.ts` | Cart queries and mutations for authenticated users |
| `addUser.ts` | User creation/sync mutation (called by `SyncUser` component) |
| `users.ts` | User queries (look up by Clerk ID) |
| `userProfile.ts` | User profile queries and mutations |
| `wishlist.ts` | Wishlist queries and mutations |
| `orders.ts` | Customer order operations |
| `admin.ts` | Admin authentication (separate from Clerk) |
| `adminProducts.ts` | Product CRUD mutations for the admin CMS |
| `adminOrders.ts` | Order history queries for the admin CMS |
| `fileStorage.ts` | File/image storage helpers |
| `seedProducts.ts` | One-time seeding script for 150+ sample products |
| `_generated/` | Auto-generated type definitions (do not edit manually) |

## Key Conventions

- **All prices are stored in cents** (e.g. `4999` = $49.99). Always divide by 100 for display.
- **Convex typed IDs** (`Id<"users">`, `Id<"products">`, etc.) are used throughout — never plain strings.
- Queries use `"skip"` as the args value to conditionally disable a subscription when dependencies aren't ready.
- The admin system uses a separate `adminUsers` table and is **not** connected to Clerk.

## Getting Started

See the [root README](../README.md) for full setup instructions, including how to run `npx convex dev` and seed the database.

For Convex syntax and advanced usage, refer to the [Convex documentation](https://docs.convex.dev).
