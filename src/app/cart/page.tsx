"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useGuestCart } from "@/hooks/useGuestCart";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CartPage() {
  const { convexUser, isLoading: userLoading } = useConvexUser();
  const { user } = useUser();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
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

  const handleStripeCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      // Get email - from Clerk user or prompt guest
      let userEmail = user?.primaryEmailAddress?.emailAddress;
      
      if (!convexUser && !userEmail) {
        userEmail = prompt("Please enter your email address for order confirmation:");
        if (!userEmail || !userEmail.includes("@")) {
          alert("Valid email is required to proceed with checkout");
          setIsCheckingOut(false);
          return;
        }
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: activeCart,
          userId: convexUser?._id,
          userEmail,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
      setIsCheckingOut(false);
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
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some awesome skateboarding gear!</p>
            <button
              onClick={() => router.back()}
              className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Shopping Cart", href: "/cart" }]} />
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {isGuest && (
        <div className="mb-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
          <p className="text-cyan-900">
            <span className="font-semibold">Guest Mode:</span>{" "}
            <Link href="/sign-in?redirectUrl=/cart" className="underline font-semibold hover:text-cyan-600 transition-colors">
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
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex gap-6 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="relative h-28 w-28 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide">
                    {item.product.subcategory}
                    {item.product.size && ` • ${item.product.size}`}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    ${(item.product.price / 100).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleQuantityChange(cartItemId as Id<"cartItems">, item.productId, item.quantity - 1)
                      }
                      className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-cyan-500 hover:text-cyan-500 transition-all font-bold"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(cartItemId as Id<"cartItems">, item.productId, item.quantity + 1)
                      }
                      className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-cyan-500 hover:text-cyan-500 transition-all font-bold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(cartItemId as Id<"cartItems"> | undefined, item.productId)}
                    className="text-sm text-red-500 hover:text-red-700 font-bold transition-colors"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Subtotal ({activeCart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-bold">${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Tax (8%)</span>
                <span className="font-bold">${(tax / 100).toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-4 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-cyan-500">${(total / 100).toFixed(2)}</span>
              </div>
            </div>

            <button
              className="w-full bg-cyan-500 text-white py-4 rounded-lg font-bold hover:bg-cyan-600 mb-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleStripeCheckout}
              disabled={isCheckingOut || activeCart.length === 0}
            >
              {isCheckingOut ? "PROCESSING..." : "PROCEED TO CHECKOUT"}
            </button>

            <button
              onClick={() => router.back()}
              className="block w-full text-center text-cyan-600 hover:text-cyan-700 font-bold transition-colors"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
