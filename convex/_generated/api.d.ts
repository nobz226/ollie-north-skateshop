/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as addUser from "../addUser.js";
import type * as admin from "../admin.js";
import type * as adminOrders from "../adminOrders.js";
import type * as adminProducts from "../adminProducts.js";
import type * as cart from "../cart.js";
import type * as products from "../products.js";
import type * as seedProducts from "../seedProducts.js";
import type * as userProfile from "../userProfile.js";
import type * as users from "../users.js";
import type * as wishlist from "../wishlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  addUser: typeof addUser;
  admin: typeof admin;
  adminOrders: typeof adminOrders;
  adminProducts: typeof adminProducts;
  cart: typeof cart;
  products: typeof products;
  seedProducts: typeof seedProducts;
  userProfile: typeof userProfile;
  users: typeof users;
  wishlist: typeof wishlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
