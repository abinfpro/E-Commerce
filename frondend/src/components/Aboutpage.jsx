import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Header from "./Header";

export default function About() {
  return (
    <div className="bg-white text-gray-800">
<Header/>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center">
        <div className="bg-black/60 absolute inset-0" />
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative text-4xl sm:text-6xl text-white font-bold z-10"
        >
          About Us
        </motion.h1>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
            Our Journey in Footwear
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 text-center max-w-3xl mx-auto">
            Born out of a passion for great design and comfort, our brand is built for the go-getters, dreamers, and sneakerheads. From the streets to the spotlight, we create shoes that speak style, comfort, and durability. Every stitch tells a story — and that story is you.
          </p>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Craftsmanship",
              text: "Every pair is a work of art crafted with precision, passion, and sustainable materials.",
            },
            {
              title: "Innovation",
              text: "We blend cutting-edge tech with timeless design to bring you the best in modern footwear.",
            },
            {
              title: "Community",
              text: "We’re more than a brand — we’re a movement. Built by the people, for the people.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <CheckCircleIcon className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Step Up Your Style?
          </h2>
          <p className="mb-6 text-lg">
            Explore our latest collection and walk the talk in style.
          </p>
          <a
            href="/all-products"
            className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition"
          >
            Browse Products
          </a>
        </motion.div>
      </section>
    </div>
  );
}
