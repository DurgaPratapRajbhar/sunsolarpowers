// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
// import { useCart } from "../../context/CartContext";
// import { useAuth } from "../../context/AuthContext";
// import Link from "next/link";

// export default function Header() {
//   const { cart, getUserCart } = useCart();
//   const { user, logout, setAuthPopupOpen } = useAuth();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [languageSelect, setLanguageSelect] = useState("EN");

//   const cartCount = cart?.length || 0;

//   // Sync cart with user
//   useEffect(() => {
//     if (user) getUserCart();
//   }, [user, getUserCart]);

//   const toggleMobileMenu = useCallback(() => {
//     setMobileMenuOpen((prev) => !prev);
//     setDropdownOpen(false);
//   }, []);

//   const toggleDropdown = useCallback(() => {
//     setDropdownOpen((prev) => !prev);
//     setMobileMenuOpen(false);
//   }, []);

//   const handleLanguageChange = useCallback((e) => {
//     setLanguageSelect(e.target.value);
//   }, []);

//   const handleAuthAction = useCallback((action) => {
//     if (action === "logout") logout();
//     else setAuthPopupOpen(true);
//     setDropdownOpen(false);
//     setMobileMenuOpen(false);
//   }, [logout, setAuthPopupOpen]);

//   const navLinkClass = "text-gray-700 hover:text-blue-600 transition-colors duration-200";
//   const dropdownItemClass = "block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200";
//   const buttonClass = "text-gray-600 hover:text-blue-600 transition-colors duration-200";

//   return (
//     <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
//       <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//         {/* Logo */}
//         <Link
//           href="/"
//           className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-yellow-400 tracking-tight"
//         >
//           SunSolarPowers
//         </Link>

//         {/* Mobile Controls */}
//         <div className="md:hidden flex items-center space-x-4">
//           <button className={buttonClass} aria-label="Search">
//             <FaSearch size={20} />
//           </button>
//           <Link href="/cart" className="relative">
//             <FaShoppingCart size={20} className={buttonClass} />
//             {cartCount > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
//                 {cartCount}
//               </span>
//             )}
//           </Link>
//           <button onClick={toggleMobileMenu} className={buttonClass} aria-label="Toggle menu">
//             {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//           </button>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
//           <div className="relative max-w-md w-full mx-6">
//             <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
//             />
//           </div>

//           <nav className="flex items-center space-x-8">
//             <Link href="/about" className={navLinkClass}>About</Link>
//             <Link href="/contact" className={navLinkClass}>Contact</Link>
//             <Link href="/products" className={navLinkClass}>Products</Link>
//             <Link href="/cart" className={`relative ${navLinkClass}`}>
//               <FaShoppingCart size={20} />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             {/* User Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={toggleDropdown}
//                 className="flex items-center space-x-2 focus:outline-none"
//                 aria-label="User menu"
//               >
//                 <FaUser size={20} className={buttonClass} />
//                 {user && <span className="text-gray-700 font-medium">{user.name || user.email}</span>}
//               </button>
//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
//                   {user ? (
//                     <>
//                       <Link href="/account" className={dropdownItemClass} onClick={toggleDropdown}>
//                         Account
//                       </Link>
//                       <Link href="/orders" className={dropdownItemClass} onClick={toggleDropdown}>
//                         Orders
//                       </Link>
//                       <button onClick={() => handleAuthAction("logout")} className={dropdownItemClass}>
//                         Logout
//                       </button>
//                     </>
//                   ) : (
//                     <button onClick={() => handleAuthAction("login")} className={dropdownItemClass}>
//                       Login/Register
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>

//             <select
//               value={languageSelect}
//               onChange={handleLanguageChange}
//               className="bg-white border border-gray-300 rounded-md py-1 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
//             >
//               <option value="EN">EN</option>
//               <option value="HI">HI</option>
//             </select>
//           </nav>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-6 shadow-lg">
//             <nav className="flex flex-col space-y-6">
//               {[
//                 { href: "/about", label: "About" },
//                 { href: "/contact", label: "Contact" },
//                 { href: "/products", label: "Products" },
//                 ...(user
//                   ? [
//                       { href: "/account", label: "Account" },
//                       { href: "/orders", label: "Orders" },
//                     ]
//                   : []),
//               ].map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className="text-xl font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
//                   onClick={toggleMobileMenu}
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//               {user ? (
//                 <button
//                   onClick={() => handleAuthAction("logout")}
//                   className="text-xl font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left"
//                 >
//                   Logout
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleAuthAction("login")}
//                   className="text-xl font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left"
//                 >
//                   Login/Register
//                 </button>
//               )}
//               <div className="flex items-center space-x-4">
//                 <label htmlFor="mobile-language" className="text-xl text-gray-700 font-medium">
//                   Language:
//                 </label>
//                 <select
//                   id="mobile-language"
//                   value={languageSelect}
//                   onChange={handleLanguageChange}
//                   className="text-xl bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
//                 >
//                   <option value="EN">English</option>
//                   <option value="HI">Hindi</option>
//                 </select>
//               </div>
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }




 "use client";
