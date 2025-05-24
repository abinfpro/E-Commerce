// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import {
//   CreditCard,
//   Home,
//   Check,
//   Smartphone,
//   Landmark,
//   Wallet,
//   CreditCard as CardIcon,
// } from "lucide-react";
// import Header from "./Header";
// import { useUser } from "./Usercontext";

// export default function PaymentForm() {
//   const { user } = useUser();
//   const [activeTab, setActiveTab] = useState("");
//   const location = useLocation();
//   const { totalPrice, selectedAddress } = location.state || {};
//   const [data, setData] = useState("");
//   const [address, setAddress] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedAddressId, setSelectedAddressId] = useState("");
//   const [formData, setFormData] = useState({
//     paymentMethod: "card",
//     cardNumber: "",
//     cardName: "",
//     expiryDate: "",
//     cvv: "",
//     upiId: "",
//     bankName: "",
//     walletProvider: "",
//     walletNumber: "",
//     streetAddress: "",
//     aptSuite: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     country: "United States",
//     sameAsShipping: true,
//   });

//   // Order summary calculations
//   const subtotal = totalPrice || 0;
//   const shipping = 4.99;
//   const tax = 8.32;
//   const finalTotal = (subtotal + shipping + tax).toFixed(2);

//   useEffect(() => {
//     const fetchUserAddress = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/auth/address/${user._id}`
//         );
//         setAddress(res.data.address);
//         console.log(res.data.address, "fetched data");
//       } catch (error) {
//         console.error("Error fetching Address:", error);
//       }
//     };

