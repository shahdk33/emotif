"use client"
import { useState } from 'react';

export default function Home() {
  // State to manage emotion selection and slider percentage
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [sliderValue, setSliderValue] = useState(2);

  // Function to handle emotion button click
  const handleEmotionClick = (emotion) => {
    setSelectedEmotion(emotion);
  };

  // Function to handle slider input
  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-4xl text-center font-bold text-gray-800 mb-4">Emotif</h1>
        <p className="text-center text-gray-600">Your AI friend</p>

        {/* Emotion Buttons */}
        <div className="flex justify-center gap-4 my-4">
          {['happy', 'anxious', 'sad', 'angry'].map((emotion) => (
            <button
              key={emotion}
              onClick={() => handleEmotionClick(emotion)}
              className="emotion-button border border-black text-gray-800 py-2 px-4 rounded-full shadow-sm hover:bg-gray-100 transition-transform transform hover:scale-105"
            >
              {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </button>
          ))}
        </div>

        {/* Slider for Percentage */}
        {selectedEmotion && (
          <div id="sliderContainer">
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
              min="0"
              max="5"
              value={sliderValue}
              step="0.5"
              onChange={handleSliderChange}
              className="w-full border-black"
            />
            <p id="percentageValue" className="text-center text-gray-600 mt-2">
              {sliderValue}
            </p>
            <button type="submit">Submit</button>
          </div>
        )}
      </div>
    </div>
  );
}
