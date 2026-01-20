"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConvexUser } from "@/hooks/useConvexUser";
import Header from "../Header";
import Footer from "../Footer";
import { Package, User, ShoppingBag, CreditCard, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ProfilePage() {
  const { user } = useUser();
  const { convexUser, isLoading } = useConvexUser();

  const cart = useQuery(
    api.cart.getUserCart,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const userProfile = useQuery(
    api.userProfile.getUserProfile,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const orders = useQuery(
    api.orders.getUserOrders,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const updateShippingAddress = useMutation(api.userProfile.updateShippingAddress);
  const updatePaymentMethod = useMutation(api.userProfile.updatePaymentMethod);

  const cartItemCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Shipping Address Form State
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    phone: "",
  });

  // Payment Method Form State
  const [paymentForm, setPaymentForm] = useState({
    cardHolderName: "",
    cardLastFour: "",
    cardType: "Visa",
    expiryMonth: "",
    expiryYear: "",
  });

  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addressValidation, setAddressValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
    suggestions?: { state: string; cities: string[] };
  }>({ isValidating: false, isValid: null, message: "" });

  // US States and Canadian Provinces
  const US_STATES = [
    { code: "AL", name: "Alabama" },
    { code: "AK", name: "Alaska" },
    { code: "AZ", name: "Arizona" },
    { code: "AR", name: "Arkansas" },
    { code: "CA", name: "California" },
    { code: "CO", name: "Colorado" },
    { code: "CT", name: "Connecticut" },
    { code: "DE", name: "Delaware" },
    { code: "FL", name: "Florida" },
    { code: "GA", name: "Georgia" },
    { code: "HI", name: "Hawaii" },
    { code: "ID", name: "Idaho" },
    { code: "IL", name: "Illinois" },
    { code: "IN", name: "Indiana" },
    { code: "IA", name: "Iowa" },
    { code: "KS", name: "Kansas" },
    { code: "KY", name: "Kentucky" },
    { code: "LA", name: "Louisiana" },
    { code: "ME", name: "Maine" },
    { code: "MD", name: "Maryland" },
    { code: "MA", name: "Massachusetts" },
    { code: "MI", name: "Michigan" },
    { code: "MN", name: "Minnesota" },
    { code: "MS", name: "Mississippi" },
    { code: "MO", name: "Missouri" },
    { code: "MT", name: "Montana" },
    { code: "NE", name: "Nebraska" },
    { code: "NV", name: "Nevada" },
    { code: "NH", name: "New Hampshire" },
    { code: "NJ", name: "New Jersey" },
    { code: "NM", name: "New Mexico" },
    { code: "NY", name: "New York" },
    { code: "NC", name: "North Carolina" },
    { code: "ND", name: "North Dakota" },
    { code: "OH", name: "Ohio" },
    { code: "OK", name: "Oklahoma" },
    { code: "OR", name: "Oregon" },
    { code: "PA", name: "Pennsylvania" },
    { code: "RI", name: "Rhode Island" },
    { code: "SC", name: "South Carolina" },
    { code: "SD", name: "South Dakota" },
    { code: "TN", name: "Tennessee" },
    { code: "TX", name: "Texas" },
    { code: "UT", name: "Utah" },
    { code: "VT", name: "Vermont" },
    { code: "VA", name: "Virginia" },
    { code: "WA", name: "Washington" },
    { code: "WV", name: "West Virginia" },
    { code: "WI", name: "Wisconsin" },
    { code: "WY", name: "Wyoming" }
  ];

  const CANADA_PROVINCES = [
    { code: "AB", name: "Alberta" },
    { code: "BC", name: "British Columbia" },
    { code: "MB", name: "Manitoba" },
    { code: "NB", name: "New Brunswick" },
    { code: "NL", name: "Newfoundland and Labrador" },
    { code: "NS", name: "Nova Scotia" },
    { code: "NT", name: "Northwest Territories" },
    { code: "NU", name: "Nunavut" },
    { code: "ON", name: "Ontario" },
    { code: "PE", name: "Prince Edward Island" },
    { code: "QC", name: "Quebec" },
    { code: "SK", name: "Saskatchewan" },
    { code: "YT", name: "Yukon" }
  ];

  const stateOptions = shippingForm.country === "USA" ? US_STATES : 
                       shippingForm.country === "Canada" ? CANADA_PROVINCES : [];

  // Validate postal code when editing shipping address
  useEffect(() => {
    if (!isEditingShipping) {
      setAddressValidation({ isValidating: false, isValid: null, message: "" });
      return;
    }

    const validatePostalCode = async () => {
      if (!shippingForm.postalCode || !shippingForm.state || !shippingForm.city) {
        setAddressValidation({ isValidating: false, isValid: null, message: "" });
        return;
      }

      // Basic format validation first
      if (shippingForm.country === "USA") {
        if (!/^\d{5}(-\d{4})?$/.test(shippingForm.postalCode)) {
          setAddressValidation({
            isValidating: false,
            isValid: false,
            message: "Invalid ZIP code format",
          });
          return;
        }
      } else if (shippingForm.country === "Canada") {
        if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(shippingForm.postalCode)) {
          setAddressValidation({
            isValidating: false,
            isValid: false,
            message: "Invalid postal code format",
          });
          return;
        }
      }

      setAddressValidation({ isValidating: true, isValid: null, message: "Validating..." });

      try {
        const response = await fetch("/api/validate-address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: shippingForm.country,
            postalCode: shippingForm.postalCode,
            state: shippingForm.state,
            city: shippingForm.city,
          }),
        });

        const data = await response.json();

        if (data.valid) {
          setAddressValidation({
            isValidating: false,
            isValid: true,
            message: "✓ Address validated",
          });
        } else {
          setAddressValidation({
            isValidating: false,
            isValid: false,
            message: data.error || "Address validation failed",
            suggestions: data.expectedState && data.expectedCities ? {
              state: data.expectedState,
              cities: data.expectedCities,
            } : undefined,
          });
        }
      } catch (error) {
        console.error("Address validation error:", error);
        setAddressValidation({
          isValidating: false,
          isValid: null,
          message: "Unable to validate address",
        });
      }
    };

    const timeoutId = setTimeout(validatePostalCode, 500);
    return () => clearTimeout(timeoutId);
  }, [shippingForm.postalCode, shippingForm.state, shippingForm.city, shippingForm.country, isEditingShipping]);

  // Populate forms when user profile loads
  useEffect(() => {
    if (userProfile?.shippingAddress) {
      setShippingForm({
        fullName: userProfile.shippingAddress.fullName,
        addressLine1: userProfile.shippingAddress.addressLine1,
        addressLine2: userProfile.shippingAddress.addressLine2 || "",
        city: userProfile.shippingAddress.city,
        state: userProfile.shippingAddress.state,
        postalCode: userProfile.shippingAddress.postalCode,
        country: userProfile.shippingAddress.country,
        phone: userProfile.shippingAddress.phone,
      });
    }
    if (userProfile?.paymentMethod) {
      setPaymentForm({
        cardHolderName: userProfile.paymentMethod.cardHolderName,
        cardLastFour: userProfile.paymentMethod.cardLastFour,
        cardType: userProfile.paymentMethod.cardType,
        expiryMonth: userProfile.paymentMethod.expiryMonth,
        expiryYear: userProfile.paymentMethod.expiryYear,
      });
    }
  }, [userProfile]);

  const handleSaveShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convexUser) return;

    // Check address validation status - MANDATORY
    if (addressValidation.isValidating) {
      alert("Please wait for address validation to complete.");
      return;
    }

    if (addressValidation.isValid === false) {
      alert(
        `Address validation failed: ${addressValidation.message}\n\n` +
        (addressValidation.suggestions 
          ? `Expected state: ${addressValidation.suggestions.state}\n` +
            `Expected cities: ${addressValidation.suggestions.cities.join(", ")}\n\n`
          : "") +
        "Please correct your address before saving."
      );
      return;
    }

    // Require successful validation before saving
    if (addressValidation.isValid !== true) {
      alert("Please ensure all address fields are filled correctly and validated.");
      return;
    }

    setIsSaving(true);
    try {
      await updateShippingAddress({
        userId: convexUser._id,
        ...shippingForm,
      });
      setIsEditingShipping(false);
    } catch (error) {
      console.error("Error saving shipping address:", error);
      alert("Failed to save shipping address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convexUser) return;

    setIsSaving(true);
    try {
      await updatePaymentMethod({
        userId: convexUser._id,
        ...paymentForm,
      });
      setIsEditingPayment(false);
    } catch (error) {
      console.error("Error saving payment method:", error);
      alert("Failed to save payment method");
    } finally {
      setIsSaving(false);
    }
  };

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
          <Breadcrumbs items={[{ label: "My Profile", href: "/profile" }]} />
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

              {/* Order History */}
              <div className="bg-white p-8 mb-8">
                <h3 className="text-xl font-bold mb-6">ORDER HISTORY</h3>
                {!orders || orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="mb-2">No orders yet</p>
                    <p className="text-sm">Your order history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Order placed: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Order ID: {order._id.slice(-8)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">${(order.total / 100).toFixed(2)}</p>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-sm font-medium mb-2">Items:</p>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  {item.productName} x {item.quantity}
                                </span>
                                <span className="font-medium">
                                  ${((item.price * item.quantity) / 100).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t mt-4 pt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 mb-1">Subtotal:</p>
                              <p className="text-gray-600 mb-1">Tax:</p>
                              <p className="font-semibold">Total:</p>
                            </div>
                            <div className="text-right">
                              <p className="mb-1">${(order.subtotal / 100).toFixed(2)}</p>
                              <p className="mb-1">${(order.tax / 100).toFixed(2)}</p>
                              <p className="font-semibold">${(order.total / 100).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping Address Section */}
              <div className="bg-white p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 mr-3" />
                    <h3 className="text-xl font-bold">SHIPPING ADDRESS</h3>
                  </div>
                  {!isEditingShipping && userProfile?.shippingAddress && (
                    <button
                      onClick={() => setIsEditingShipping(true)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingShipping || !userProfile?.shippingAddress ? (
                  <form onSubmit={handleSaveShipping} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingForm.fullName}
                        onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingForm.addressLine1}
                        onChange={(e) => setShippingForm({ ...shippingForm, addressLine1: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={shippingForm.addressLine2}
                        onChange={(e) => setShippingForm({ ...shippingForm, addressLine2: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          pattern="[a-zA-Z\s\-]+"
                          title="City name should only contain letters, spaces, and hyphens"
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country *
                        </label>
                        <select
                          required
                          value={shippingForm.country}
                          onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value, state: "" })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="USA">United States</option>
                          <option value="Canada">Canada</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province *
                        </label>
                        <select
                          required
                          value={shippingForm.state}
                          onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Select {shippingForm.country === "USA" ? "State" : "Province"}</option>
                          {stateOptions.map((option) => (
                            <option key={option.code} value={option.code}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingForm.postalCode}
                          onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                          placeholder={
                            shippingForm.country === "USA" ? "12345" :
                            shippingForm.country === "Canada" ? "A1A 1A1" :
                            "Postal Code"
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {shippingForm.country === "USA" && "5 digits (e.g., 90210 or 90210-1234)"}
                          {shippingForm.country === "Canada" && "Format: A1A 1A1"}
                        </p>
                        {/* Address Validation Feedback */}
                        {addressValidation.message && (
                          <div
                            className={`mt-2 p-2 rounded-md text-sm ${
                              addressValidation.isValidating
                                ? "bg-blue-50 text-blue-700"
                                : addressValidation.isValid === true
                                ? "bg-green-50 text-green-700"
                                : addressValidation.isValid === false
                                ? "bg-red-50 text-red-700"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            <p className="font-medium">{addressValidation.message}</p>
                            {addressValidation.suggestions && (
                              <div className="mt-1 text-xs">
                                <p>Expected state: {addressValidation.suggestions.state}</p>
                                <p>Expected cities: {addressValidation.suggestions.cities.join(", ")}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
                      >
                        {isSaving ? "Saving..." : "Save Address"}
                      </button>
                      {userProfile?.shippingAddress && (
                        <button
                          type="button"
                          onClick={() => setIsEditingShipping(false)}
                          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">{userProfile.shippingAddress.fullName}</p>
                    <p className="text-gray-700">{userProfile.shippingAddress.addressLine1}</p>
                    {userProfile.shippingAddress.addressLine2 && (
                      <p className="text-gray-700">{userProfile.shippingAddress.addressLine2}</p>
                    )}
                    <p className="text-gray-700">
                      {userProfile.shippingAddress.city}, {userProfile.shippingAddress.state} {userProfile.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-700">{userProfile.shippingAddress.country}</p>
                    <p className="text-gray-700">{userProfile.shippingAddress.phone}</p>
                  </div>
                )}
              </div>

              {/* Payment Method Section */}
              <div className="bg-white p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-3" />
                    <h3 className="text-xl font-bold">PAYMENT METHOD</h3>
                  </div>
                  {!isEditingPayment && userProfile?.paymentMethod && (
                    <button
                      onClick={() => setIsEditingPayment(true)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingPayment || !userProfile?.paymentMethod ? (
                  <form onSubmit={handleSavePayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.cardHolderName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardHolderName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Type *
                      </label>
                      <select
                        required
                        value={paymentForm.cardType}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="American Express">American Express</option>
                        <option value="Discover">Discover</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last 4 Digits *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        pattern="[0-9]{4}"
                        value={paymentForm.cardLastFour}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cardLastFour: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="1234"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Month *
                        </label>
                        <select
                          required
                          value={paymentForm.expiryMonth}
                          onChange={(e) => setPaymentForm({ ...paymentForm, expiryMonth: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0");
                            return (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Year *
                        </label>
                        <select
                          required
                          value={paymentForm.expiryYear}
                          onChange={(e) => setPaymentForm({ ...paymentForm, expiryYear: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (new Date().getFullYear() + i).toString();
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
                      >
                        {isSaving ? "Saving..." : "Save Payment Method"}
                      </button>
                      {userProfile?.paymentMethod && (
                        <button
                          type="button"
                          onClick={() => setIsEditingPayment(false)}
                          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">{userProfile.paymentMethod.cardHolderName}</p>
                    <p className="text-gray-700">
                      {userProfile.paymentMethod.cardType} ending in {userProfile.paymentMethod.cardLastFour}
                    </p>
                    <p className="text-gray-700">
                      Expires: {userProfile.paymentMethod.expiryMonth}/{userProfile.paymentMethod.expiryYear}
                    </p>
                  </div>
                )}
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