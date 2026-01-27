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
          className="absolute pointer-events-none select-none"
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

/* ================= + BUTTON ================= */

const AddButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full border-2 border-dashed rounded-xl py-4 text-3xl font-bold text-pink-500 hover:border-pink-400"
  >
    +
  </button>
);

/* ================= MAIN COMPONENT ================= */

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
  });

  const stepTitles = {
    1: "Banner & Names",
    2: "Love Letter 💌",
    3: "Promises From My Heart 🤞",
    4: "Our Journey Together 🌍",
    5: "Precious Memories (Upload Atleast Four) 📸",
    6: "First Met 💕",
    7: "Your Email 📧",
  };

  const next = () => setStep((s) => Math.min(s + 1, 7));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  const addItem = (key, empty) => {
    if (formData[key].length >= 4) return;
    setFormData({ ...formData, [key]: [...formData[key], empty] });
  };

  const removeItem = (key, index) => {
    const updated = [...formData[key]];
    updated.splice(index, 1);
    setFormData({ ...formData, [key]: updated });
  };

  const updateItem = (key, index, field, value) => {
    const updated = [...formData[key]];
    updated[index][field] = value;
    setFormData({ ...formData, [key]: updated });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-red-200 px-4 overflow-hidden">
      <FloatingHearts />

      {showPaymentSummary ? (
        <PaymentSummary />
      ) : (
        <div className="bg-white/90 rounded-3xl shadow-2xl p-6 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-center text-pink-600 mb-2">
            Valentine Story 💖
          </h2>
          <p className="text-center mb-4">
            {stepTitles[step]} ({step}/7)
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <ImageUploadBox
                    images={formData.banner1Images}
                    limit={4}
                    onUpload={(e) => handleImageUpload(e, "banner1Images", 4)}
                    onRemove={(i) => removeImage("banner1Images", i)}
                  />
                  <input
                    name="fromName"
                    placeholder="From Name"
                    value={formData.fromName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl mb-3"
                  />
                  <input
                    name="toName"
                    placeholder="To Name"
                    value={formData.toName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-xl"
                  />
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <textarea
                  name="loveLetter"
                  rows={5}
                  placeholder="Write your love letter 💌"
                  value={formData.loveLetter}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl"
                />
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  {formData.promises.map((p, i) => (
                    <div key={i} className="border rounded-xl p-3 mb-3 relative">
                      <input
                        placeholder="Promise Title"
                        value={p.title}
                        onChange={(e) =>
                          updateItem("promises", i, "title", e.target.value)
                        }
                        className="w-full p-3 border rounded-xl mb-2"
                      />
                      <textarea
                        placeholder="Promise Description"
                        value={p.description}
                        onChange={(e) =>
                          updateItem("promises", i, "description", e.target.value)
                        }
                        className="w-full p-3 border rounded-xl"
                      />
                      {i > 0 && (
                        <button
                          onClick={() => removeItem("promises", i)}
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
                        addItem("promises", { title: "", description: "" })
                      }
                    />
                  )}
                </>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <>
                  {formData.journeys.map((j, i) => (
                    <div key={i} className="border rounded-xl p-3 mb-3 relative">
                      <input
                        placeholder="Journey Title"
                        value={j.title}
                        onChange={(e) =>
                          updateItem("journeys", i, "title", e.target.value)
                        }
                        className="w-full p-3 border rounded-xl mb-2"
                      />
                      <input
                        placeholder="Year"
                        value={j.year}
                        onChange={(e) =>
                          updateItem("journeys", i, "year", e.target.value)
                        }
                        className="w-full p-3 border rounded-xl mb-2"
                      />
                      <textarea
                        placeholder="Journey Description"
                        value={j.description}
                        onChange={(e) =>
                          updateItem("journeys", i, "description", e.target.value)
                        }
                        className="w-full p-3 border rounded-xl"
                      />
                      {i > 0 && (
                        <button
                          onClick={() => removeItem("journeys", i)}
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
                        addItem("journeys", {
                          title: "",
                          year: "",
                          description: "",
                        })
                      }
                    />
                  )}
                </>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <ImageUploadBox
                  images={formData.galleryImages}
                  limit={10}
                  onUpload={(e) => handleImageUpload(e, "galleryImages", 10)}
                  onRemove={(i) => removeImage("galleryImages", i)}
                />
              )}

              {/* STEP 6 */}
              {step === 6 && (
                <input
                  type="date"
                  name="firstMetYear"
                  value={formData.firstMetYear}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl"
                />
              )}

              {/* STEP 7 */}
              {step === 7 && (
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email 📧"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button onClick={back} className="px-4 py-2 border rounded-xl">
                Back
              </button>
            )}
            {step < 7 ? (
              <button
                onClick={next}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => setShowPopup(true)}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold"
              >
                Save With Love 💖
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
