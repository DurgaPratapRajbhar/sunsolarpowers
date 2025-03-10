"use client";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! We'll get back to you soon.");
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-emerald-700 text-center">
        Contact Us
      </h1>
      <p className="text-lg text-center mb-8 text-gray-600">
        Have questions about solar panels? Fill out the form below or reach out to us directly.
      </p>

      {/* Contact Form */}
      <div className="bg-white shadow-lg rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-lg p-3 mt-1 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-lg p-3 mt-1 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border-gray-300 rounded-lg p-3 mt-1 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Write your message..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg text-lg w-full transition-all"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-emerald-700">Our Office</h2>
        <p className="text-gray-600 mt-2">Ramabai Colony, Ambedkar NGR, Ghatkopar(E), Mumbai-400075</p>
        <p className="text-gray-600 mt-1">Phone: +91 88985 40057</p>
        <p className="text-gray-600 mt-1">
          Email:{" "}
          <a href="mailto:rajbhardp@gmail.com" className="text-blue-500 hover:underline">
            rajbhardp@gmail.com
          </a>
        </p>
      </div>

      {/* Google Maps Embed */}
      <div className="mt-10">
        <iframe
          className="w-full h-64 rounded-lg shadow-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.415365307208!2d72.9090!3d19.1307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e7a11d6b23%3A0x3d8a3e8a4a0a50df!2sRamabai%20Colony%2C%20Ghatkopar%20East%2C%20Mumbai%2C%20Maharashtra%20400075!5e0!3m2!1sen!2sin!4v1616172990846!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
