import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./Usercontext";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const CartPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/cart/${user._id}`
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchCartItems();
    }
  }, [user]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  const handleRemoveToCart = async (item) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/auth/cart/${item}`
      );
      fetchCartItems();
    } catch (error) {
      setCartItems((prev) => prev.filter((item) => item._id !== item));
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-10">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.productId.image}
                        alt={item.productId.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {item.productId.name}
                        </h3>
                        <p className="text-gray-600">
                          ₹{item.productId.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    {/* Optional Remove Button */}
                    <button
                      onClick={() => handleRemoveToCart(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex justify-between items-center">
                <p className="text-xl font-bold">
                  Total: ₹{totalPrice.toFixed(2)}
                </p>
                <button
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl"
                  onClick={() => navigate("/payment",{state:{totalPrice,cartItems},})}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
