"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaBirthdayCake,
  FaHeart,
  FaPen,
  FaEye,
  FaCreditCard,
} from "react-icons/fa";
import PaymentSummary from "./PaymentSummary";

const HEARTS = ["❤️", "💖", "💕", "💘", "💗", "💓"];

export default function ValentineForm() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    nickname: "",
    description: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  /* 🔁 FLOATING HEARTS COMPONENT */
  const FloatingHearts = ({ count = 8 }) => (
    <>
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * 16 + 16;
        const left = Math.random() * 100;
        const duration = Math.random() * 6 + 6;
        const delay = Math.random() * 3;

        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${left}%`,
              fontSize: `${size}px`,
            }}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "-10%", opacity: 1 }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {HEARTS[i % HEARTS.length]}
          </motion.div>
        );
      })}
    </>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-rose-200 to-red-200 px-4 overflow-hidden">
      {/* BACKGROUND HEARTS */}
      <FloatingHearts count={20} />

      {/* MAIN CONTENT */}
      {showPaymentSummary ? (
        <div className="relative z-10 w-full flex justify-center">
          <PaymentSummary />
        </div>
      ) : (
        <div className="relative z-10 w-full flex justify-center">
          <div className="relative w-full max-w-lg">
            {/* HEARTS AROUND FORM */}
            <FloatingHearts count={6} />

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-6 sm:p-8"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-5xl text-center mb-2"
              >
                💘
              </motion.div>

              <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
                Valentine Profile
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* NAME */}
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 p-3 border rounded-xl focus:ring-2 focus:ring-pink-400"
                    required
                  />
                </div>

                {/* DOB */}
                <div className="relative">
                  <FaBirthdayCake className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full pl-11 p-3 border rounded-xl focus:ring-2 focus:ring-pink-400"
                    required
                  />
                </div>

                {/* NICKNAME */}
                <div className="relative">
                  <FaHeart className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" />
                  <input
                    type="text"
                    name="nickname"
                    placeholder="Love Nickname 💕"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="w-full pl-11 p-3 border rounded-xl focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="relative">
                  <FaPen className="absolute left-4 top-4 text-pink-400" />
                  <textarea
                    name="description"
                    placeholder="Write something sweet 💌"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full pl-11 p-3 border rounded-xl resize-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                {/* SUBMIT */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-semibold shadow-lg"
                >
                  Save With Love 💖
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      )}

      {/* POPUP */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-xl overflow-hidden"
            >
              <FloatingHearts count={4} />

              <div className="relative z-10">
                <div className="text-4xl mb-2">💖</div>
                <h3 className="text-xl font-bold text-pink-600 mb-2">
                  What’s next?
                </h3>
                <p className="text-gray-600 mb-6">
                  Preview your Valentine card or continue with payment
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-full flex items-center justify-center gap-2 border border-pink-500 text-pink-600 py-3 rounded-xl font-medium"
                  >
                    <FaEye /> Preview
                  </button>

                  <button
                    onClick={() => {
                      setShowPaymentSummary(true);
                      setShowPopup(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-semibold"
                  >
                    <FaCreditCard /> Continue with Payment
                  </button>
                </div>

                <button
                  onClick={() => setShowPopup(false)}
                  className="mt-4 text-sm text-gray-400 underline"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
