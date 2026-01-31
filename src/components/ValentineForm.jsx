"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PaymentSummary from "./PaymentSummary";

/* ================= HEART ANIMATION ================= */

const HEARTS = ["❤️", "💖", "💕", "💘", "💗", "💓"];

const FloatingHearts = ({ count = 20 }) => (
  <>
    {[...Array(count)].map((_, i) => {
      const size = Math.random() * 16 + 16;
      const left = Math.random() * 90 + 5;
      const duration = Math.random() * 6 + 6;
      const delay = Math.random() * 3;

      return (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none z-0"
          style={{ left: `${left}%`, fontSize: size }}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "-10%", opacity: 1 }}
          transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
        >
          {HEARTS[i % HEARTS.length]}
        </motion.div>
      );
    })}
  </>
);

/* ================= IMAGE UPLOAD ================= */

function ImageUploadBox({ images, limit, onUpload, onRemove }) {
  return (
    <div className="mb-4">
      <label className="w-full flex items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer hover:border-pink-400 bg-white">
        <span className="text-gray-400 font-medium">
          {images.length === 0 ? "Click to upload images" : "Add More"}
        </span>
        <input type="file" multiple accept="image/*" onChange={onUpload} className="hidden" />
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img src={img.preview} className="w-full h-20 object-cover rounded-lg border" />
              <button
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 rounded-full"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= AUDIO UPLOAD ================= */

function AudioUploadBox({ audioPreview, onUpload, onRemove }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Voice Message 🎤 (optional)
      </label>

      {!audioPreview ? (
        <label className="w-full flex items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer hover:border-pink-400 bg-white">
          <span className="text-gray-400 font-medium">
            Click to upload music or audio (mp3 / wav / m4a)
          </span>
          <input type="file" accept="audio/*" onChange={onUpload} className="hidden" />
        </label>
      ) : (
        <div className="flex items-center gap-3">
          <audio controls src={audioPreview} className="w-full" />
          <button onClick={onRemove} className="text-red-500 font-bold">✕</button>
        </div>
      )}
    </div>
  );
}

/* ================= ADD BUTTON ================= */

const AddButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full border-2 border-dashed rounded-xl py-4 text-3xl font-bold text-pink-500 hover:border-pink-400"
  >
    +
  </button>
);

/* ================= PREVIEW POPUP ================= */

