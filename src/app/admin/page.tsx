"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import ProductForm from "@/components/ProductForm";
import Image from "next/image";

type TabType = "products" | "categories" | "orders";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("products");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-800 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`${
              activeTab === "products"
                ? "border-fen-400 text-fen-300"
                : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Products Management
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`${
              activeTab === "categories"
                ? "border-fen-400 text-fen-300"
                : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Categories & Types
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`${
              activeTab === "orders"
                ? "border-fen-400 text-fen-300"
                : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Order History
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "products" && <ProductsTab />}
      {activeTab === "categories" && <CategoriesTab />}
      {activeTab === "orders" && <OrdersTab />}
    </div>
  );
}

// Products Management Tab
function ProductsTab() {
  const products = useQuery(api.adminProducts.getAllProducts);
  const deleteProduct = useMutation(api.adminProducts.deleteProduct);
  const [editingProduct, setEditingProduct] = useState<Id<"products"> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (productId: Id<"products">) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct({ productId });
    }
  };

  const handleFormSuccess = () => {
    // Form will close itself via onClose
    // Products will auto-update via Convex real-time
  };

  if (!products) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-fen-400"
          />
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="ml-4 px-4 py-2 bg-fen-300 text-bone rounded-md hover:bg-fen-200"
        >
          Add New Product
        </button>
      </div>

      {/* Product Count */}
      <div className="text-sm text-gray-400">
        Showing {filteredProducts?.length || 0} of {products.length} products
      </div>

      {/* Products Table */}
      <div className="bg-vault shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-vault divide-y divide-gray-800">
              {filteredProducts?.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-12 w-12 relative rounded overflow-hidden">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-100">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.subcategory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                    ${(product.price / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-none ${
                        product.inStock
                          ? "bg-green-900 text-green-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingProduct(product._id)}
                      className="text-fen-300 hover:text-fen-100 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-400 hover:text-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {(editingProduct || isCreating) && (
        <ProductForm
          productId={editingProduct || undefined}
          onClose={() => {
            setEditingProduct(null);
            setIsCreating(false);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

// Categories Management Tab
function CategoriesTab() {
  const categories = useQuery(api.adminProducts.getCategories);

  if (!categories) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Categories, subcategories, and product types are automatically created when you add products.
          Use the product form to add new values by selecting &quot;+ Add New&quot; in the dropdowns.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CategoryList title="Categories" items={categories.categories} />
        <CategoryList title="Subcategories" items={categories.subcategories} />
        <CategoryList title="Product Types" items={categories.productTypes} />
      </div>
    </div>
  );
}

function CategoryList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-vault p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-100 mb-4">{title}</h3>
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <li key={item} className="text-sm text-gray-300 py-1 border-b border-gray-900">
            {item}
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mt-4">
        {items.length} {title.toLowerCase()}
      </p>
    </div>
  );
}

// Orders Tab
function OrdersTab() {
  const orders = useQuery(api.adminOrders.getAllOrders);
  const stats = useQuery(api.adminOrders.getOrderStats);
  const users = useQuery(api.adminOrders.getAllUsers);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const filteredOrders = selectedUserId
    ? orders?.filter((order) => order.userId === selectedUserId)
    : orders;

  if (!orders || !stats) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-vault p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
        </div>
        <div className="bg-vault p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-2xl font-bold">${(stats.totalRevenue / 100).toFixed(2)}</div>
        </div>
        <div className="bg-vault p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Avg Order Value</div>
          <div className="text-2xl font-bold">${(stats.averageOrderValue / 100).toFixed(2)}</div>
        </div>
        <div className="bg-vault p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Filter by User</div>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md text-sm"
          >
            <option value="">All Users</option>
            {users?.map((user) => (
              <option key={user._id} value={user._id}>
                {user.clerkUserId} ({user.orderCount} orders)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-vault shadow overflow-hidden rounded-lg">
        {filteredOrders && filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-vault divide-y divide-gray-800">
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user?.clerkUserId || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.items.length} item(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                      ${(order.total / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-none bg-green-900 text-green-200">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No orders found {selectedUserId && "for this user"}
          </div>
        )}
      </div>
    </div>
  );
}