//     if (user?._id) {
//       fetchUserAddress();
//     }
//   }, [user?._id]); // Removed address from dependency array to prevent infinite loop

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const formatCardNumber = (value) => {
//     const digits = value.replace(/\D/g, "");
//     const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
//     return formatted.substring(0, 19);
//   };

//   const handleCardNumberChange = (e) => {
//     const formatted = formatCardNumber(e.target.value);
//     setFormData((prevData) => ({
//       ...prevData,
//       cardNumber: formatted,
//     }));
//   };

//   const handleExpiryDateChange = (e) => {
//     let value = e.target.value.replace(/\D/g, "");
//     if (value.length > 2) {
//       value = value.substring(0, 2) + "/" + value.substring(2, 4);
//     }
//     setFormData((prevData) => ({
//       ...prevData,
//       expiryDate: value.substring(0, 5),
//     }));
//   };

//   const validateForm = () => {
//     if (activeTab === "address") {
//       return (
//         formData.streetAddress &&
//         formData.city &&
//         formData.state &&
//         formData.zipCode &&
//         formData.country
//       );
//     }
//     if (activeTab === "payment") {
//       if (formData.paymentMethod === "card") {
//         return (
//           formData.cardNumber.length === 19 &&
//           formData.cardName &&
//           formData.expiryDate.length === 5 &&
//           formData.cvv.length >= 3
//         );
//       }
//       if (formData.paymentMethod === "upi") {
//         return formData.upiId.includes("@");
//       }
//       if (formData.paymentMethod === "netbanking") {
//         return formData.bankName;
//       }
//       if (formData.paymentMethod === "wallet") {
//         return formData.walletProvider && formData.walletNumber;
//       }
//     }
//     return false;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       alert("Please fill all required fields correctly.");
//       return;
//     }
//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/auth/address/${user._id}`,
//         formData
//       );
//       setShowPopup(true);
//       setTimeout(() => setShowPopup(false), 3000);
//       setData(res.data.address);
//       setFormData({
//         ...formData,
//         streetAddress: "",
//         city: "",
//         state: "",
//         zipCode: "",
//       });
//       setActiveTab("");
//     } catch (error) {
//       console.error("Error saving address:", error);
//       alert("Failed to save address");
//     }
//   };

//   const setPaymentMethod = (method) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       paymentMethod: method,
//     }));
//   };

//   return (
//     <>
//       <Header />
//       <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="bg-gray-50 p-4">
//           <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
//         </div>

//         <div className="flex">
//           {activeTab === "" || activeTab === "address" ? (
//             <button
//               className={`flex items-center px-6 py-3 ${
//                 activeTab === "address"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500"
//               }`}
//               onClick={() => setActiveTab("address")}
//             >
//               <Home className="w-5 h-5 mr-2" />
//               <span className="font-medium">Address</span>
//             </button>
//           ) : null}
//           {activeTab === "payment" ? (
//             <button
//               className={`flex items-center px-6 py-3 ${
//                 activeTab === "payment"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500"
//               }`}
//               onClick={() => setActiveTab("payment")}
//             >
//               <CreditCard className="w-5 h-5 mr-2" />
//               <span className="font-medium">Payment</span>
//             </button>
//           ) : null}
//         </div>

//         {address.length > 0 ? (
//           <div className="space-y-4 p-6">
//             {address.map((addr) => (
//               <label
//                 key={addr._id}
//                 className={`block p-4 border rounded-xl cursor-pointer ${
//                   selectedAddressId === addr._id
//                     ? "border-indigo-600 bg-indigo-50"
//                     : "border-gray-300"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="address"
//                   className="mr-3"
//                   value={addr._id}
//                   checked={selectedAddressId === addr._id}
//                   onChange={() => setSelectedAddressId(addr._id)}
//                 />
//                 <span className="font-semibold">{addr.name}</span>
//                 <p className="text-sm text-gray-600">
//                   {addr.address}, {addr.city}, {addr.state}, {addr.country},{" "}
//                   {addr.pin}
//                 </p>
//               </label>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-600 text-sm p-6">
//             No saved address found. Please add one below.
//           </p>
//         )}
//         {activeTab !== "payment" && (
//           <div className="flex justify-between items-center py-3 px-6">
//             <button
//               className="w-full max-w-xs bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//               onClick={() => setActiveTab("address")}
//             >
//               Add Address
//             </button>
//             {selectedAddressId && (
//               <button
//                 onClick={() => setActiveTab("payment")}
//                 className="w-full max-w-xs bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//               >
//                 Next: Payment Method
//               </button>
//             )}
//           </div>
//         )}

//         {activeTab === "address" && (
//           <div className="space-y-6 p-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-semibold text-gray-800">
//                 Billing Address
//               </h2>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Street Address*
//               </label>
//               <input
//                 type="text"
//                 name="streetAddress"
//                 value={formData.streetAddress}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Address"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   City*
//                 </label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="New York"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   State/Province*
//                 </label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="NY"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   ZIP/Postal Code*
//                 </label>
//                 <input
//                   type="text"
//                   name="zipCode"
//                   value={formData.zipCode}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="10001"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Country*
//                 </label>
//                 <select
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="United States">United States</option>
//                   <option value="Canada">Canada</option>
//                   <option value="United Kingdom">United Kingdom</option>
//                   <option value="India">India</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex pt-4 space-x-4">
//               <button
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//                 onClick={handleSubmit}
//               >
//                 Save Address
//               </button>
//             </div>
//           </div>
//         )}

//         {activeTab === "payment" && (
//           <div className="space-y-6 p-6">
//             <h2 className="text-xl font-semibold text-gray-800">
//               Payment Method
//             </h2>
//             <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod("card")}
//                 className={`p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
//                   formData.paymentMethod === "card"
//                     ? "border-blue-500 bg-blue-50 text-blue-700"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//               >
//                 <CardIcon className="w-6 h-6" />
//                 <span className="text-sm font-medium">Credit/Debit Card</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod("upi")}
//                 className={`p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
//                   formData.paymentMethod === "upi"
//                     ? "border-blue-500 bg-blue-50 text-blue-700"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//               >
//                 <Smartphone className="w-6 h-6" />
//                 <span className="text-sm font-medium">UPI</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod("netbanking")}
//                 className={`p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
//                   formData.paymentMethod === "netbanking"
//                     ? "border-blue-500 bg-blue-50 text-blue-700"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//               >
//                 <Landmark className="w-6 h-6" />
//                 <span className="text-sm font-medium">Net Banking</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod("wallet")}
//                 className={`p-4 border rounded-lg flex flex-col items-center justify-center space-y-2 transition-all ${
//                   formData.paymentMethod === "wallet"
//                     ? "border-blue-500 bg-blue-50 text-blue-700"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//               >
//                 <Wallet className="w-6 h-6" />
//                 <span className="text-sm font-medium">Wallet</span>
//               </button>
//             </div>

//             {formData.paymentMethod === "card" && (
//               <div className="space-y-4 mt-6">
//                 <h3 className="text-lg font-medium text-gray-800">
//                   Card Details
//                 </h3>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Card Number*
//                   </label>
//                   <input
//                     type="text"
//                     name="cardNumber"
//                     value={formData.cardNumber}
//                     onChange={handleCardNumberChange}
//                     placeholder="1234 5678 9012 3456"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     maxLength={19}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Cardholder Name*
//                   </label>
//                   <input
//                     type="text"
//                     name="cardName"
//                     value={formData.cardName}
//                     onChange={handleChange}
//                     placeholder="John Smith"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Expiry Date*
//                     </label>
//                     <input
//                       type="text"
//                       name="expiryDate"
//                       value={formData.expiryDate}
//                       onChange={handleExpiryDateChange}
//                       placeholder="MM/YY"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       maxLength={5}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       CVV*
//                     </label>
//                     <input
//                       type="text"
//                       name="cvv"
//                       value={formData.cvv}
//                       onChange={handleChange}
//                       placeholder="123"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       maxLength={4}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {formData.paymentMethod === "upi" && (
//               <div className="space-y-4 mt-6">
//                 <h3 className="text-lg font-medium text-gray-800">
//                   UPI Details
//                 </h3>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     UPI ID*
//                   </label>
//                   <input
//                     type="text"
//                     name="upiId"
//                     value={formData.upiId}
//                     onChange={handleChange}
//                     placeholder="yourname@upi"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             )}

//             {formData.paymentMethod === "netbanking" && (
//               <div className="space-y-4 mt-6">
//                 <h3 className="text-lg font-medium text-gray-800">
//                   Net Banking
//                 </h3>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Select Bank*
//                   </label>
//                   <select
//                     name="bankName"
//                     value={formData.bankName}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select your bank</option>
//                     <option value="sbi">State Bank of India</option>
//                     <option value="hdfc">HDFC Bank</option>
//                     <option value="icici">ICICI Bank</option>
//                     <option value="axis">Axis Bank</option>
//                   </select>
//                 </div>
//               </div>
//             )}

//             {formData.paymentMethod === "wallet" && (
//               <div className="space-y-4 mt-6">
//                 <h3 className="text-lg font-medium text-gray-800">
//                   Wallet Payment
//                 </h3>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Select Wallet*
//                   </label>
//                   <select
//                     name="walletProvider"
//                     value={formData.walletProvider}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select your wallet</option>
//                     <option value="paytm">Paytm</option>
//                     <option value="phonepe">PhonePe</option>
//                     <option value="googlepay">Google Pay</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Mobile Number / Email*
//                   </label>
//                   <input
//                     type="text"
//                     name="walletNumber"
//                     value={formData.walletNumber}
//                     onChange={handleChange}
//                     placeholder="Enter registered mobile or email"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="pt-4">
//               <button
//                 onClick={validateForm}
//                 className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
//               >
//                 <Check className="w-5 h-5 mr-2" />
//                 Complete Payment
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="mt-8 pt-6 border-t p-6">
//           <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
//           <div className="mt-4 bg-gray-50 p-4 rounded-md">
//             <div className="flex justify-between text-sm font-medium">
//               <p className="text-gray-700">Subtotal</p>
//               <p className="text-gray-900">${subtotal.toFixed(2)}</p>
//             </div>
//             <div className="flex justify-between text-sm font-medium mt-1">
//               <p className="text-gray-700">Shipping</p>
//               <p className="text-gray-900">${shipping.toFixed(2)}</p>
//             </div>
//             <div className="flex justify-between text-sm font-medium mt-1">
//               <p className="text-gray-700">Tax</p>
//               <p className="text-gray-900">${tax.toFixed(2)}</p>
//             </div>
//             <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
//               <p className="text-base font-medium text-gray-900">Total</p>
//               <p className="text-base font-bold text-gray-900">${finalTotal}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showPopup && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
//             <div className="flex items-center">
//               <Check className="w-6 h-6 text-green-500 mr-2" />
//               <h3 className="text-lg font-medium text-gray-900">Success!</h3>
//             </div>
//             <div className="mt-2">
//               <p className="text-sm text-gray-500">
//                 Address saved successfully
//               </p>
//             </div>
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={() => setShowPopup(false)}
//                 className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }






import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Home, Check } from "lucide-react";
import Header from "./Header";
import { useUser } from "./Usercontext";

export default function PaymentForm() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("");
  const location = useLocation();
  const { totalPrice,cartItems } = location.state || {};
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
console.log(cartItems);
console.log(totalPrice);


  // Order summary calculations
  const subtotal = totalPrice || 0;
  const shipping = 4.99;
  const tax = 8.32;
  const finalTotal = (subtotal + shipping + tax).toFixed(2);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/address/${user._id}`
        );
        setAddress(res.data.address);
        console.log(res.data.address, "fetched data");
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

    try {
      // Create order on backend
      const orderResponse = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: Math.round(finalTotal * 100), // Convert to paise
          currency: "INR",
          userId: user._id,
        }
      );

      const { orderId, amount, currency } = orderResponse.data;

      // Razorpay options
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
        amount: amount,
        currency: currency,
        name: "Your Company Name",
        description: "Order Payment",
        image: "https://your-logo-url.com/logo.png", // Replace with your logo URL
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verificationResponse = await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verificationResponse.data.success) {
              alert("Payment successful!");
              // TODO: Redirect to order confirmation page or update UI
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      // Initialize Razorpay
      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(`Payment failed: ${response.error.description}`);
        console.error("Payment failed:", response.error);
      });
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment");
    }
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