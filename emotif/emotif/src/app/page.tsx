"use client"; 
import { useState, useEffect } from "react";
import Calendar from "./components/Calendar.js";
import { connectFirebase, addEmotions, getEvents, getAievents } from "../../backend/firebase.js";

export default function Home() {
  const emotionLevels = ["Very minimal", "Just a bit", "Moderate", "Very", "Extremely"];
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [sliderValue, setSliderValue] = useState(2);
  const [events, setEvents] = useState([]); // State to store events
  const [aievents, setAievents] = useState([]); // State to store AI events
  const [suggestedActivities, setSuggestedActivities] = useState([]);
  const [db, dbRef] = connectFirebase(); // Connect Firebase

  // Fetch events from Firebase
  const fetchEvents = async () => {
    try {
      const eventsData = await getEvents(dbRef); // Get events from Firebase
      console.log('Fetched Events:', eventsData); // Log events in console
      if (eventsData !== "No data available") {
        const parsedEvents = JSON.parse(eventsData); // Parse the events data
        // Filter out any null events before setting state
        const validEvents = parsedEvents.filter(event => event !== null);
        setEvents(validEvents); // Update state with valid events
      }
    } catch (error) {
      console.error('Error fetching events:', error); // Handle errors
    }
  };

  // Fetch AI events from Firebase
  const fetchAievents = async () => {
    try {
      const aieventsData = await getAievents(dbRef); // Fetch AI events from Firebase
      console.log('Fetched AI Events:', aieventsData); // Log AI events in console
      if (aieventsData !== "No data available") {
        setAievents(aieventsData); // Update AI events state
      }
      const validAievents = aieventsData.filter(event => event !== null); // Remove null events
      validAievents.forEach(event => {
        // Alert with event details: name, date, starttime, and endtime
        alert(`Emotif AI recommends you do "${event.name}" on ${event.date} from ${event.starttime} to ${event.endtime}`);
      });    } catch (error) {
      console.error('Error fetching AI events:', error); // Handle errors

    }
  };

  // Use effect to fetch events on component mount
  useEffect(() => {
    fetchEvents(); // Fetch events when component mounts
  }, []);

  const handleEmotionClick = (emotion) => {
    setSelectedEmotion(emotion); // Set selected emotion
  };

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value); // Update slider value
  };

  const handleSubmit = async () => {
    // Add emotion data to Firebase
    const emotionData = {
      date: new Date().toISOString().split("T")[0], // Current date
      time: new Date().toLocaleTimeString(), // Current time
      emotion: selectedEmotion,
      level: sliderValue,
    };
    addEmotions(db, emotionData); // Add emotion data to Firebase
    alert("Emotion submitted successfully!");

    // Prepare data to send to askGemeni API
    const data = {
      events: events,
      emotions: [{
        date: emotionData.date,
        emotion: emotionData.emotion,
        level: emotionData.level,
        time: emotionData.time
      }]
    };


    // Make a POST request to askGemeni API
    try {
      const response = await fetch('/api/askGemeni', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("RESULT", result.suggestedActivities);

      if (response.ok) {
        setSuggestedActivities(result.suggestedActivities); // Set suggested activities
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error calling askGemeni API:', error);
    }

    // Fetch and log AI events from Firebase after submission
    fetchAievents();

    // Reset state
    setSelectedEmotion("");
    setSliderValue(2);
  };

  return (

    
    <div className="emotif-div bg-gray-100 p-6">
      <div className="mx-auto bg-white rounded-lg p-6 shadow-lg w-[50%] h-auto mb-6">
        <p className="text-center text-gray-600"> 
        <img src="/emoji/logo.jpg" alt="Logo" className="h-12 w-auto" />
        
        HOW ARE YOU FEELING RIGHT NOW? </p>
        {/* Emotion Buttons */}
        <div className="flex justify-center gap-4 my-6">
          {["happy", "anxious", "confident", "angry", "tired"].map((emotion) => (
            <div key={emotion} className="flex flex-col items-center">
              {/* Emotion Icon above the button */}
              <img
                src={`/emoji/${emotion}-icon.png`} // Corrected relative path for the emoji icon
                alt={emotion}
                className="w-20 h-20 mb-2" // Adjust the size of the icon (larger)
              />
              {/* Emotion Button */}
              <button
                onClick={() => handleEmotionClick(emotion)}
                className=" emotion-button border border-black text-gray-800 px-6 rounded-full shadow-sm hover:bg-gray-100 transition-transform transform hover:scale-105"
              >
                {/* Emotion Label */}
                <span className="text-sm">{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Slider for Percentage */}
        {selectedEmotion && (
          <div id="sliderContainer" className="max-w-lg flex flex-col items-center justify-center m-auto ">
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
            {emotionLevels[sliderValue - 1]}
            </p>

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
