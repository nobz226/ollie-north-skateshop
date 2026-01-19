"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import Header from "../Header";
import Footer from "../Footer";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialSubcategory = searchParams.get("subcategory") || "";

  const products = useQuery(api.products.list);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedProductType, selectedSize, priceRange]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || product.category === selectedCategory;

      const matchesSubcategory =
        selectedSubcategory === "" || product.subcategory.toLowerCase() === selectedSubcategory.toLowerCase();

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
  }, [products, searchQuery, selectedCategory, selectedSubcategory, selectedProductType, selectedSize, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Get unique values for filters
  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, [products]);

  const subcategories = useMemo(() => {
    if (!products) return [];
    const filtered = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;
    return Array.from(new Set(filtered.map((p) => p.subcategory))).sort();
  }, [products, selectedCategory]);

  const productTypes = useMemo(() => {
    if (!products) return [];
    const filtered = selectedSubcategory
      ? products.filter((p) => p.subcategory === selectedSubcategory)
      : products;
    return Array.from(new Set(filtered.map((p) => p.productType))).sort();
  }, [products, selectedSubcategory]);

  const sizes = useMemo(() => {
    if (!products) return [];
    const filtered = selectedProductType
      ? products.filter((p) => p.productType === selectedProductType)
      : products;
    return Array.from(new Set(filtered.map((p) => p.size).filter((s) => s !== undefined))).sort();
  }, [products, selectedProductType]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedProductType("");
    setSelectedSize("");
    setPriceRange([0, 20000]);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "" ||
    selectedSubcategory !== "" ||
    selectedProductType !== "" ||
    selectedSize !== "" ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 20000;

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
            <h1 className="text-4xl md:text-5xl font-bold mb-2">ALL PRODUCTS</h1>
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

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">CATEGORY</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubcategory("");
                      setSelectedProductType("");
                      setSelectedSize("");
                    }}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">TYPE</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => {
                      setSelectedSubcategory(e.target.value);
                      setSelectedProductType("");
                      setSelectedSize("");
                    }}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  >
                    <option value="">All Types</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Type Filter */}
                {productTypes.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">PRODUCT</label>
                    <select
                      value={selectedProductType}
                      onChange={(e) => {
                        setSelectedProductType(e.target.value);
                        setSelectedSize("");
                      }}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                    >
                      <option value="">All Products</option>
                      {productTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Size Filter */}
                {sizes.length > 0 && (
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

                {/* Price Range */}
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
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </p>
              </div>

              {/* Products */}
              {currentProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500 mb-4">No products found</p>
                  <button
                    onClick={resetFilters}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear all filters
                  </button>
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

