import React from "react";
import ProductCard from "./Productcard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const Offerpage = () => {
    const navigate = useNavigate();
  const img =
    "https://static.wixstatic.com/media/c837a6_85f98ee8e54f46219d6accebd1eac92a~mv2.jpg/v1/fill/w_1901,h_1026,al_t,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_85f98ee8e54f46219d6accebd1eac92a~mv2.jpg";

  return (
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
          <h1 className="font-bold text-[70px] leading-tight text-black drop-shadow-md">
            20% Off Kids Styles
          </h1>

          <p className="mt-2 text-[20px] font-normal text-black drop-shadow-sm">
            Exclusive, one-time offer
          </p>

          <button className="mt-6 px-6 py-2 border border-black rounded-full text-black text-sm font-medium hover:bg-black hover:text-white transition"
           onClick={() => navigate("/all-products")}>
            SHOP NOW
          </button>
        </motion.div>
      </div>

      {/* Product Card */}
      <div className="absolute bottom-25 right-[60px]">
        <ProductCard
          image1="https://static.wixstatic.com/media/c837a6_32a2954cbab5468d858dad804c211245~mv2.jpg/v1/fill/w_434,h_325,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_32a2954cbab5468d858dad804c211245~mv2.jpg"
          image2="https://static.wixstatic.com/media/c837a6_936329eced864c0abedbf89844390c72~mv2.jpg/v1/fill/w_1901,h_738,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_936329eced864c0abedbf89844390c72~mv2.jpg"
          name="CLASSIC COMFORT"
          price="$90.00"
          offerPrice="$72.00"
        />
      </div>
    </section>
  );
};

export default Offerpage;
