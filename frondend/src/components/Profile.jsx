import { useEffect, useState } from "react";
import { User, Mail, Save } from "lucide-react";
import Header from "./Header";
import { useUser } from "./Usercontext";
import axios from "axios";
import { useLocation } from "react-router-dom";


export default function EnhancedSimpleProfile() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
    const location = useLocation();
  const {cartItems } = location.state || {};

  useEffect(() => {
    if (user?._id) {
      axios.get(`http://localhost:5000/api/auth/oder,${user._id}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error("Error fetching orders:", err));
    }
  }, [user]);

  return (
    <>
      <Header />
      <div className="max-w-8xl mx-auto  bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-15 bg-gradient-to-r from-blue-500 to-purple-600"></div>

        <div className="relative pt-6 px-6 pb-12">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              alt="Default Avatar"
              className="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
        </div>

        <div className="bg-white px-8 pt-16 pb-8 rounded-t-3xl -mt-6 shadow-inner">
          <div className="space-y-5">
            {/* Username Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                <User size={16} className="text-gray-400" />
                Username
              </label>
              <input
                type="text"
                value={user?.name || ""}
                disabled
                className="w-full bg-gray-100 cursor-not-allowed border border-gray-200 rounded-lg px-4 py-2.5"
              />
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                <Mail size={16} className="text-gray-400" />
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-gray-100 cursor-not-allowed border border-gray-200 rounded-lg px-4 py-2.5"
              />
            </div>
          </div>

          {/* Order List */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">My Orders</h2>
            {/* {cartItems.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map(order => (
                  <li key={order._id} className="border p-4 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-800">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-600">Total: ₹{order.total}</p>
                    <p className="text-sm text-gray-600">Status: {order.status}</p>
                  </li>
                ))}
              </ul>
            )}  */}
          </div>
        </div>
      </div>
    </>
  );
}
