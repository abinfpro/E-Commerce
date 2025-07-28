import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../components/Usercontext";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchWishlist = async () => {        
      try {
        const res = await axios.get(`https://e-commerce-witm.onrender.com/api/auth/wishlist/${user._id}`);        
        setWishlist(res.data);        
      } catch (err) {
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user,wishlist]);

  const removeFromWishlist = async (productId) => {
    try {
    const res=  await axios.patch(`https://e-commerce-witm.onrender.com/api/auth/wishlistremove`, { 
        userId: user._id,
        productId,
      });
      console.log(res);
      
      setWishlist(res.data.wishlist);
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  if (loading) return <div className="text-center text-gray-500 mt-10">Loading wishlist...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      {wishlist?.products.length === 0 ? (
        <div className="text-gray-600">No products in wishlist.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.products.map ((product) => (            
            <div
              key={product._id}
              className="group relative border rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                {/* <p className="text-sm text-gray-500 mt-1">Category: {product.category || "N/A"}</p> */}
                <p className="text-xl font-bold text-green-600 mt-2">₹{product.price}</p>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => navigate(`/productdetails/${product._id}`)}
                    className="text-sm text-white bg-black px-4 py-2 rounded hover:bg-gray-800 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="p-2 rounded-full hover:bg-red-100"
                    title="Remove"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default wishlist;
