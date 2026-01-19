"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import Header from "../Header";
import Footer from "../Footer";
import { Package, User, ShoppingBag } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const { convexUser, isLoading } = useConvexUser();

  const cart = useQuery(
    api.cart.getUserCart,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const cartItemCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-2xl font-bold">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">MY ACCOUNT</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6">
                    {user?.firstName?.charAt(0) || user?.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-gray-600">{user?.emailAddresses[0].emailAddress}</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold mb-4">ACCOUNT DETAILS</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Account Status</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-medium">
                        {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Cart Items</span>
                      <span className="font-medium">{cartItemCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History Placeholder */}
              <div className="bg-white p-8">
                <h3 className="text-xl font-bold mb-6">ORDER HISTORY</h3>
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="mb-2">No orders yet</p>
                  <p className="text-sm">Your order history will appear here</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white p-6">
                <div className="flex items-center mb-4">
                  <ShoppingBag className="h-8 w-8 mr-3" />
                  <h3 className="text-lg font-bold">CURRENT CART</h3>
                </div>
                <p className="text-3xl font-bold mb-2">{cartItemCount}</p>
                <p className="text-sm text-gray-600">
                  {cartItemCount === 1 ? "item" : "items"} ready to checkout
                </p>
              </div>

              <div className="bg-white p-6">
                <div className="flex items-center mb-4">
                  <Package className="h-8 w-8 mr-3" />
                  <h3 className="text-lg font-bold">TOTAL ORDERS</h3>
                </div>
                <p className="text-3xl font-bold mb-2">0</p>
                <p className="text-sm text-gray-600">All-time purchases</p>
              </div>

              <div className="bg-black text-white p-6">
                <div className="flex items-center mb-4">
                  <User className="h-8 w-8 mr-3" />
                  <h3 className="text-lg font-bold">MEMBER PERKS</h3>
                </div>
                <ul className="text-sm space-y-2">
                  <li>✓ Free shipping on all orders</li>
                  <li>✓ Early access to new drops</li>
                  <li>✓ Exclusive member discounts</li>
                  <li>✓ Skate tips and tutorials</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}