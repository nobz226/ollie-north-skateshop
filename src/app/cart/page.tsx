"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useGuestCart } from "@/hooks/useGuestCart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Id } from "../../../convex/_generated/dataModel";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CartPage() {
  const { convexUser, isLoading: userLoading } = useConvexUser();
  const router = useRouter();
  const { guestCart, isLoaded: guestCartLoaded, updateQuantity: updateGuestQuantity, removeFromCart: removeGuestItem } = useGuestCart();
  
  const cart = useQuery(
    api.cart.getUserCart,
    convexUser ? { userId: convexUser._id } : "skip"
  );
  
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);

  // Get product details for guest cart items
  const allProducts = useQuery(api.products.list);
  const guestCartWithProducts = guestCartLoaded && allProducts 
    ? guestCart.map(item => ({
        ...item,
        product: allProducts.find(p => p._id === item.productId)
      }))
    : [];

  const isGuest = !convexUser && !userLoading;
  const activeCart = isGuest ? guestCartWithProducts : cart;

  if (userLoading || !guestCartLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-lg">Loading cart...</div>
      </div>
    );
  }

  const handleQuantityChange = async (cartItemId: Id<"cartItems">, productId: string, newQuantity: number) => {
    if (isGuest) {
      updateGuestQuantity(productId, newQuantity);
    } else {
      try {
        await updateQuantity({
          cartItemId,
          quantity: newQuantity,
        });
      } catch (error) {
        console.error("Error updating quantity:", error);
        alert("Failed to update quantity");
      }
    }
  };

  const handleRemoveItem = async (cartItemId: Id<"cartItems"> | undefined, productId: string) => {
    if (isGuest) {
      removeGuestItem(productId);
    } else if (cartItemId) {
      try {
        await removeFromCart({
          cartItemId,
        });
      } catch (error) {
        console.error("Error removing item:", error);
        alert("Failed to remove item");
      }
    }
  };

  // Calculate totals
  const subtotal = (activeCart || []).reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  const tax = Math.round(subtotal * 0.08); // 8% tax
  const total = subtotal + tax;

  if (!activeCart || activeCart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Shopping Cart", href: "/cart" }]} />
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some awesome skateboarding gear!</p>
          <Link
            href="/products"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Shopping Cart", href: "/cart" }]} />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {isGuest && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            🛈 You&apos;re shopping as a guest.{" "}
            <Link href="/sign-in?redirectUrl=/cart" className="underline font-semibold">
              Sign in
            </Link>{" "}
            to save your cart.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {activeCart.map((item) => {
            if (!item.product) return null;

            const cartItemId = isGuest ? undefined : (item as any)._id;

            return (
              <div
                key={isGuest ? item.productId : (item as any)._id}
                className="bg-white rounded-lg shadow p-4 flex gap-4"
              >
                {/* Product Image */}
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.product.subcategory}
                    {item.product.size && ` • ${item.product.size}`}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    ${(item.product.price / 100).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(cartItemId as Id<"cartItems">, item.productId, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(cartItemId as Id<"cartItems">, item.productId, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(cartItemId as Id<"cartItems"> | undefined, item.productId)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({activeCart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (8%)</span>
                <span>${(tax / 100).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
            </div>

            <button
              className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 mb-3"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </button>

            <Link
              href="/products"
              className="block text-center text-indigo-600 hover:text-indigo-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
