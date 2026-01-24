import  useState  from "react";
import { motion } from "framer-motion";
import { FaTag, FaRupeeSign, FaCheckCircle } from "react-icons/fa";
import loadRazorpay from "@/utils/loadRazorpay";


const BASE_AMOUNT = 60;

// static promo codes
const PROMO_CODES: Record<string, number> = {
  LOVE50: 50,
  VALENTINE30: 30,
};

export default function PaymentSummary() {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applied, setApplied] = useState(false);

  const handlePayment = async () => {
  const res = await loadRazorpay();
  if (!res) {
    alert("Razorpay SDK failed to load");
    return;
  }

  // 1️⃣ Create order
  const orderRes = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: totalAmount }),
  });

  const orderData = await orderRes.json();

  // 2️⃣ Open Razorpay checkout
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: "INR",
    name: "Valentine Card 💖",
    description: "Payment for Valentine Card",
    order_id: orderData.id,
    handler: function (response: any) {
      alert("Payment successful 💖");
      console.log(response);
    },
    prefill: {
      name: "Valentine User",
      email: "test@example.com",
      contact: "9999999999",
    },
    theme: {
      color: "#ec4899",
    },
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
};


  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase();

    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setApplied(true);
    } else {
      setDiscount(0);
      setApplied(false);
      alert("Invalid promo code ❌");
    }
  };

  const totalAmount = BASE_AMOUNT - discount;

  return (
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
              placeholder="Enter code (LOVE50)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-pink-400"
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
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handlePayment}
  className="mt-6 w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-semibold shadow-lg"
>
  Pay ₹{totalAmount}
</motion.button>
    </motion.div>
  );
}
