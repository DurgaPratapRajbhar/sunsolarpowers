// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { CartProvider } from "../context/CartContext";
// import { AuthProvider } from "../context/AuthContext";

// // Header and Footer imports (adjust paths if needed)
// import Header from "../components/layout/Header";
// import Footer from "../components/layout/Footer";

// // Fonts setup
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Sunsolarpowers - Solar Energy Solutions",
//   description: "Sustainable solar products for homes and businesses",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html lang="en" className="scroll-smooth">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}
//       >
//         <AuthProvider>
//           <CartProvider>
//             <div className="flex flex-col min-h-screen">
//             <Header />
//             {/* m-[15px] */}
//               <main className="flex-grow ">{children}</main>
//               <Footer />
//             </div>
//           </CartProvider>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }


import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";

// Header and Footer imports
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Optional: Preload critical fonts
import { Suspense } from "react";
//import Loading from "./loading"; // Create a global loading component

// Fonts setup with optimal configuration
const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
  weight: ["400", "500"],
});

export const metadata = {
  metadataBase: new URL('https://www.sunsolarpowers.com'), // Replace with actual domain
  title: {
    default: "Sunsolarpowers - Solar Energy Solutions",
    template: "%s | Sunsolarpowers"
  },
  description: "Sustainable solar products for homes and businesses",
  keywords: ["solar", "renewable energy", "sustainable technology"],
  openGraph: {
    title: "Sunsolarpowers - Solar Energy Solutions",
    description: "Sustainable solar products for homes and businesses",
    images: ['/og-image.png'], // Create an open graph image
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sunsolarpowers - Solar Energy Solutions",
    description: "Sustainable solar products for homes and businesses",
    images: ['/twitter-image.png'], // Create a twitter card image
  },
};

export default function RootLayout({ children }) {


  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body 
        className="
          antialiased 
          bg-gray-100 
          dark:bg-gray-900 
          text-gray-900 
          dark:text-white 
          transition-colors 
          duration-300 
          selection:bg-green-200 
          selection:text-green-900
          bg-gradient-to-b
        "
      >
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <Suspense  >
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {children}
                </main>
              </Suspense>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>

        {/* Optional: Add a skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="
            fixed 
            top-4 
            left-4 
            z-50 
            bg-blue-500 
            text-white 
            px-4 
            py-2 
            rounded 
            opacity-0 
            focus:opacity-100 
            transition
          "
        >
          Skip to main content
        </a>
      </body>
    </html>
  );
}