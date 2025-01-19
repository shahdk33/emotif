"use client";
import { useState } from "react";
import Calendar from "./components/Calendar.js";
import { connectFirebase, addEmotions } from "../../backend/firebase.js";

export default function Home() {
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [sliderValue, setSliderValue] = useState(2);

  const [db] = connectFirebase();

  const handleEmotionClick = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  const handleSubmit = () => {
    const emotionData = {
      date: new Date().toISOString().split("T")[0], // Current date
      time: new Date().toLocaleTimeString(), // Current time
      emotion: selectedEmotion,
      level: sliderValue,
    };
    addEmotions(db, emotionData);
    alert("Emotion submitted successfully!");
    setSelectedEmotion("");
    setSliderValue(2);
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-4xl text-center font-bold text-gray-800 mb-4">
          Emotif
        </h1>
        <p className="text-center text-gray-600">Your AI friend</p>
        {/* Emotion Buttons */}
        <div className="flex justify-center gap-4 my-4">
        {["happy", "anxious", "confident", "angry"].map((emotion) => (
          <div key={emotion} className="flex flex-col items-center">
            {/* Emotion Icon above the button */}
            <img
              src={/emoji/${emotion}-icon.png} // Correct relative path for the emoji icon
              alt={emotion}
              className="w-32 h-32 mb-4" // 4 times bigger image size (128px)// Adjust the size of the icon (larger)
            />
            
            {/* Emotion Button */}
            <button
              onClick={() => handleEmotionClick(emotion)}
              className="emotion-button border border-black text-gray-800 py-3 px-6 rounded-full shadow-sm hover:bg-gray-100 transition-transform transform hover:scale-105"
            >
            {/* Emotion Label */}
                <span className="text-sm">{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                </button>
                </div>
              ))}
          </div>


        {/* Slider for Percentage */}
        {selectedEmotion && (
          <div id="sliderContainer" className="flex flex-col items-center">
            <label
              id="emotionLabel"
              htmlFor="emotionSlider"
              className="block text-center text-gray-600 mb-2"
            >
              How {selectedEmotion} do you feel?
            </label>
            <input
              type="range"
              id="emotionSlider"
              min="1"
              max="5"
              value={sliderValue}
              step="1"
              onChange={handleSliderChange}
              className="w-full border-black"
            />
            <p id="percentageValue" className="text-center text-gray-600 mt-2">
              {sliderValue}
            </p>

            {/* Emotion Levels */}
            <div className="mt-4">
              <ul className="text-sm text-gray-700 text-center">
                <li>
                  <span className="font-bold">1:</span> Very minimal
                </li>
                <li>
                  <span className="font-bold">2:</span> Just a little
                </li>
                <li>
                  <span className="font-bold">3:</span> Just right
                </li>
                <li>
                  <span className="font-bold">4:</span> Really{" "}
                  <span className="italic">{selectedEmotion}</span>
                </li>
                <li>
                  <span className="font-bold">5:</span> Extremely{" "}
                  <span className="italic">{selectedEmotion}</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition-colors mt-4"
            >
              Submit
            </button>
          </div>
        )}
      </div>

      <Calendar />
    </div>
  );
}