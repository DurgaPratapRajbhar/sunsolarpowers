"use client";
import { useState, useCallback } from "react";
import { HTTP } from "../../utils/http.js";
import { useAuth } from "../../context/AuthContext";

const URL = process.env.NEXT_PUBLIC_USER_SERVICE_ROOT || "http://localhost:4000/";

export default function AuthPopup({ closePopup }) {
  const { setAuthPopupOpen, setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validateForm = () => {
    let newErrors = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Please enter a valid email";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthSuccess = useCallback((userData) => {
    console.log("Handling auth success with:", userData);
    setUser(userData);
    setAuthPopupOpen(false);
    if (typeof closePopup === "function") {
      closePopup();
    }
  }, [setUser, setAuthPopupOpen, closePopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError(null);

    try {
      const response = isLogin
        ? await handleLogin(formData)
        : await handleRegister(formData);

      console.log("API Response:", response);
      if (response?.data || response?.user) {
        handleAuthSuccess(response.data || response.user);
      } else {
        setServerError(response?.message || "Invalid response from server");
      }
    } catch (error) {
      setServerError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (formData) => {
    const response = await HTTP("POST", `${URL}login`, formData, "");
    return response;
  };

  const handleRegister = async (formData) => {
    const response = await HTTP("POST", `${URL}users`, formData, "");
    return response;
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  const errorClass = "text-red-500 text-xs mt-1";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300">
        <div className="relative p-6">
          <button
            onClick={() => handleAuthSuccess(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            aria-label="Close popup"
            disabled={loading}
          >
            ×
          </button>

          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6">
              <p className="text-red-700 text-sm">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                />
                {errors.name && <p className={errorClass}>{errors.name}</p>}
              </div>
            )}

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                className={inputClass}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
              />
              {errors.password && <p className={errorClass}>{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "New here?" : "Already registered?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              disabled={loading}
            >
              {isLogin ? "Create an account" : "Sign in instead"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}