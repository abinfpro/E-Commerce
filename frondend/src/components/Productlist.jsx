import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Productlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/getproduct");
        setProducts(res.data.product);
      } catch (err) {
        toast.error("Error fetching products");
        // console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();  
  }, []);

  const limitedProducts = products.slice(0, 4); // Show only first 5

  return (
    <div className="bg-white">
      <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-10xl lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            BEST SELLERS
          </h2>
          <button
            onClick={() => navigate("/all-products")}
            className="px-4 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
          >
            VIEW ALL
          </button>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {limitedProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/productdetails/${product._id}`)}
              onMouseEnter={() => setIsHovered(product._id)}
              onMouseLeave={() => setIsHovered(null)}
              className="group relative cursor-pointer"
            >
              <img
                alt={product.name}
                src={isHovered === product._id ? product.image : product.image2}
                className="aspect-square w-full rounded-lg object-cover transition duration-300 ease-in-out shadow-sm"
              />
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm font-medium text-gray-600">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
