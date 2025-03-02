"use client";
import { useState, useEffect } from "react";
import Calendar from "./components/Calendar.js";
import { motion, AnimatePresence } from "framer-motion"; // Import animation library
import { connectFirebase, addEmotions, getEvents, getAievents, addAievents } from "../../backend/firebase.js";

export default function Home() {
  const emotionLevels = ["Very minimal", "Just a bit", "Moderate", "Very", "Extremely"];
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [sliderValue, setSliderValue] = useState(2);
  const [isVisible, setIsVisible] = useState(false); // Controls Emotif Bar visibility
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls pop-up modal visibility
  const [events, setEvents] = useState([]); // State to store events
  const [aievents, setAievents] = useState([]); // State to store AI events
  const [db, dbRef] = connectFirebase(); // Connect Firebase
  const [suggestedActivities, setSuggestedActivities] = useState([]);
  const [modalMessage, setModalMessage] = useState("");

  // Toggle Emotif Bar visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
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
    setModalMessage("Emotion submitted successfully!");
    setIsModalOpen(true);

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

      console.log(result.suggestedActivities);

      if (response.ok) {

        console.log("suggested activities", JSON.parse(result.suggestedActivities))

        //parse to json
        const aiSuggstion = JSON.parse(result.suggestedActivities);
        console.log("date", aiSuggstion[0].date);

        //getting the data
        const AIdata = {
          date: aiSuggstion[0].date,
          endtime: aiSuggstion[0].endtime,
          name: aiSuggstion[0].name,
          starttime: aiSuggstion[0].starttime
        };

        //add the AI event suggestion data
        addAievents(db, AIdata)
 

      } else {
        setModalMessage('Error: ' + result.error);
        setIsModalOpen(true);
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

  const fetchAievents = async () => {
    try {
      const aieventsData = await getAievents(dbRef); // Fetch AI events from Firebase
      console.log('Fetched AI Events:', aieventsData); // Log AI events in console
      
      // Check if data is available
      if (aieventsData !== "No data available") {
        setAievents(aieventsData); // Update AI events state
      }
      
      //change the object to an array and filter out null events
      const aieventsArray = Object.values(aieventsData); // Convert object to array
      const validAievents = aieventsArray.filter(event => event !== null); // Remove null events
      
      //if there are valid events, set the modal message for the first event
      if (validAievents.length > 0) {
        const firstEvent = validAievents[0]; //get the first valid event


        //format the date
        const date = new Date(firstEvent.date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        //TODO: format the time 12hour

        setModalMessage(`${firstEvent.name} on ${formattedDate} from ${firstEvent.starttime} to ${firstEvent.endtime}`);
        setIsModalOpen(true);
      }
      
    } catch (error) {
      console.error('Error fetching AI events:', error); 
    }
  };
  

  useEffect(() => {
    fetchEvents(); //fetch events when component mounts
  }, []);

  return (
    <div className="emotif-div bg-gray-100 p-6 relative">
      {/* Logo Button to Toggle Emotif Bar */}
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
                  onClick={handleSubmit} // Open modal instead of alert
                  className="bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition-colors mt-4"
                >
                  Submit
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-Up Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
              <h2 className="text-lg font-bold mb-2">Emotif AI Notifcation!</h2>
              <p className="text-gray-600">{modalMessage}</p>
              
              <button
                onClick={() => setIsModalOpen(false)} // Close modal
                className="mt-4 bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Calendar />
    </div>
  );
}
