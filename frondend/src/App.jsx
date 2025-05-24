import Homepage from "./components/Homepage";
import SignupPage from "./components/signuppage";
import Login from "./components/loginpage";
import Logout from "./components/Logout";
import AdminDashboard from "./components/Admin";
import ProductDetails from "./components/Productdetails";
import AllProducts from "./components/Viewallproducts";
import Wishlist from "./components/Wishlist";
import About from "./components/Aboutpage";
import Profile from "./components/Profile"
import PaymentForm from "./components/Payment";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartPage from "./components/Cartpage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/payment" element={<PaymentForm/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
