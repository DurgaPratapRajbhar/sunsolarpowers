"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function TopSlider() {
  const router = useRouter();

  const slides = [
    {
      image: "/image/slider/sun-solar.webp",
      title: "Harness the Power of Sun",
      description: "Sustainable energy solutions for a brighter, cleaner future",
    },
    {
      image: "/image/slider/sunsolar.webp",
      title: "Sustainable Energy for a Brighter Future",
      description: "Save money and protect the environment with solar energy.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Start the interval only after the initial render
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Slide changes every 5 seconds
      return () => clearInterval(interval);
    }, 100); // Small delay to ensure first slide renders
    return () => clearTimeout(timer);
  }, [slides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative w-full h-72 sm:h-80 md:h-96 lg:h-screen lg:max-h-[600px] overflow-hidden">
      {/* Preload the first image explicitly */}
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: index === 0 ? 1 : 0 }} // First slide starts fully visible
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute w-full h-full ${index !== currentSlide ? "hidden" : "block"}`}
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
            priority={index === 0} // Prioritize only the first slide
            loading={index === 0 ? "eager" : "lazy"} // Eager load first, lazy load others
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 to-emerald-600/40"></div>

          {/* Text Content */}
          <div
            onClick={() => router.push("/products")}
            className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center cursor-pointer"
          >
            <motion.h1
              initial={{ opacity: index === 0 ? 1 : 0, y: index === 0 ? 0 : -20 }}
              animate={{ opacity: index === currentSlide ? 1 : 0, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white drop-shadow-lg"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: index === 0 ? 1 : 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white max-w-xl sm:max-w-2xl"
            >
              {slide.description}
            </motion.p>
            <motion.button
              initial={{ opacity: index === 0 ? 1 : 0, y: index === 0 ? 0 : 20 }}
              animate={{ opacity: index === currentSlide ? 1 : 0, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-6 sm:mt-8 px-6 sm:px-8 py-2 sm:py-3 bg-yellow-400 hover:bg-yellow-300 text-emerald-900 font-bold rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Explore Solutions
            </motion.button>
          </div>
        </motion.div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-4 sm:bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
              index === currentSlide ? "bg-white" : "bg-gray-400 hover:bg-gray-300"
            }`}
            aria-current={index === currentSlide ? "true" : "false"}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <button
        className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white/70 transition-colors duration-200 z-10"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white/70 transition-colors duration-200 z-10"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        ❯
      </button>
    </div>
  );
}