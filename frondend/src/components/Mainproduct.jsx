import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const products = [
  {
    id: 1,
    imageSrc:
      "https://static.wixstatic.com/media/c837a6_7407d6560448416a996712cac8ce5c9c~mv2.jpg",
    button: "PREFORMENCE SERIES",
  },
  {
    id: 2,
    imageSrc:
      "https://static.wixstatic.com/media/c837a6_a5a5863d6d7341958148ce678ac1a49a~mv2.jpg",
    button: "LIMITED EDITION",
  },
  {
    id: 3,
    imageSrc:
      "https://static.wixstatic.com/media/c837a6_d70089b44d104fc59d5366f6ff53851b~mv2.jpg",
    button: "KIDS COLLECTION",
  },
];

export default function Mainproduct() {
  return (
    <div className="bg-white">
      <div
        className="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"
        style={{ maxWidth: "1500px" }}
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
          SHOP BY COLLECTION
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => {
            const [ref, inView] = useInView({ triggerOnce: true });

            return (
              <motion.div
                ref={ref}
                key={product.id}
                className="group relative overflow-hidden rounded-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <img
                  src={product.imageSrc}
                  alt="Product"
                  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button className="absolute bottom-4 left-4 px-4 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition">
                  {product.button}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
