"use client";
import { useState } from "react";

export default function PaymentSuccess({ story }) {
  // story = { id, fromName }

  const [copied, setCopied] = useState(false);

  // 🔗 Build story URL
  const storyUrl = `https://myvalentineforever.rmtechsolution.com/?id=${story.id}&from=${encodeURIComponent(
    story.from_name
  )}`;
  const handleCopy = async () => {
    await navigator.clipboard.writeText(storyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `💖 I created a special Valentine story just for you!\n\nOpen it here 👉 ${storyUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen relative z-10 flex items-center justify-center bg-gradient-to-br from-pink-200 to-red-200 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">

        <h1 className="text-2xl font-bold text-pink-600 mb-2">
          Payment Successful 💖
        </h1>

        <p className="text-gray-600 mb-6 text-lg font-semibold">
          Your Valentine story is ready!
        </p>

        {/* 🔗 Story Link Box */}
        <div className="bg-gray-100 rounded-xl p-3 text-sm break-all mb-4">
          {storyUrl}
        </div>

        {/* 📋 Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full mb-3 py-3 rounded-xl font-semibold border border-pink-500 text-pink-600 hover:bg-pink-50"
        >
          {copied ? "✅ Link Copied!" : "📋 Copy Story Link"}
        </button>

        {/* ❤️ Open Story */}
        <a
          href={storyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mb-3 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover:scale-[1.02] transition"
        >
          ❤️ Open My Story
        </a>

        {/* 📤 WhatsApp Share */}
        <button
          onClick={handleWhatsAppShare}
          className="w-full py-3 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600 shadow-lg"
        >
          📤 Share on WhatsApp
        </button>

        {/* 💌 Footer Text */}
        <p className="text-xs text-gray-500 mt-6">
          Made with love by RM Tech 💕
        </p>
      </div>
    </div>
  );
}
