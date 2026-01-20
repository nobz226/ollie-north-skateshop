"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import Header from "../Header";
import Footer from "../Footer";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Category and Subcategory are LOCKED from URL - these determine what products to show
  const lockedCategory = searchParams.get("category") || "";
  const lockedSubcategory = searchParams.get("subcategory") || "";
  
  // These are the user-controlled filters
  const urlProductType = searchParams.get("productType") || "";
  const urlSize = searchParams.get("size") || "";

  const products = useQuery(api.products.list);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductType, setSelectedProductType] = useState(urlProductType);
  const [selectedSize, setSelectedSize] = useState(urlSize);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // DEBUG: Log URL parameters and product data
  useEffect(() => {
    console.log('=== DEBUG INFO ===');
    console.log('URL - lockedCategory:', lockedCategory);
    console.log('URL - lockedSubcategory:', lockedSubcategory);
    console.log('Total products loaded:', products?.length);
    
    if (products && products.length > 0) {
      // Show unique categories and subcategories in database
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      const uniqueSubcategories = [...new Set(products.map(p => p.subcategory))];
      console.log('Available categories in DB:', uniqueCategories);
      console.log('Available subcategories in DB:', uniqueSubcategories);
    }
  }, [lockedCategory, lockedSubcategory, products]);

  // Use useEffect instead of useMemo for side effects (per copilot-instructions.md)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedProductType, selectedSize, priceRange]);

  // Sync URL params to state when they change
  useEffect(() => {
    setSelectedProductType(urlProductType);
    setSelectedSize(urlSize);
  }, [urlProductType, urlSize]);

  // Update URL when filters change (always preserve locked category/subcategory)
  useEffect(() => {
    const params = new URLSearchParams();
    if (lockedCategory) params.set("category", lockedCategory);
    if (lockedSubcategory) params.set("subcategory", lockedSubcategory);
    if (selectedProductType) params.set("productType", selectedProductType);
    if (selectedSize) params.set("size", selectedSize);
    
    const newUrl = params.toString() ? `/products?${params.toString()}` : "/products";
    router.replace(newUrl, { scroll: false });
  }, [lockedCategory, lockedSubcategory, selectedProductType, selectedSize, router]);

  // Get available filters based on locked category/subcategory
  const { productTypes, sizes } = useMemo(() => {
    if (!products) return { productTypes: [], sizes: [] };

    let filteredProducts = products;

    // ALWAYS filter by locked category if it exists (case-insensitive)
    if (lockedCategory) {
      filteredProducts = filteredProducts.filter((p) => 
        p.category.toLowerCase() === lockedCategory.toLowerCase()
      );
    }

    // ALWAYS filter by locked subcategory if it exists (case-insensitive)
    if (lockedSubcategory) {
      filteredProducts = filteredProducts.filter((p) => 
        p.subcategory.toLowerCase() === lockedSubcategory.toLowerCase()
      );
    }

    console.log('Filtered products after category/subcategory:', filteredProducts.length);

    // Get available product types for this category/subcategory
    const availableProductTypes = Array.from(
      new Set(filteredProducts.map((p) => p.productType))
    ).sort();

    console.log('Available product types:', availableProductTypes);

    // Filter further by selected product type to get sizes
    if (selectedProductType) {
      filteredProducts = filteredProducts.filter((p) => p.productType === selectedProductType);
    }

    const availableSizes = Array.from(
      new Set(filteredProducts.map((p) => p.size).filter((s): s is string => !!s))
    ).sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

    return {
      productTypes: availableProductTypes,
      sizes: availableSizes,
    };
  }, [products, lockedCategory, lockedSubcategory, selectedProductType]);

  // Reset dependent filters when they become invalid
  useEffect(() => {
    if (selectedProductType && !productTypes.includes(selectedProductType)) {
      setSelectedProductType("");
    }
  }, [productTypes, selectedProductType]);

  useEffect(() => {
    if (selectedSize && !sizes.includes(selectedSize)) {
      setSelectedSize("");
    }
  }, [sizes, selectedSize]);

  // Filter products - ALWAYS respect locked category/subcategory (case-insensitive)
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // LOCKED filters - these ALWAYS apply when present in URL (case-insensitive)
      const matchesCategory =
        lockedCategory === "" || product.category.toLowerCase() === lockedCategory.toLowerCase();

      const matchesSubcategory =
        lockedSubcategory === "" || product.subcategory.toLowerCase() === lockedSubcategory.toLowerCase();

      // User-controlled filters
      const matchesProductType =
        selectedProductType === "" || product.productType === selectedProductType;

      const matchesSize =
        selectedSize === "" || product.size === selectedSize;

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesProductType &&
        matchesSize &&
        matchesPrice
      );
    });
  }, [products, searchQuery, lockedCategory, lockedSubcategory, selectedProductType, selectedSize, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedProductType("");
    setSelectedSize("");
    setPriceRange([0, 20000]);
    setCurrentPage(1);
    // DO NOT reset locked category/subcategory - they come from URL
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedProductType !== "" ||
    selectedSize !== "" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 20000;

  // Dynamic page title shows most specific level
  const pageTitle = selectedProductType || lockedSubcategory || lockedCategory || "ALL PRODUCTS";

  // Determine if we're on a filtered page (category or subcategory locked)
  const isFilteredPage = Boolean(lockedCategory || lockedSubcategory);

  if (!products) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Loading products...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-black text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{pageTitle.toUpperCase()}</h1>
            <p className="text-gray-400">Find your perfect setup</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-gray-50 p-6 sticky top-20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">FILTERS</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">SEARCH</label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>

                {/* Product Type Filter - Show when on filtered page */}
                {isFilteredPage && (
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">PRODUCT TYPE</label>
                    <select
                      value={selectedProductType}
                      onChange={(e) => setSelectedProductType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                    >
                      <option value="">All Types</option>
                      {productTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Size Filter - Show when product type is selected */}
                {isFilteredPage && selectedProductType !== "" && (
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">SIZE</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                    >
                      <option value="">All Sizes</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price Range - Always show */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">
                    PRICE RANGE: ${(priceRange[0] / 100).toFixed(0)} - ${(priceRange[1] / 100).toFixed(0)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-grow">
              {/* Results Info */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Showing {filteredProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </p>
              </div>

              {/* Products */}
              {currentProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500 mb-4">No products found</p>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {currentProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 border ${
                            currentPage === page
                              ? "bg-black text-white border-black"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

