"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HTTP } from "../utils/http.js";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import TopSlider from "../components/Slider.jsx";

const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_ROOT;
const FALLBACK_IMAGE = `${IMAGE_URL}categories/img-600x400-1.jpg`;
const URL = "/api/categories/list";

// Reusable Components
const BenefitCard = ({ icon, title, description, color }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-white p-6 rounded-xl shadow-md transition-all text-center w-full max-w-sm mx-auto"
  >
    <div className={`w-16 h-16 md:w-20 md:h-20 ${color.bg} rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-colors duration-300`}>
      {icon}
    </div>
    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-sm md:text-base">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ initial, name, role, quote, color }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm transition-all w-full max-w-sm mx-auto"
  >
    <div className="flex items-center mb-4 md:mb-6">
      <div className={`w-10 h-10 md:w-12 md:h-12 ${color.bg} rounded-full flex items-center justify-center ${color.text} font-bold text-lg md:text-xl`}>
        {initial}
      </div>
      <div className="ml-3 md:ml-4">
        <h4 className="font-bold text-gray-800 text-base md:text-lg">{name}</h4>
        <p className="text-xs md:text-sm text-gray-500">{role}</p>
      </div>
    </div>
    <p className="text-gray-600 italic text-sm md:text-base">{quote}</p>
    <div className="mt-3 md:mt-4 flex text-yellow-400 text-sm md:text-base">★★★★★</div>
  </motion.div>
);

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const router = useRouter();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await HTTP("GET", URL);
      if (response?.data) {
        setCategories(response.data);
        if (response.data.length > 0) {
          setExpandedCategory(response.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePopupClose = () => {
    setShowPopup(false);
    setPopupData(null);
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading Slider...</div>}>
        <TopSlider />
      </Suspense>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-16"
        >
          <span className="inline-block px-3 py-1 md:px-4 md:py-2 bg-emerald-100 text-emerald-800 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4 shadow-sm">
            Our Products
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
            Premium Solar Solutions
          </h2>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-4 md:mt-6 rounded-full"></div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 md:h-16 md:w-16 border-t-4 border-emerald-600 rounded-full"
            />
          </div>
        ) : (
          <div className="space-y-6 md:space-y-12">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                custom={index}
                variants={categoryVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div
                  className="cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-white to-emerald-50 border-l-4 border-emerald-500"
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                >



                  <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:flex-1">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <Image
                        src={category.image ? `${IMAGE_URL}${category.image}` : FALLBACK_IMAGE}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        priority={index < 2}
                        className="object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">{category.name}</h2>
                        {category.status === "active" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/products/${category.slug}`);
                            }}
                            className="text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 sm:space-x-2 font-medium transition-colors duration-200 text-sm sm:text-base"
                          >
                            <span>Explore</span>
                            <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPopup(true);
                              setPopupData(category);
                            }}
                            className="text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 sm:space-x-2 font-medium transition-colors duration-200 text-sm sm:text-base"
                          >
                            <span>View Details</span>
                            <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                          </button>
                        )}
                      </div>
                      <div className="mt-2 flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm ${
                            category.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-2 bg-current"></span>
                          {category.status === "active" ? "Available" : "Not Available"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedCategory === category.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-emerald-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-emerald-600 shadow-sm mt-3 sm:mt-0 self-end sm:self-auto"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {expandedCategory === category.id && category.children?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="bg-emerald-50/30 px-4 sm:px-6 py-6 sm:py-8"
                    >
                      <div
                        className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`}
                      >
                        {category.children.map((sub) => (
                          <motion.div
                            key={sub.id}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                          >
                            <div className="relative h-48 sm:h-56">
                              <Image
                                src={sub.image ? `${IMAGE_URL}${sub.image}` : FALLBACK_IMAGE}
                                alt={sub.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                              />
                              {sub.status === "active" && (
                                <span className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                                  AVAILABLE
                                </span>
                              )}
                            </div>
                            <div className="p-4 sm:p-5 flex flex-col flex-1">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{sub.name}</h3>
                              <p className="text-gray-600 text-sm flex-1 line-clamp-3">
                                {sub.description || "High-quality product from our collection"}
                              </p>
                              <button
                                onClick={() =>
                                  sub.status === "active"
                                    ? router.push(`/products/${sub.slug}`)
                                    : (setShowPopup(true), setPopupData(sub))
                                }
                                className="mt-3 sm:mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
                              >
                                View Details
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <section className="bg-emerald-50 py-8 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-16"
          >
            <span className="inline-block px-3 py-1 md:px-4 md:py-2 bg-emerald-100 text-emerald-800 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4 shadow-sm">
              Benefits
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">Why Choose Us</h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-4 md:mt-6 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <BenefitCard
              icon={<svg className="h-8 w-8 md:h-10 md:w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title="Energy Efficient"
              description="Save up to 70% on electricity bills with our high-efficiency solar panels."
              color={{ bg: "bg-yellow-100" }}
            />
            <BenefitCard
              icon={<svg className="h-8 w-8 md:h-10 md:w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>}
              title="Eco-Friendly"
              description="Reduce your carbon footprint with sustainable solar solutions."
              color={{ bg: "bg-emerald-100" }}
            />
            <BenefitCard
              icon={<span className="text-3xl md:text-4xl font-bold text-blue-600">₹</span>}
              title="Cost Effective"
              description="Long-term savings with excellent ROI and government incentives."
              color={{ bg: "bg-blue-100" }}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-emerald-50 py-8 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-16"
          >
            <span className="inline-block px-3 py-1 md:px-4 md:py-2 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4 shadow-sm">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">Our Happy Customers</h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mt-4 md:mt-6 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <TestimonialCard
              initial="D"
              name="Durga Pratap"
              role="Homeowner"
              quote="Best decision for our home. Incredible savings on electricity bills!"
              color={{ bg: "bg-emerald-100", text: "text-emerald-600" }}
            />
            <TestimonialCard
              initial="M"
              name="Mayank"
              role="Business Owner"
              quote="Professional team. Our business now runs on 80% solar energy."
              color={{ bg: "bg-blue-100", text: "text-blue-600" }}
            />
            <TestimonialCard
              initial="K"
              name="Krishna"
              role="Solar Enthusiast"
              quote="Top-quality panels and outstanding support after 2 years."
              color={{ bg: "bg-yellow-100", text: "text-yellow-600" }}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">Ready to Go Solar?</h2>
          <p className="text-base sm:text-lg md:text-xl text-emerald-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Get a free consultation and quote from our experts today.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-300 text-emerald-900 font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Get Free Quote
          </button>
          <p className="text-emerald-200 mt-4 md:mt-6 text-xs sm:text-sm">
            No obligation • Professional installation • 25-year warranty
          </p>
        </motion.div>
      </section>

      {/* Popup */}
      <AnimatePresence>
        {showPopup && popupData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto relative"
            >
              <button
                onClick={handlePopupClose}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{popupData.name}</h3>
              <div
                className="prose prose-sm text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: popupData.description || "No description available" }}
              />
              <button
                onClick={handlePopupClose}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}