import ProductCard from "./Productcard";
import { motion } from "framer-motion";
import Product from "./Productlist";
import Offerpage from "./Offerpage";
import Mainproduct from "./Mainproduct";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
// import Header from "./Header";

function Homepage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://e-commerce-witm.onrender.com/api/auth/getproduct"
        );
        setProducts(res.data.product);
      } catch (err) {
        toast.error("Error fetching products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const img =
    "https://static.wixstatic.com/media/c837a6_977fd116499b43ae8f309afaf18cbade~mv2.jpg/v1/fill/w_1901,h_1050,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_977fd116499b43ae8f309afaf18cbade~mv2.jpg";

  return (
    <div>
      <Header />
      <section
        className="h-screen bg-fixed bg-center bg-cover flex items-center justify-center relative"
        style={{ backgroundImage: `url(${img})` }}
      >
        {/* Curtain Wrapper (mask) */}
        <div className="absolute top-40 left-10 overflow-hidden h-[200px] w-fit">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: -20 }}
            transition={{ type: "tween", ease: "easeOut", duration: 2 }}
          >
            <h1 className="font-bold text-[90px] leading-tight text-black drop-shadow-md">
              Step-up Your Stride
            </h1>

            <p className="mt-2 text-[20px] font-normal text-black drop-shadow-sm">
              Premium Athletic Footwear
            </p>

            <button
              className="mt-6 px-6 py-2 border border-black rounded-full text-black text-sm font-medium hover:bg-black hover:text-white transition"
              onClick={() => navigate("/all-products")}
            >
              SHOP NOW
            </button>
          </motion.div>
        </div>

        {/* Product Card */}
        <div className="absolute bottom-25 right-[60px]">
          <ProductCard
            image1="https://static.wixstatic.com/media/c837a6_60f18667fe64458eb7ab6a131d3354d4~mv2.jpg/v1/fill/w_434,h_325,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_60f18667fe64458eb7ab6a131d3354d4~mv2.jpg"
            image2="https://static.wixstatic.com/media/c837a6_f4b16c06d8b5449c954a72eb34be2b4b~mv2.jpg/v1/fill/w_1901,h_738,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_f4b16c06d8b5449c954a72eb34be2b4b~mv2.jpg"
            name="MARATHON MASTER"
            price="$160.00"
            offerPrice="$140.00"
          />
        </div>
      </section>
      <Product />
      <Offerpage />
      <Mainproduct />
      <Footer />
    </div>
  );
}

export default Homepage;