const PreviewPopup = ({ onClose, onContinue }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  >
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full">
      <h3 className="text-xl font-bold text-pink-600 mb-4 text-center">
        Preview Your Valentine 💖
      </h3>

      <div className="flex justify-between mt-6">
        <button onClick={onClose} className="px-6 py-3 bg-gray-300 rounded-xl font-semibold">
          Back
        </button>
        <button onClick={onContinue} className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold">
          Continue 💕
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ================= MAIN ================= */

export default function ValentineForm() {
  const [step, setStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);

  const [formData, setFormData] = useState({
    banner1Images: [],
    fromName: "",
    toName: "",
    loveLetter: "",
    promises: [{ title: "", description: "" }],
    journeys: [{ title: "", year: "", description: "" }],
    galleryImages: [],
    firstMetYear: "",
    email: "",
    phone: "",
    audio: null,
    audioPreview: null,
  });

  const stepTitles = {
    1: "Banner & Names",
    2: "Love Letter 💌",
    3: "Promises 🤞",
    4: "Our Journey 🌍",
    5: "Memories 📸",
    6: "First Met 💕",
    7: "Your Email 📧",
    8: "Your Phone 📱",
  };

  const next = () => setStep((s) => Math.min(s + 1, 8));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* IMAGE */
  const handleImageUpload = (e, key, limit) => {
    const files = Array.from(e.target.files);
    if (formData[key].length + files.length > limit) return;

    const images = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData({ ...formData, [key]: [...formData[key], ...images] });
  };

  const removeImage = (key, index) => {
    const updated = [...formData[key]];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setFormData({ ...formData, [key]: updated });
  };

  /* AUDIO */
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({
      ...formData,
      audio: file,
      audioPreview: URL.createObjectURL(file),
    });
  };

  const removeAudio = () => {
    if (formData.audioPreview) URL.revokeObjectURL(formData.audioPreview);
    setFormData({ ...formData, audio: null, audioPreview: null });
  };

  /* VALIDATION */
  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.banner1Images.length && formData.fromName && formData.toName;
      case 2:
        return formData.loveLetter.length >= 10;
      case 3:
        return formData.promises.every(p => p.title && p.description);
      case 4:
        return formData.journeys.every(j => j.title && j.year && j.description);
      case 5:
        return formData.galleryImages.length > 0;
      case 6:
        return formData.firstMetYear;
      case 7:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 8:
        return /^[6-9]\d{9}$/.test(formData.phone);
      default:
        return false;
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-red-200 px-4 overflow-hidden">
      <FloatingHearts />

      <AnimatePresence>
        {showPopup && (
          <PreviewPopup
            onClose={() => setShowPopup(false)}
            onContinue={() => {
              setShowPopup(false);
              setShowPaymentSummary(true);
            }}
          />
        )}
      </AnimatePresence>

      {showPaymentSummary ? (
        <PaymentSummary formData={formData} />
      ) : (
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full">

          <h2 className="text-2xl font-bold text-center text-pink-600 mb-2">
            Valentine Story 💖
          </h2>
          <p className="text-center mb-4">
            {stepTitles[step]} ({step}/8)
          </p>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>

              {step === 1 && (
                <>
                  <ImageUploadBox images={formData.banner1Images} limit={4}
                    onUpload={(e) => handleImageUpload(e, "banner1Images", 4)}
                    onRemove={(i) => removeImage("banner1Images", i)}
                  />
                  <input name="fromName" placeholder="From Name" value={formData.fromName} onChange={handleChange} className="w-full p-3 border rounded-xl mb-3" />
                  <input name="toName" placeholder="To Name" value={formData.toName} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                </>
              )}

              {step === 2 && (
                <>
                  <textarea name="loveLetter" rows={5} placeholder="Write your love letter 💌"
                    value={formData.loveLetter} onChange={handleChange}
                    className="w-full p-3 border rounded-xl mb-4"
                  />
                  <AudioUploadBox
                    audioPreview={formData.audioPreview}
                    onUpload={handleAudioUpload}
                    onRemove={removeAudio}
                  />
                </>
              )}

              {step === 3 && (
  <>
    {formData.promises.map((p, i) => (
      <div key={i} className="border rounded-xl p-3 mb-3 relative">
        <input
          placeholder="Promise Title"
          value={p.title}
          onChange={(e) => {
            const promises = [...formData.promises];
            promises[i].title = e.target.value;
            setFormData({ ...formData, promises });
          }}
          className="w-full p-3 border rounded-xl mb-2"
        />

        <textarea
          placeholder="Promise Description"
          value={p.description}
          onChange={(e) => {
            const promises = [...formData.promises];
            promises[i].description = e.target.value;
            setFormData({ ...formData, promises });
          }}
          className="w-full p-3 border rounded-xl"
        />

        {i > 0 && (
          <button
            onClick={() => {
              const promises = [...formData.promises];
              promises.splice(i, 1);
              setFormData({ ...formData, promises });
            }}
            className="absolute top-2 right-2 text-red-500"
          >
            ✕
          </button>
        )}
      </div>
    ))}

    {formData.promises.length < 4 && (
      <AddButton
        onClick={() =>
          setFormData({
            ...formData,
            promises: [...formData.promises, { title: "", description: "" }],
          })
        }
      />
    )}
  </>
)}


           {step === 4 && (
  <>
    {formData.journeys.map((j, i) => (
      <div key={i} className="border rounded-xl p-3 mb-3 relative">
        <input
          placeholder="Journey Title"
          value={j.title}
          onChange={(e) => {
            const journeys = [...formData.journeys];
            journeys[i].title = e.target.value;
            setFormData({ ...formData, journeys });
          }}
          className="w-full p-3 border rounded-xl mb-2"
        />

        <input
          placeholder="Year"
          value={j.year}
          onChange={(e) => {
            const journeys = [...formData.journeys];
            journeys[i].year = e.target.value;
            setFormData({ ...formData, journeys });
          }}
          className="w-full p-3 border rounded-xl mb-2"
        />

        <textarea
          placeholder="Journey Description"
          value={j.description}
          onChange={(e) => {
            const journeys = [...formData.journeys];
            journeys[i].description = e.target.value;
            setFormData({ ...formData, journeys });
          }}
          className="w-full p-3 border rounded-xl"
        />

        {i > 0 && (
          <button
            onClick={() => {
              const journeys = [...formData.journeys];
              journeys.splice(i, 1);
              setFormData({ ...formData, journeys });
            }}
            className="absolute top-2 right-2 text-red-500"
          >
            ✕
          </button>
        )}
      </div>
    ))}

    {formData.journeys.length < 4 && (
      <AddButton
        onClick={() =>
          setFormData({
            ...formData,
            journeys: [
              ...formData.journeys,
              { title: "", year: "", description: "" },
            ],
          })
        }
      />
    )}
  </>
)}


              {step === 5 && (
                <ImageUploadBox images={formData.galleryImages} limit={10}
                  onUpload={(e) => handleImageUpload(e, "galleryImages", 10)}
                  onRemove={(i) => removeImage("galleryImages", i)}
                />
              )}

              {step === 6 && (
                <input type="date" name="firstMetYear" value={formData.firstMetYear}
                  onChange={handleChange} className="w-full p-3 border rounded-xl" />
              )}

              {step === 7 && (
                <input type="email" name="email" placeholder="Email"
                  value={formData.email} onChange={handleChange}
                  className="w-full p-3 border rounded-xl" />
              )}

              {step === 8 && (
                <input type="tel" name="phone" placeholder="Phone"
                  value={formData.phone} onChange={handleChange}
                  className="w-full p-3 border rounded-xl" />
              )}

            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            {step > 1 && <button onClick={back} className="px-4 py-2 border rounded-xl">Back</button>}
            <button onClick={step < 8 ? next : () => setShowPopup(true)}
              disabled={!isStepValid()}
              className={`ml-auto px-6 py-3 rounded-xl font-semibold ${
                isStepValid()
                  ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {step < 8 ? "Next" : "Save With Love 💖"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
