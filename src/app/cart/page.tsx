"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import Header from "../Header";
import Footer from "../Footer";
import { Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { convexUser, isLoading: userLoading } = useConvexUser();

  const cart = useQuery(
    api.cart.getUserCart,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const clearCart = useMutation(api.cart.clearCart);

  const handleUpdateQuantity = async (itemId: any, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity({ itemId, quantity: newQuantity });
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: any) => {
    try {
      await removeFromCart({ itemId });
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (!convexUser) return;
    if (!confirm("Are you sure you want to clear your cart?")) return;

    try {
      await clearCart({ userId: convexUser._id });
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart");
    }
  };

  if (userLoading) {
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

  if (!convexUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Please sign in to view your cart</p>
            <Link href="/sign-in" className="text-red-600 hover:text-red-700 font-bold">
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cart?.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0) || 0;

  const tax = subtotal * 0.08; // 8% tax
  const shipping = 0; // Free shipping
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">SHOPPING CART</h1>

          {!cart || cart.length === 0 ? (
            <div className="bg-white p-12 text-center">
              <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some gear to get started!</p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition-colors"
              >
                SHOP NOW
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">
                      {cart.length} {cart.length === 1 ? "ITEM" : "ITEMS"}
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Clear Cart
                    </button>
                  </div>

                  {/* Items */}
                  <div className="divide-y">
                    {cart.map((item) => {
                      if (!item.product) return null;

                      return (
                        <div key={item._id} className="p-6">
                          <div className="flex gap-6">
                            {/* Image */}
                            <Link
                              href={`/products/${item.product._id}`}
                              className="relative w-32 h-32 flex-shrink-0 bg-gray-100"
                            >
                              <Image
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </Link>

                            {/* Details */}
                            <div className="flex-grow">
                              <Link href={`/products/${item.product._id}`}>
                                <h3 className="font-bold text-lg mb-1 hover:text-red-600 transition-colors">
                                  {item.product.name}
                                </h3>
                              </Link>

                              <div className="flex gap-2 mb-3 text-sm text-gray-600">
                                <span>{item.product.category}</span>
                                <span>•</span>
                                <span>{item.product.subcategory}</span>
                                {item.product.size && (
                                  <>
                                    <span>•</span>
                                    <span>Size: {item.product.size}</span>
                                  </>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                {/* Quantity Controls */}
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(item._id, item.quantity - 1)
                                    }
                                    className="w-8 h-8 border border-gray-300 hover:border-black font-bold"
                                  >
                                    −
                                  </button>
                                  <span className="font-bold w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(item._id, item.quantity + 1)
                                    }
                                    className="w-8 h-8 border border-gray-300 hover:border-black font-bold"
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                  <p className="text-xl font-bold">
                                    ${((item.product.price * item.quantity) / 100).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    ${(item.product.price / 100).toFixed(2)} each
                                  </p>
                                </div>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">ORDER SUMMARY</h2>

                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="font-medium">${(tax / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold">${(total / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="w-full bg-black text-white py-4 font-bold hover:bg-gray-800 transition-colors mb-3">
                    PROCEED TO CHECKOUT
                  </button>

                  <Link
                    href="/products"
                    className="block text-center text-sm text-gray-600 hover:text-black"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
