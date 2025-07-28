import React from "react";
import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "./Usercontext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { setUser } = useUser();

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const validate = () => {
    const newErrors = {};
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await axios.post(
        "https://e-commerce-witm.onrender.com/api/auth/login",
        formData
      );
      alert(res.data.message);

      if (res.status === 200) {
        setUser(res.data.user);
      }
      const user = res.data.user;
      setTimeout(() => {
        if (user.role == "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 100);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Background Image */}
      <img
        src="https://static.wixstatic.com/media/c837a6_6b04b65869124042a744e4d732b75473~mv2.jpg/v1/fill/w_1901,h_1100,al_b,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_6b04b65869124042a744e4d732b75473~mv2.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay */}
      <div className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-lg rounded-xl shadow-lg p-10">
        <h2 className="text-4xl font-bold mb-6 text-center text-black">
          Login your Account
        </h2>

        <form className="space-y-4">
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
            onClick={handleSubmit}
            className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </button>
          <p className="text-sm mt-4 text-center text-black">
            Don't have an account?{" "}
            <NavLink to="/signup">
              <span className="underline font-medium cursor-pointer">
                Signup
              </span>{" "}
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
