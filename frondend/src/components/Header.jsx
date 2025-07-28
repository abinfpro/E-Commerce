import {Disclosure,DisclosureButton,DisclosurePanel,Menu,MenuButton,MenuItem,MenuItems,} from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"; // Add ShoppingCartIcon
import { useUser } from "./Usercontext";
import { Link, useLocation } from "react-router-dom"; 
import { useEffect,useState } from "react";
import axios from "axios";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/all-products" },
  { name: "About", href: "/about" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { user } = useUser();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
    useEffect(() => {
      const fetchCartItems = async () => {
        try {
          const response = await axios.get(`https://e-commerce-witm.onrender.com/api/auth/cart/${user._id}`);
          setCartItems(response.data);  
              
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      };
  
      if (user?._id) {
        fetchCartItems();
      }
    }, [user?._id]);
  // const cartItems = 0; // Example cart item count, replace with actual cart count logic

  return (
    <Disclosure as="nav" className="bg-white fixed w-full z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <img
              className="h-10 w-10"
              src="https://tse1.mm.bing.net/th?id=OIP.5rYnnbIdQhdKPoDnYjGn1QHaE8&pid=Api&P=0&h=180"
              alt="Logo"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Section and Cart */}
          <div className="absolute inset-y-0 right-0 flex gap-5 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Cart Icon */}
            <Link to="/cart">
              <div className="relative ml-4">
                <ShoppingCartIcon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 block w-4 h-4 text-xs bg-red-500 text-white rounded-full text-center">
                    {cartItems.length}
                  </span>
                )}
              </div>
            </Link>

            {user ? (
              <h2 className="text-md font-medium text-gray-900 mr-2">
                Hi, {user.name}
              </h2>
            ) : (
              <Link to="/signup">
                <button className="rounded-full bg-gray-800 px-4 py-2 text-white text-sm hover:bg-gray-700 transition">
                  Sign Up
                </button>
              </Link>
            )}

            {/* Dropdown */}
            {user && (
              <Menu as="div" className="relative ml-3">
                <MenuButton className="group flex flex-col justify-between w-8 h-6 cursor-pointer">
                  <span className="w-8 h-0.5 bg-gray-600"></span>
                  <span className="w-8 h-0.5 bg-gray-600"></span>
                  <span className="w-8 h-0.5 bg-gray-600"></span>
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="/profile"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Your Profile
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="/wishlist"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                       Wishlist
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="/logout"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Sign out
                      </a>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Panel */}
      <DisclosurePanel className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.href}
                className={classNames(
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            );
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