import { useState, useEffect, useCallback } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { HTTP } from "../../utils/http.js";

export default function Header() {
  const { cart, getUserCart } = useCart();
  const { user, logout, setAuthPopupOpen } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageSelect, setLanguageSelect] = useState("EN");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const cartCount = cart?.length || 0;

  useEffect(() => {
    if (user) getUserCart();
  }, [user, getUserCart]);

  // Search handler
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await HTTP("GET", `/api/v1/products?query=${encodeURIComponent(searchQuery)}`, {}, "");
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce to avoid too many requests
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, handleSearch]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
    setDropdownOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prev) => !prev);
    setMobileMenuOpen(false);
  }, []);

  const handleLanguageChange = useCallback((e) => {
    setLanguageSelect(e.target.value);
  }, []);

  const handleAuthAction = useCallback((action) => {
    if (action === "logout") logout();
    else setAuthPopupOpen(true);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [logout, setAuthPopupOpen]);

  const navLinkClass = "text-gray-700 hover:text-blue-600 transition-colors duration-200";
  const dropdownItemClass = "block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200";
  const buttonClass = "text-gray-600 hover:text-blue-600 transition-colors duration-200";

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-yellow-400 tracking-tight"
        >
          SunSolarPowers
        </Link>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center space-x-4">
          <button className={buttonClass} aria-label="Search">
            <FaSearch size={20} />
          </button>
          <Link href="/cart" className="relative">
            <FaShoppingCart size={20} className={buttonClass} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={toggleMobileMenu} className={buttonClass} aria-label="Toggle menu">
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
          <div className="relative max-w-md w-full mx-6">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            {/* Search Results Dropdown */}
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setSearchQuery("")}
                  >
                    {product.name} - ₹{product.price}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <nav className="flex items-center space-x-8">
            <Link href="/about" className={navLinkClass}>About</Link>
            <Link href="/contact" className={navLinkClass}>Contact</Link>
            <Link href="/products" className={navLinkClass}>Products</Link>
            <Link href="/cart" className={`relative ${navLinkClass}`}>
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="User menu"
              >
                <FaUser size={20} className={buttonClass} />
                {user && <span className="text-gray-700 font-medium">{user.name || user.email}</span>}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  {user ? (
                    <>
                      <Link href="/account" className={dropdownItemClass} onClick={toggleDropdown}>
                        Account
                      </Link>
                      <Link href="/orders" className={dropdownItemClass} onClick={toggleDropdown}>
                        Orders
                      </Link>
                      <button onClick={() => handleAuthAction("logout")} className={dropdownItemClass}>
                        Logout
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleAuthAction("login")} className={dropdownItemClass}>
                      Login/Register
                    </button>
                  )}
                </div>
              )}
            </div>

            <select
              value={languageSelect}
              onChange={handleLanguageChange}
              className="bg-white border border-gray-300 rounded-md py-1 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <option value="EN">EN</option>
              <option value="HI">HI</option>
            </select>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-6 shadow-lg">
            <nav className="flex flex-col space-y-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                {/* Mobile Search Results */}
                {searchQuery && searchResults.length > 0 && (
                  <div className="mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => {
                          setSearchQuery("");
                          toggleMobileMenu();
                        }}
                      >
                        {product.name} - ${product.price}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/products", label: "Products" },
                ...(user
                  ? [
                      { href: "/account", label: "Account" },
                      { href: "/orders", label: "Orders" },
                    ]
                  : []),
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xl font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  onClick={toggleMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => handleAuthAction("logout")}
                  className="text-xl font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => handleAuthAction("login")}
                  className="text-xl font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left"
                >
                  Login/Register
                </button>
              )}
              <div className="flex items-center space-x-4">
                <label htmlFor="mobile-language" className="text-xl text-gray-700 font-medium">
                  Language:
                </label>
                <select
                  id="mobile-language"
                  value={languageSelect}
                  onChange={handleLanguageChange}
                  className="text-xl bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <option value="EN">English</option>
                  <option value="HI">Hindi</option>
                </select>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}