import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Footer Content Container */}
        <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-start space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-500"
            >
              Sunsolarpowers
            </Link>
            <p className="text-sm text-gray-300">
              Empowering sustainable energy solutions for a greener future.
            </p>
            <p className="text-sm">
              © {currentYear} Sunsolarpowers. All Rights Reserved.
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full md:w-auto">
            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <div className="flex flex-col space-y-2">
                <Link href="/about" className="text-sm hover:text-orange-500 transition-colors">About Us</Link>
                 
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <div className="flex flex-col space-y-2">
                <Link href="/privacy" className="text-sm hover:text-orange-500 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-sm hover:text-orange-500 transition-colors">Terms of Service</Link>
                <Link href="/support" className="text-sm hover:text-orange-500 transition-colors">Support</Link>
              </div>
            </div>

            {/* Contact Links */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold mb-3">Contact</h4>
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Email: scriptdp@gmail.com</p>
                <p className="text-sm">Phone: +91 8898540057</p>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-start space-y-4">
            <h4 className="font-semibold">Follow Us</h4>
            <div className="flex space-x-4">
              <Link 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-blue-500 transition-colors"
              >
                <FaFacebook />
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-blue-400 transition-colors"
              >
                <FaTwitter />
              </Link>
              <Link 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-pink-500 transition-colors"
              >
                <FaInstagram />
              </Link>
              <Link 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl hover:text-blue-600 transition-colors"
              >
                <FaLinkedin />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-sm text-gray-400">
            Committed to sustainable energy solutions since 2020
          </p>
        </div>
      </div>
    </footer>
  );
}