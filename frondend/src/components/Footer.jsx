import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-4 md:px-20">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Contact */}
        <div>
          <h3 className="text-sm font-bold bg-white text-black inline-block px-3 py-1 rounded mb-3">
            CONTACT
          </h3>
          <ul className="space-y-2">
            <li className="border border-white rounded px-3 py-2">info@mysite.com</li>
            <li className="border border-white rounded px-3 py-2">123-456-7890</li>
            <li className="border border-white rounded px-3 py-2">
              500 Terry Francine St. SA, CA 9415
            </li>
          </ul>

          <h3 className="text-sm font-bold bg-white text-black inline-block px-3 py-1 rounded mt-6 mb-3">
            SOCIAL MEDIA
          </h3>
          <div className="flex gap-3">
            <button className="border border-white rounded px-5 py-2">IG</button>
            <button className="border border-white rounded px-5 py-2">FB</button>
            <button className="border border-white rounded px-5 py-2">TKTK</button>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-sm font-bold bg-white text-black inline-block px-3 py-1 rounded mb-3">
            LEGAL 
          </h3>
          <ul className="space-y-2">
            <li className="border border-white rounded px-3 py-2">Terms & Conditions</li>
            <li className="border border-white rounded px-3 py-2">Privacy Policy</li>
            <li className="border border-white rounded px-3 py-2">Shipping Policy</li>
            <li className="border border-white rounded px-3 py-2">Refund Policy</li>
            <li className="border border-white rounded px-3 py-2">Accessibility Statement</li> 
          </ul>
        </div> 

        {/* Shop */}
        <div>
          <h3 className="text-sm font-bold bg-white text-black inline-block px-3 py-1 rounded mb-3">
            SHOP
          </h3>
          <ul className="space-y-2">
            <li className="border border-white rounded px-3 py-2">All Products</li>
            <li className="border border-white rounded px-3 py-2">Best Sellers</li>
            <li className="border border-white rounded px-3 py-2">Performance Series</li>
            <li className="border border-white rounded px-3 py-2">Limited Edition</li>
            <li className="border border-white rounded px-3 py-2">Kids Collection</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm mt-12 text-white">
        © 2035 by Ryst. Powered and secured by{" "}
        <a href="https://wix.com" target="_blank" rel="noreferrer" className="underline">
          Shoes
        </a>
      </div>
    </footer>
  );
};

export default Footer;
