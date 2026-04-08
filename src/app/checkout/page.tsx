"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvexUser } from "@/hooks/useConvexUser";
import { useGuestCart } from "@/hooks/useGuestCart";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CheckoutPage() {
  const router = useRouter();
  const { convexUser, isLoading: userLoading } = useConvexUser();
  const { guestCart, isLoaded: guestCartLoaded, clearCart: clearGuestCart } = useGuestCart();
  
  const cart = useQuery(
    api.cart.getUserCart,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const userProfile = useQuery(
    api.userProfile.getUserProfile,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const updateShippingAddress = useMutation(api.userProfile.updateShippingAddress);
  const updatePaymentMethod = useMutation(api.userProfile.updatePaymentMethod);
  const createOrder = useMutation(api.orders.createOrder);
  const clearUserCart = useMutation(api.cart.clearCart);

  // Form state
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

  const [paymentForm, setPaymentForm] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  // Track if user has existing profile data
  const [hasExistingShipping, setHasExistingShipping] = useState(false);
  const [hasExistingPayment, setHasExistingPayment] = useState(false);
  const [shippingModified, setShippingModified] = useState(false);
  const [paymentModified, setPaymentModified] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Pre-fill forms with user profile data
  useEffect(() => {
    if (userProfile && convexUser) {
      if (userProfile.shippingAddress) {
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
        setHasExistingShipping(true);
      }
      if (userProfile.paymentMethod) {
        setPaymentForm(prev => ({
          ...prev,
          cardHolderName: userProfile.paymentMethod!.cardHolderName,
          expiryMonth: userProfile.paymentMethod!.expiryMonth,
          expiryYear: userProfile.paymentMethod!.expiryYear,
        }));
        setHasExistingPayment(true);
      }
    }
  }, [userProfile, convexUser]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState<boolean | null>(null);
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

  // Validate postal code when it changes
  useEffect(() => {
    const validatePostalCode = async () => {
      // Only validate if we have postal code, state, and city
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

    const timeoutId = setTimeout(validatePostalCode, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [shippingForm.postalCode, shippingForm.state, shippingForm.city, shippingForm.country]);

  // Get product details for guest cart
  const allProducts = useQuery(api.products.list);
  const guestCartWithProducts = guestCartLoaded && allProducts 
    ? guestCart.map(item => ({
        ...item,
        product: allProducts.find(p => p._id === item.productId)
      }))
    : [];

  const isGuest = !convexUser && !userLoading;
  const activeCart = isGuest ? guestCartWithProducts : cart;

  // Calculate totals
  const subtotal = (activeCart || []).reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeCart || activeCart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Validate shipping information
    if (!shippingForm.fullName || !shippingForm.addressLine1 || !shippingForm.city || 
        !shippingForm.state || !shippingForm.postalCode || !shippingForm.phone) {
      alert("Please fill in all required shipping fields.");
      return;
    }

    // Validate city (letters, spaces, hyphens only)
    if (!/^[a-zA-Z\s\-]+$/.test(shippingForm.city)) {
      alert("Please enter a valid city name (letters, spaces, and hyphens only).");
      return;
    }

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
        "Please correct your address before proceeding."
      );
      return;
    }

    // Require successful validation before proceeding
    if (addressValidation.isValid !== true) {
      alert("Please ensure all address fields are filled correctly and validated.");
      return;
    }

    // Validate state/province based on country
    if (shippingForm.country === "USA") {
      const usStates = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
      ];
      if (!usStates.includes(shippingForm.state.toUpperCase())) {
        alert("Please enter a valid US state code (e.g., CA, NY, TX).");
        return;
      }
    } else if (shippingForm.country === "Canada") {
      const canadaProvinces = [
        "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"
      ];
      if (!canadaProvinces.includes(shippingForm.state.toUpperCase())) {
        alert("Please enter a valid Canadian province code (e.g., ON, BC, QC).");
        return;
      }
    }

    // Validate postal code based on country
    if (shippingForm.country === "USA") {
      if (!/^\d{5}(-\d{4})?$/.test(shippingForm.postalCode)) {
        alert("Please enter a valid US ZIP code (e.g., 12345 or 12345-6789).");
        return;
      }
    } else if (shippingForm.country === "Canada") {
      if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(shippingForm.postalCode)) {
        alert("Please enter a valid Canadian postal code (e.g., A1A 1A1).");
        return;
      }
    } else if (shippingForm.country === "UK") {
      if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(shippingForm.postalCode)) {
        alert("Please enter a valid UK postal code (e.g., SW1A 1AA).");
        return;
      }
    } else if (shippingForm.country === "Australia") {
      if (!/^\d{4}$/.test(shippingForm.postalCode)) {
        alert("Please enter a valid Australian postal code (e.g., 2000).");
        return;
      }
    }

    // Validate phone number (basic: 10-15 digits)
    const phoneDigits = shippingForm.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      alert("Please enter a valid phone number (10-15 digits).");
      return;
    }

    if (!paymentForm.cardHolderName || !paymentForm.cardNumber || 
        !paymentForm.expiryMonth || !paymentForm.expiryYear || !paymentForm.cvv) {
      alert("Please fill in all payment fields.");
      return;
    }

    // Validate card number (basic: 13-19 digits)
    const cardDigits = paymentForm.cardNumber.replace(/\D/g, '');
    if (cardDigits.length < 13 || cardDigits.length > 19) {
      alert("Please enter a valid card number (13-19 digits).");
      return;
    }

    // Validate expiry month (01-12)
    const month = parseInt(paymentForm.expiryMonth);
    if (isNaN(month) || month < 1 || month > 12) {
      alert("Please enter a valid expiry month (01-12).");
      return;
    }

    // Validate expiry year (current year or later)
    const year = parseInt(paymentForm.expiryYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < currentYear || year > currentYear + 20) {
      alert(`Please enter a valid expiry year (${currentYear}-${currentYear + 20}).`);
      return;
    }

    // Validate CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(paymentForm.cvv)) {
      alert("Please enter a valid CVV (3 or 4 digits).");
      return;
    }

    // For authenticated users, check if data was modified or is new
    if (convexUser && !isGuest) {
      const shouldAskToSave = (!hasExistingShipping || shippingModified || !hasExistingPayment || paymentModified);
      
      if (shouldAskToSave && saveToProfile === null) {
        setShowSaveModal(true);
        return;
      }
    }

    await processOrder();
  };

  const processOrder = async () => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save to profile if requested and user is authenticated
      if (convexUser && !isGuest && saveToProfile) {
        try {
          // Update shipping if modified or new
          if (!hasExistingShipping || shippingModified) {
            await updateShippingAddress({
              userId: convexUser._id,
              fullName: shippingForm.fullName,
              addressLine1: shippingForm.addressLine1,
              addressLine2: shippingForm.addressLine2,
              city: shippingForm.city,
              state: shippingForm.state,
              postalCode: shippingForm.postalCode,
              country: shippingForm.country,
              phone: shippingForm.phone,
            });
          }

          // Update payment if modified or new
          if ((!hasExistingPayment || paymentModified) && paymentForm.cardNumber) {
            await updatePaymentMethod({
              userId: convexUser._id,
              cardHolderName: paymentForm.cardHolderName,
              cardLastFour: paymentForm.cardNumber.slice(-4),
              cardType: "Visa", // In production, detect card type
              expiryMonth: paymentForm.expiryMonth,
              expiryYear: paymentForm.expiryYear,
            });
          }
        } catch (error) {
          console.error("Error saving to profile:", error);
        }
      }

      // Create order for authenticated users
      if (convexUser && !isGuest && activeCart) {
        try {
          // Prepare order items with product details
          const orderItems = activeCart
            .filter(item => item.product)
            .map(item => ({
              productId: item.product!._id,
              productName: item.product!.name,
              quantity: item.quantity,
              price: item.product!.price,
            }));

          // Create the order
          await createOrder({
            userId: convexUser._id,
            items: orderItems,
            total,
          });

          // Clear the user's cart after successful order
          await clearUserCart({ userId: convexUser._id });

          alert("Order placed successfully! " + (saveToProfile ? "Profile updated." : ""));
          router.push("/");
        } catch (error) {
          console.error("Error creating order:", error);
          alert("Failed to create order. Please try again.");
          return;
        }
      } else if (isGuest) {
        // For guests, just clear cart and show success
        clearGuestCart();
        alert("Order placed successfully! Create an account to track your order.");
        router.push("/");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
      setShowSaveModal(false);
      setSaveToProfile(null);
    }
  };

  if (userLoading || !guestCartLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-lg">Loading checkout...</div>
      </div>
    );
  }

  if (!activeCart || activeCart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Checkout", href: "/checkout" }]} />
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products before checking out!</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs 
        items={[
          { label: "Cart", href: "/cart" },
          { label: "Checkout", href: "/checkout" }
        ]} 
      />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forms Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.fullName}
                    onChange={(e) => {
                      setShippingForm({ ...shippingForm, fullName: e.target.value });
                      if (hasExistingShipping) setShippingModified(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.addressLine1}
                    onChange={(e) => {
                      setShippingForm({ ...shippingForm, addressLine1: e.target.value });
                      if (hasExistingShipping) setShippingModified(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={shippingForm.addressLine2}
                    onChange={(e) => {
                      setShippingForm({ ...shippingForm, addressLine2: e.target.value });
                      if (hasExistingShipping) setShippingModified(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    pattern="[a-zA-Z\s\-]+"
                    title="City name should only contain letters, spaces, and hyphens"
                    value={shippingForm.city}
                    onChange={(e) => {
                      setShippingForm({ ...shippingForm, city: e.target.value });
                      if (hasExistingShipping) setShippingModified(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    required
                    value={shippingForm.country}
                    onChange={(e) => {
                      setShippingForm({ ...shippingForm, country: e.target.value, state: "" });
                      if (hasExistingShipping) setShippingModified(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="USA">United States</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province *
                  </label>
                  <select
                    required
                    value={shippingForm.state}
                    onChange={(e) => {
                      setShippingForm({ ...shippingForm, state: e.target.value });
                      if (hasExistingShipping) setShippingModified(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.postalCode}
                    onChange={(e) => {
                      setShippingForm({ ...shippingForm, postalCode: e.target.value });
                      if (hasExistingShipping) setShippingModified(true);
                    }}
                    placeholder={
                      shippingForm.country === "USA" ? "12345" :
                      shippingForm.country === "Canada" ? "A1A 1A1" :
                      "Postal Code"
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingForm.phone}
                    onChange={(e) => {
                      setShippingForm({ ...shippingForm, phone: e.target.value });
                      if (hasExistingShipping) setShippingModified(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentForm.cardHolderName}
                    onChange={(e) => {
                      setPaymentForm({ ...paymentForm, cardHolderName: e.target.value });
                      if (hasExistingPayment) setPaymentModified(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={paymentForm.cardNumber}
                    onChange={(e) => {
                      setPaymentForm({ ...paymentForm, cardNumber: e.target.value });
                      if (hasExistingPayment) setPaymentModified(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Month *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MM"
                    maxLength={2}
                    value={paymentForm.expiryMonth}
                    onChange={(e) => {
                      setPaymentForm({ ...paymentForm, expiryMonth: e.target.value });
                      if (hasExistingPayment) setPaymentModified(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="YYYY"
                    maxLength={4}
                    value={paymentForm.expiryYear}
                    onChange={(e) => {
                      setPaymentForm({ ...paymentForm, expiryYear: e.target.value });
                      if (hasExistingPayment) setPaymentModified(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    maxLength={4}
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * This is a demo site. No real payment processing occurs. Do not enter real payment information.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {activeCart.map((item) => {
                  if (!item.product) return null;
                  // Use product ID for both cases (guest has productId, auth has _id but we can use product._id)
                  const itemKey = item.product._id;
                  return (
                    <div key={itemKey} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          ${((item.product.price * item.quantity) / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
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
                type="submit"
                disabled={isProcessing}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>

              {isGuest && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Guest checkout • Create an account to track orders
                </p>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Save to Profile Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {hasExistingShipping || hasExistingPayment ? "Save Changes?" : "Save Information?"}
            </h3>
            <p className="text-gray-600 mb-6">
              {hasExistingShipping || hasExistingPayment
                ? "You've made changes to your shipping or payment information. Would you like to save these changes to your profile?"
                : "Would you like to save this shipping and payment information to your profile for faster checkout next time?"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSaveToProfile(false);
                  setShowSaveModal(false);
                  processOrder();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Just This Order
              </button>
              <button
                onClick={() => {
                  setSaveToProfile(true);
                  setShowSaveModal(false);
                  processOrder();
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save to Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
