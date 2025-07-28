import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../components/Usercontext";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [modal, showModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [approved, setApproved] = useState({});

  const nameRegex = /^[A-Za-z\s]{2,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const validate = () => {
    const newErrors = {};
    if (!nameRegex.test(formData.name)) {
      newErrors.name =
        "Name must contain only letters and spaces (min 2 characters)";
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters, including one number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    const newErrors = { ...errors };
    if (name === "name") {
      if (!value) {
        newErrors.name = "Required";
      } else if (!nameRegex.test(value)) {
        newErrors.name =
          "Name must contain only letters and spaces (min 2 characters)";
      } else {
        delete newErrors.name;
      }
    }
    if (name === "email") {
      if (!value) {
        newErrors.email = "Required";
      } else if (!emailRegex.test(value)) {
        newErrors.email = "Invalid email format";
      } else {
        delete newErrors.email;
      }
    }
    if (name === "password") {
      if (!value) {
        newErrors.password = "Required";
      } else if (!passwordRegex.test(value)) {
        newErrors.password =
          "Password must be at least 6 characters, including one number";
      } else {
        delete newErrors.password;
      }
      if (
        updatedFormData.confirmPassword &&
        updatedFormData.confirmPassword !== value
      ) {
        newErrors.confirmPassword = "Passwords don't match";
      } else {
        delete newErrors.confirmPassword;
      }
    }
    if (name === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Required";
      } else if (value !== updatedFormData.password) {
        newErrors.confirmPassword = "Passwords don't match";
      } else {
        delete newErrors.confirmPassword;
      }
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post(
        "https://e-commerce-witm.onrender.com/api/auth/signup",
        formData
      );
      setApproved(res.data.user);
      alert(res.data.message);
      showModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://e-commerce-witm.onrender.com/api/auth/otp", {
        otp,
        user: approved,
      });
      showModal(false);
      toast.success("Otp Verified");
      setOtp("");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Otp failed");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;

      const res = await axios.post("https://e-commerce-witm.onrender.com/api/auth/google", {
        token,
      });

      alert("Google signup/login success!");
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      alert("Google login failed.");
    }
  };

  return (
    <div>
      <div className="relative min-h-screen flex items-center justify-center bg-black">
        <img
          src="https://static.wixstatic.com/media/c837a6_6b04b65869124042a744e4d732b75473~mv2.jpg/v1/fill/w_1901,h_1100,al_b,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_6b04b65869124042a744e4d732b75473~mv2.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-lg rounded-xl shadow-lg p-10">
          <h2 className="text-4xl font-bold mb-6 text-center text-black">
            Create Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium text-black">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/50 rounded-lg bg-white/20 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-white"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-black">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/50 rounded-lg bg-white/20 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-white"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-black">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-white/50 rounded-lg bg-white/20 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-white"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Sign Up
            </button>

            <div className="text-center mt-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => alert("Google Login Failed")}
              />
            </div>

            <p className="text-sm mt-4 text-center text-black">
              Already have an account?{" "}
              <NavLink to="/login">
                <span className="underline font-medium cursor-pointer">
                  Login
                </span>
              </NavLink>
            </p>
          </form>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={() => {
                showModal(false);
                setOtp("");
              }}
              className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Enter Otp</h3>
            <input
              type="text"
              placeholder="Enter 6 digit otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleOtp}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
