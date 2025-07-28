import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiTrash2,
  FiLock,
  FiUnlock,
  FiPlus,
  FiEdit,
  FiImage,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    image2: "",
    blocked: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://e-commerce-witm.onrender.com/api/admin/getProduct"
        );
        setProducts(res.data.product);
      } catch (err) {
        toast.error("Error fetching products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!form.name || !form.price || !form.stock || !form.image || !form.image2) {
      toast.warning("Please fill all fields");
      return;
    }

    setIsAdding(true);
    try {
      const res = await axios.post(
        "https://e-commerce-witm.onrender.com/api/admin/addproduct",
        form
      );
      setProducts([...products, res.data]);
      setForm({ name: "", price: "", stock: "", image: "", image2: "", blocked: false });
      toast.success("Product added successfully");
    } catch (err) {
      toast.error("Error adding product");
      console.error("Error adding product:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditProduct = async () => {
    if (!form.name || !form.price || !form.stock || !form.image || !form.image2) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      const res = await axios.patch(
        `https://e-commerce-witm.onrender.com/api/admin/updateproduct/${editingId}`,
        form
      );
      setProducts(products.map((p) => (p._id === editingId ? res.data : p)));
      setForm({ name: "", price: "", stock: "", image: "", image2: "", blocked: false });
      setEditingId(null);
      toast.success("Product updated successfully");
    } catch (err) {
      toast.error("Error updating product");
      console.error("Error updating product:", err);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`https://e-commerce-witm.onrender.com/api/admin/deleteproduct/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Error removing product");
      console.error("Error removing product:", err);
    }
  };

  const handleBlock = async (id, currentStatus) => {
    try {
      await axios.patch(`https://e-commerce-witm.onrender.com/api/admin/blockproduct/${id}`, {
        blocked: !currentStatus,
      });
      setProducts(
        products.map((p) => (p._id === id ? { ...p, blocked: !p.blocked } : p))
      );
      toast.success(
        `Product ${!currentStatus ? "blocked" : "unblocked"} successfully`
      );
    } catch (err) {
      toast.error("Error blocking/unblocking product");
      console.error("Error blocking/unblocking product:", err);
    }
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image,
      image2: product.image2,
      blocked: product.blocked,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setEditingId(null); 
    setForm({ name: "", price: "", stock: "", image: "", image2: "", blocked: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Product Management
          </h1>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="number"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <div className="flex">
                <input
                  className="w-full border border-gray-300 p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={handleChange}
                />
                <button
                  className="bg-gray-200 px-3 rounded-r-lg flex items-center justify-center"
                  onClick={() => {
                    const url = prompt("Enter image URL:");
                    if (url) setForm({ ...form, image: url });
                  }}
                >
                  <FiImage className="text-gray-600" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL 2
              </label>
              <div className="flex">
                <input
                  className="w-full border border-gray-300 p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="text"
                  name="image2"
                  placeholder="Image URL"
                  value={form.image2}
                  onChange={handleChange}
                />
                <button
                  className="bg-gray-200 px-3 rounded-r-lg flex items-center justify-center"
                  onClick={() => {
                    const url = prompt("Enter image URL:");
                    if (url) setForm({ ...form, image2: url });
                  }}
                >
                  <FiImage className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            {editingId ? (
              <>
                <button
                  className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-2 rounded-lg flex items-center"
                  onClick={handleEditProduct}
                >
                  <FiEdit className="mr-2" /> Update Product
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 transition text-gray-800 font-semibold px-6 py-2 rounded-lg"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-2 rounded-lg flex items-center"
                onClick={handleAddProduct}
                disabled={isAdding}
              >
                {isAdding ? (
                  "Adding..."
                ) : (
                  <>
                    <FiPlus className="mr-2" /> Add Product
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">
              No products found. Add your first product!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">
                All Products
              </h2>
              <p className="text-gray-500">{products.length} products</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
                    product.blocked
                      ? "opacity-70 border-l-4 border-red-500"
                      : "border-l-4 border-green-500"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <FiImage size={48} />
                      </div>
                    )}
                    {product.blocked && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Blocked
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                      {product.name}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>${product.price}</span>
                      <span>{product.stock} in stock</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => startEditing(product)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md text-sm flex items-center justify-center"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 py-1 px-3 rounded-md text-sm flex items-center justify-center"
                      >
                        <FiTrash2 className="mr-1" />
                      </button>
                      <button
                        onClick={() =>
                          handleBlock(product._id, product.blocked)
                        }
                        className={`${
                          product.blocked
                            ? "bg-green-100 hover:bg-green-200 text-green-600"
                            : "bg-red-100 hover:bg-red-200 text-red-600"
                        } py-1 px-3 rounded-md text-sm flex items-center justify-center`}
                      >
                        {product.blocked ? (
                          <FiUnlock className="mr-1" />
                        ) : (
                          <FiLock className="mr-1" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
