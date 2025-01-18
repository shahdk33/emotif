// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

// https://firebase.google.com/docs/web/setup#available-libraries

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
const database = getDatabase(app);
const dbRef = ref(getDatabase());
get(child(dbRef, `events/`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});