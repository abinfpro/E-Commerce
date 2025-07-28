import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Eye } from "lucide-react"; // Optional: install lucide-react for modern icons

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { 
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://e-commerce-witm.onrender.com/api/auth/getproduct");
        setProducts(res.data.product);
      } catch (err) {
        toast.error("Failed to load products");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="p-8 text-center text-lg">Loading products...</div>;

  return (
    <div>
<Header/>
    <div className="bg-gray-50 min-h-screen py-[60px] px-4 sm:px-6 lg:px-12">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        Explore All Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {products.map((product) => (
          <div
            key={product._id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 relative"
          >
            <div className="relative w-full h-60 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />

              <div
                onClick={() => navigate(`/productdetails/${product._id}`)}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-black hover:text-white transition cursor-pointer"
              >
                <Eye className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {product.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
              <p className="text-lg font-bold text-green-600 mt-2">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
<Footer/>
    </div>
  );
}
