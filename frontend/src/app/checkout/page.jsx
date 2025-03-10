"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { HTTP } from "../../utils/http.js";

import { useAuth } from "../../context/AuthContext";

const URL = process.env.NEXT_PUBLIC_USER_SERVICE_ROOT;

async function submitShippingDetails(prevState, formData) {
  try {
    const response = await HTTP("POST", `${URL}shipping-detail/`, formData, "");
    return { success: true, message: "Shipping details submitted successfully", data: response };
  } catch (err) {
    return { success: false, message: err.message || "Failed to submit shipping details" };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [state, submitAction, isPending] = useActionState(submitShippingDetails, {
    success: null,
    message: "",
  });

  const [formData, setFormData] = useState({
    user_id: "",
    order_id: "",
    recipient_name: "",
    phone_number: "",
    email: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    tracking_number: "",
    shipping_status: "Pending",
    carrier: "",
    estimated_delivery: "",
  });

  const [errors, setErrors] = useState({});
  const { user, setAuthPopupOpen } = useAuth();

 

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.recipient_name.trim()) tempErrors.recipient_name = "Recipient name is required";
    else if (formData.recipient_name.length < 2) tempErrors.recipient_name = "Name must be at least 2 characters";
    if (!formData.phone_number) tempErrors.phone_number = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone_number)) tempErrors.phone_number = "Must be 10 digits";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) tempErrors.email = "Invalid email format";
    if (!formData.address_line1.trim()) tempErrors.address_line1 = "Address is required";
    if (!formData.city.trim()) tempErrors.city = "City is required";
    if (!formData.state.trim()) tempErrors.state = "State is required";
    if (!formData.postal_code) tempErrors.postal_code = "Postal code is required";
    else if (!/^\d{6}$/.test(formData.postal_code)) tempErrors.postal_code = "Must be 6 digits";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_number") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!user) {
  //     setAuthPopupOpen(true);
  //     return;
  //   }
  //   if (!validateForm()) return;

  //   formData.user_id=user.id

  //   submitAction(formData);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      setAuthPopupOpen(true);
      return;
    }
    
    if (!validateForm()) return;

    const formDataToSend = {
      ...formData,
      user_id: user.id,
      order_id:1, //parseInt(formData.order_id, 10), // Ensure it's a number
      estimated_delivery: formData.estimated_delivery
        ? new Date(formData.estimated_delivery).toISOString() // Convert to RFC3339
        : null,
    };
  
     submitAction(formDataToSend);
  };
  

  if (state.success) {
    router.push("/order-confirmation");
  }

  const InputField = ({ label, name, type = "text", placeholder, required = false }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
        {...(name === "phone_number" ? { inputMode: "numeric", pattern: "[0-9]*" } : {})}
      />
      {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Complete Your Shipping Details
        </h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          {state.message && (
            <div
              className={`p-4 border-l-4 ${
                state.success ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700"
              }`}
            >
              {state.message}
            </div>
          )}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Shipping Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <InputField label="Recipient Name" name="recipient_name" placeholder="John Doe" required />
              </div>
              <InputField label="Phone Number" name="phone_number" placeholder="9876543210" required />
              <InputField label="Email" name="email" type="email" placeholder="john@example.com" required />
              <div className="sm:col-span-2">
                <InputField label="Address Line 1" name="address_line1" placeholder="123 Main St" required />
              </div>
              <div className="sm:col-span-2">
                <InputField label="Address Line 2 (Optional)" name="address_line2" placeholder="Apartment, Suite, etc." />
              </div>
              <InputField label="City" name="city" placeholder="Mumbai" required />
              <InputField label="State" name="state" placeholder="Maharashtra" required />
              <InputField label="Postal Code" name="postal_code" placeholder="400075" required />
              <InputField label="Country" name="country" placeholder="India" required />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Shipping Preferences</h2>
            <InputField label="Carrier" name="carrier" placeholder="DHL, FedEx, etc." />
            <InputField label="Estimated Delivery Date" name="estimated_delivery" type="date" />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 px-4 rounded-md text-white ${
              isPending ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } transition-colors duration-200`}
          >
            {isPending ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Confirm Shipping Details"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}