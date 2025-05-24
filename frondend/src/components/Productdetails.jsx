import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Heart, ShoppingCart, Minus, Plus, Star } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { useUser } from "./Usercontext";

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/auth/productdetails/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        toast.error("Error fetching product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async (productId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/cart", {
        userId: user._id,
        productId: productId,
        quantity: quantity,
      });
      console.log("Added to cart:", res.data);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/wishlist",{
        userId: user._id,
        productId: product._id
      })
      setIsWishlisted(!isWishlisted);
      //  setIsWishlisted(wishlistProducts.includes(product._id));
      toast.success(`${product.name} ${!isWishlisted ? "added to" : "removed from"} wishlist`);
    } catch (error) {
       toast.error("Something went wrong");
    console.error(error);
    }
   }

   
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Image Section */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto rounded-xl object-cover shadow-lg"
          />
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-[50px] right-5 p-2 rounded-full border ${
              isWishlisted ? "bg-red-100 text-red-600" : "bg-white"
            } hover:scale-110 transition`}
          >
            <Heart className={`w-6 h-6 ${isWishlisted ? "fill-red-500 stroke-red-500" : ""}`} />
          </button>
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-bold">{product.name}</h2>

          {/* Ratings */}
          {/* <div className="flex items-center space-x-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-gray-700 font-semibold ml-2">4.7 | 10 reviews</span>
          </div> */}

          {/* SKU */}
          {/* <div className="text-gray-600 text-sm">SKU: {product.sku || "003"}</div> */}

          {/* Price */}
          <div className="text-2xl font-bold text-green-700">${product.price}</div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mt-4">
            <span className="font-semibold">Quantity</span>
            <div className="flex items-center border rounded overflow-hidden">
              <button onClick={decrementQuantity} className="px-3 py-1 hover:bg-gray-100">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5">{quantity}</span>
              <button onClick={incrementQuantity} className="px-3 py-1 hover:bg-gray-100">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-4 mt-6">
            <button
              onClick={() => handleAddToCart(product._id)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-black rounded-full font-semibold hover:bg-black hover:text-white transition"
            >
              <ShoppingCart className="w-5 h-5" />
              ADD TO CART
            </button>

            <button
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
