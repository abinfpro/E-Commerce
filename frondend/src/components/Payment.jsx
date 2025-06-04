import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Home, Check } from "lucide-react";
import Header from "./Header";
import { useUser } from "./Usercontext";
import { toast } from "react-hot-toast";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function PaymentForm() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("");
  const location = useLocation();
  const { totalPrice, cartItems } = location.state || {};
  const [address, setAddress] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [formData, setFormData] = useState({
    streetAddress: "",
    aptSuite: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    sameAsShipping: true,
  });

  // Order summary calculations
  const subtotal = totalPrice || 0;
  const shipping = 4;
  const tax = 8;
  const finalTotal = (subtotal + shipping + tax).toFixed(2);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/address/${user._id}`
        );
        setAddress(res.data.address);
        // console.log(res.data.address, "fetched data");
      } catch (error) {
        console.error("Error fetching Address:", error);
      }
    };

    if (user?._id) {
      fetchUserAddress();
    }
  }, [user?._id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (activeTab === "address") {
      return (
        formData.streetAddress &&
        formData.city &&
        formData.state &&
        formData.zipCode &&
        formData.country
      );
    }
    return true; // For payment tab, validation is handled by Razorpay
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill all required fields correctly.");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/address/${user._id}`,
        formData
      );
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      setAddress(res.data.address);
      setFormData({
        ...formData,
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      });
      setActiveTab("");
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address");
    }
  };

  const handleRazorpayPayment = async () => {
    if (!selectedAddressId) {
      alert("Please select an address before proceeding to payment.");
      return;
    }

    const res = await loadRazorpayScript();

    const orderResponse = await axios.post(
      "http://localhost:5000/api/auth/payment",
      {
        amount: finalTotal,
        userId: user._id,
      }
    );

    const order = await axios.post("http://localhost:5000/api/auth/addorder", {
      selectedAddressId,
      cartItems,
      user,
      totalPrice,
    });

    const { id: orderId, amount, currency } = orderResponse.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency,
      name: "Shoes",
      description: "Order Payment",
      image:
        "https://tse1.mm.bing.net/th?id=OIP.5rYnnbIdQhdKPoDnYjGn1QHaE8&pid=Api&P=0&h=180",
      order_id: orderId,
      handler: async function (response) {
        try {
          await axios.post("http://localhost:5000/api/auth/verify", {
            userId: user._id,
            cartItems,
            address: selectedAddressId,
            finalTotal,
            paymentId: response.razorpay_payment_id,
          });

          if (verificationResponse.data.success) {
            alert("Payment successful!");

            // const order = await axios.post(
            //   "http://localhost:5000/api/auth/addorder",
            //   {
            //     selectedAddressId,
            //     cartItems,
            //     user,
            //     totalPrice,
            //   }
            // );

            // Redirect or UI update
          } else {
            alert("Payment verification failed!");
          }
        } catch (err) {
          console.error(err);
          toast.error("Order failed after payment");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: {
        color: "#3399CC",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
      <Header />
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 p-4">
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        </div>

        <div className="flex">
          {activeTab === "" || activeTab === "address" ? (
            <button
              className={`flex items-center px-6 py-3 ${
                activeTab === "address"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("address")}
            >
              <Home className="w-5 h-5 mr-2" />
              <span className="font-medium">Address</span>
            </button>
          ) : null}
          {activeTab === "payment" ? (
            <button
              className={`flex items-center px-6 py-3 ${
                activeTab === "payment"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("payment")}
            >
              <Check className="w-5 h-5 mr-2" />
              <span className="font-medium">Payment</span>
            </button>
          ) : null}
        </div>

        {address.length > 0 ? (
          <div className="space-y-4 p-6">
            {address.map((addr) => (
              <label
                key={addr._id}
                className={`block p-4 border rounded-xl cursor-pointer ${
                  selectedAddressId === addr._id
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="mr-3"
                  value={addr._id}
                  checked={selectedAddressId === addr._id}
                  onChange={() => setSelectedAddressId(addr._id)}
                />
                <span className="font-semibold">{addr.name}</span>
                <p className="text-sm text-gray-600">
                  {addr.address}, {addr.city}, {addr.state}, {addr.country},{" "}
                  {addr.pin}
                </p>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm p-6">
            No saved address found. Please add one below.
          </p>
        )}

        {activeTab !== "payment" && (
          <div className="flex justify-between items-center py-3 px-6">
            <button
              className="w-full max-w-xs bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              onClick={() => setActiveTab("address")}
            >
              Add Address
            </button>
            {selectedAddressId && (
              <button
                onClick={() => setActiveTab("payment")}
                className="w-full max-w-xs bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Next: Payment Method
              </button>
            )}
          </div>
        )}

        {activeTab === "address" && (
          <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Billing Address
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address*
              </label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City*
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province*
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP/Postal Code*
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country*
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                </select>
              </div>
            </div>

            <div className="flex pt-4 space-x-4">
              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleSubmit}
              >
                Save Address
              </button>
            </div>
          </div>
        )}

        {activeTab === "payment" && (
          <div className="space-y-6 p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Payment Method
            </h2>
            <div className="p-4 border rounded-lg flex flex-col items-center justify-center space-y-2">
              <img
                src="https://cdn.razorpay.com/logo.png"
                alt="Razorpay"
                className="h-8"
              />
              <span className="text-sm font-medium">
                Pay securely with Razorpay
              </span>
            </div>

            <div className="pt-4">
              <button
                onClick={handleRazorpayPayment}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                <Check className="w-5 h-5 mr-2" />
                Proceed to Pay ${finalTotal}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t p-6">
          <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between text-sm font-medium">
              <p className="text-gray-700">Subtotal</p>
              <p className="text-gray-900">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm font-medium mt-1">
              <p className="text-gray-700">Shipping</p>
              <p className="text-gray-900">${shipping.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm font-medium mt-1">
              <p className="text-gray-700">Tax</p>
              <p className="text-gray-900">${tax.toFixed(2)}</p>
            </div>
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
              <p className="text-base font-medium text-gray-900">Total</p>
              <p className="text-base font-bold text-gray-900">${finalTotal}</p>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center">
              <Check className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Success!</h3>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Address saved successfully
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
