"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTag, FaRupeeSign, FaCheckCircle } from "react-icons/fa";
import loadRazorpay from "@/utils/loadRazorpay";
import PaymentSuccess from "./PaymentSuccess";

const BASE_AMOUNT = 299;

const PROMO_CODES = {
  LOVE100: 100,
  RMTECH99: 298,
  STUDENT100: 200,
};

export default function PaymentSummary({ formData }) {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goToPaymentSuccesspage, setGoToPaymentSuccesspage] = useState(false);

  useEffect(() => {
    setGoToPaymentSuccesspage(false);
  }, []);

  const totalAmount = Math.max(BASE_AMOUNT - discount, 0);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setApplied(true);
    } else {
      setDiscount(0);
      setApplied(false);
      alert("Invalid promo code ❌");
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    // 🔹 Create order (server should also set notes)
    const orderRes = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount }),
    });

    const orderData = await orderRes.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: "INR",
      name: "Valentine Card 💖",
      description: "Payment for Valentine Card",
      order_id: orderData.id,
      

      // ✅ THIS IS CRITICAL FOR WEBHOOK
      notes: {
        merchant_id: "8",                 // 👈 REQUIRED
        user_id: formData.email,            // optional
        discount: discount,
        promo_code: promoCode || "",
        items: "Valentine Card",
        phone: formData.phone, 
      },

      handler: async function (response) {
        try {
          const fd = new FormData();

          // 📝 story data
          fd.append("fromName", formData.fromName);
          fd.append("toName", formData.toName);
          fd.append("loveLetter", formData.loveLetter);
          fd.append("firstMetYear", formData.firstMetYear);
          fd.append("email", formData.email);
          fd.append("phone", formData.phone);
          fd.append("paymentStatus", "paid");

          fd.append("promises", JSON.stringify(formData.promises));
          fd.append("journeys", JSON.stringify(formData.journeys));

          // 💰 pricing
          fd.append("amount", totalAmount);
          fd.append("discount", discount);
          fd.append("promoCode", promoCode || "");

          // 🖼 banner images
          formData.banner1Images.forEach((img) => {
            fd.append("bannerImages[]", img.file);
          });

          // 🖼 gallery images
          formData.galleryImages.forEach((img) => {
            fd.append("galleryImages[]", img.file);
          });

          // 🎤 audio
          if (formData.audio) {
            fd.append("audio", formData.audio);
          }

          // 💳 razorpay refs
          fd.append("razorpayPaymentId", response.razorpay_payment_id);
          fd.append("razorpayOrderId", response.razorpay_order_id);
          fd.append("razorpaySignature", response.razorpay_signature);

          const saveRes = await fetch(
            "https://api.rmtechsolution.com/saveStory.php",
            { method: "POST", body: fd }
          );

          const saveData = await saveRes.json();

          if (saveData.success) {
            setGoToPaymentSuccesspage(true);
          } else {
            alert("Failed to save story ❌");
          }
        } catch (err) {
          console.error(err);
          alert("Server error ❌");
        } finally {
          setLoading(false);
        }
      },

      modal: {
        ondismiss: () => setLoading(false),
      },

      prefill: {
        name: formData.fromName || "Valentine User",
        email: formData.email || "test@example.com",
        contact: formData.phone || "9999999999",
      },

      theme: {
        color: "#ec4899",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
      {goToPaymentSuccesspage ? (
        <PaymentSuccess />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-pink-600 mb-6 text-center">
            Payment Summary 💖
          </h2>

          {/* Price Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-700">
              <span>Base Price</span>
              <span className="flex items-center gap-1">
                <FaRupeeSign /> {BASE_AMOUNT}
              </span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="flex items-center gap-1">
                - <FaRupeeSign /> {discount}
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span className="flex items-center gap-1 text-pink-600">
                <FaRupeeSign /> {totalAmount}
              </span>
            </div>
          </div>

          {/* Promo Code */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-600">
              Apply Promo Code
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter code (LOVE100)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-10 p-3 border rounded-xl"
                />
              </div>

              <button
                onClick={handleApplyPromo}
                className="bg-pink-500 text-white px-4 rounded-xl font-medium"
              >
                Apply
              </button>
            </div>

            {applied && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <FaCheckCircle /> Promo code applied successfully
              </div>
            )}
          </div>

          {/* Pay Button */}
          <motion.button
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePayment}
            className="mt-6 w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-60"
          >
            {loading ? "Processing..." : `Pay ₹${totalAmount}`}
          </motion.button>
        </motion.div>
      )}
    </>
  );
}
