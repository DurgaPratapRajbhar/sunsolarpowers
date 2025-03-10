"use client";

import Link from "next/link";

export default function OrderConfirmation() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Order Confirmed!</h1>
      <p>Your order has been placed successfully.</p>
      <Link href="/products" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mt-6 inline-block">
        Continue Shopping
      </Link>
    </div>
  );
}
