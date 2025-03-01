"use client";
import { useState, useEffect } from "react";
import Calendar from "./components/Calendar.js";
import { connectFirebase, addEmotions, getEvents, getAievents } from "../../backend/firebase.js";
import { motion, AnimatePresence } from "framer-motion"; // Import animation library

export default function Home() {
  const emotionLevels = ["Very minimal", "Just a bit", "Moderate", "Very", "Extremely"];
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [sliderValue, setSliderValue] = useState(2);
  const [events, setEvents] = useState([]);
  const [aievents, setAievents] = useState([]);
  const [suggestedActivities, setSuggestedActivities] = useState([]);
  const [db, dbRef] = connectFirebase();
  const [isVisible, setIsVisible] = useState(false); // Controls bar visibility

  //function to toggle visibility for the plugin pop up
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="emotif-div bg-gray-100 p-6 relative">
      <div
        onClick={toggleVisibility}
        className="fixed top-4 left-4 cursor-pointer bg-gray-200 p-2 rounded-full shadow-lg z-50"
      >
        <img src="/emoji/logo.jpg" alt="Logo" className="h-12 w-auto" />
      </div>

      {/* Animated Emotif Bar */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto bg-white rounded-lg p-6 shadow-lg w-[50%] h-auto mb-6"
          >
            <p className="text-center text-gray-600">HOW ARE YOU FEELING RIGHT NOW?</p>

            {/* Emotion Buttons */}
            <div className="flex justify-center gap-4 my-6">
              {["happy", "anxious", "confident", "angry", "tired"].map((emotion) => (
                <div key={emotion} className="flex flex-col items-center">
                  <img src={`/emoji/${emotion}-icon.png`} alt={emotion} className="w-20 h-20 mb-2" />
                  <button
                    onClick={() => setSelectedEmotion(emotion)}
                    className="emotion-button border border-black text-gray-800 px-6 rounded-full shadow-sm hover:bg-gray-100 transition-transform transform hover:scale-105"
                  >
                    <span className="text-sm">{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Slider for Emotion Level */}
            {selectedEmotion && (
              <div className="max-w-lg flex flex-col items-center justify-center m-auto">
                <label htmlFor="emotionSlider" className="block text-center text-gray-600 mb-2">
                  How {selectedEmotion} do you feel?
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={sliderValue}
                  step="1"
                  onChange={(e) => setSliderValue(e.target.value)}
                  className="w-full border-black"
                />
        
                <p className="text-center text-gray-600 mt-2">{emotionLevels[sliderValue - 1]}</p>
                <button
                  onClick={() => alert("Emotion submitted successfully!")}
                  className="bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition-colors mt-4"
                >
                  Submit
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Calendar />
    </div>
  );
}
