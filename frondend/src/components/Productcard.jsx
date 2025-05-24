import { useState } from "react";

export default function ProductCard({
  image1,
  image2,
  name,
  price,
  offerPrice,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="bg-[#f5f2e8] p-4 rounded-lg flex items-center shadow-md">
        {/* Left: Image section */}
        <div
          className="relative w-full h-60"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* SALE Tag */}
          <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>

          {/* Product Image */}
          <img
            src={isHovered ? image1 : image2}
            alt="Product"
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Right: Product Info */}
        <div className="w-1/2 pl-4">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="text-gray-700 text-lg font-semibold">
            {offerPrice}{" "}
            <span className="text-gray-400 line-through text-sm">{price}</span>
          </p>
          <button className="mt-3 px-4 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition">
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}
