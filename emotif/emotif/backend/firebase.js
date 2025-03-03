// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, child, get, push, set, remove} = require("firebase/database");

// https://firebase.google.com/docs/web/setup#available-libraries

function connectFirebase() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBLxfABkXzNfnu2Yw8xMxKsvHjZAPhdhtM",
        authDomain: "emotif-221b2.firebaseapp.com",
        databaseURL: "https://emotif-221b2-default-rtdb.firebaseio.com",
        projectId: "emotif-221b2",
        storageBucket: "emotif-221b2.firebasestorage.app",
        messagingSenderId: "160120301390",
        appId: "1:160120301390:web:741e1311224188f8baa01f"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const dbRef = ref(getDatabase());
    return [db,dbRef];
  }

  function getEvents(dbRef) {
    return get(child(dbRef, `events/`)) // Return the promise from `get`
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(JSON.stringify(snapshot.val()));
          return JSON.stringify(Object.values(snapshot.val())); // Return the data if exists
        } else {
          return "No data available"; // Return a message if no data is available
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error); // Log the error
        return error; // Return the error message
      });
  }
  
function getEmotions(dbRef){
    get(child(dbRef, `emotions/`)).then((snapshot) => {
        if (snapshot.exists()) {
          return JSON.stringify(snapshot.val());
        } else {
          return "No data available";
        }
      }).catch((error) => {
        return error;
      });
}
function getAievents(dbRef){
  return get(child(dbRef, `aievents/`)) // Return the promise directly
    .then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(JSON.stringify(Object.values(snapshot.val())));
        return JSON.stringify(Object.values(snapshot.val()));  // Return the data directly (no need to stringify)
      } else {
        return "No data available"; // Return a message if no data is available
      }
    })
    .catch((error) => {
      console.error("Error fetching ai events:", error); // Log the error
      return error; // Return the error message
    });
}
function addEmotions(db, emotion){
    // const emotion = {
    //     "date": "20-01-2025",
    //     "emotion": "joy",
    //     "level": 5,
    //     "time": "10:47"
    //   };
    const emotionsList = ref(db, 'emotions');
    const newEmotion = push(emotionsList);
    set(newEmotion, emotion);
    
}
function addEvents(db,event){
    // const event = {
    //     "date": "20-01-2025",
    //     "endtime": "19:00",
    //     "name": "WiTS meeting",
    //     "starttime": "18:00"
    //   };
    const eventsList = ref(db, 'events');
    const newEvent = push(eventsList);
    set(newEvent, event);
    
}
function addAievents(db,aievent){
    // const aievent = {a
    //     "date": "20-01-2025",
    //     "endtime": "19:00",
    //     "name": "AI suggestion: go for walk",
    //     "starttime": "18:00"
    //   };
    const aieventsList= ref(db, 'aievents');
    const newAievents = push(aieventsList);
    set(newAievents, aievent);
    
}
function removeAievent(db, name, date, starttime, endtime) {
  const dbRef = ref(db); // Database reference

  return get(child(dbRef, "aievents/")) // Return the promise directly
    .then((snapshot) => {
      if (snapshot.exists()) {
        const events = snapshot.val();
        let eventIdToDelete = null;

        // Loop through events and find a match
        Object.keys(events).forEach((eventId) => {
          const event = events[eventId];
          if (
            event.name === name &&
            event.date === date &&
            event.starttime === starttime &&
            event.endtime === endtime
          ) {
            eventIdToDelete = eventId; // Store the event ID to delete
          }
        });

        if (eventIdToDelete) {
          return remove(ref(db, `aievents/${eventIdToDelete}`))
            .then(() => `Event "${name}" removed successfully.`)
            .catch((error) => {
              console.error("Error deleting event:", error);
              return error;
            });
        } else {
          return "No matching event found.";
        }
      } else {
        return "No data available";
      }
    })
    .catch((error) => {
      console.error("Error fetching ai events:", error);
      return error;
    });
}
module.exports = {
  connectFirebase,
  getEvents,
  getEmotions,
  getAievents,
  addEmotions,
  addEvents,
  addAievents,
  removeAievent
};
