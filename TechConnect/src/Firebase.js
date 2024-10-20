import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const config = {
  apiKey: "AIzaSyANVxg0hxd7aS9EC-D0hIODDKsiyc19zSc",
  authDomain: "techx-68403.firebaseapp.com",
  projectId: "techx-68403",
  storageBucket: "techx-68403.appspot.com",
  messagingSenderId: "146026279403",
  appId: "1:146026279403:web:d8ec3f93f301f480f4e9ae",
  measurementId: "G-CK6ZNXK48T"
};

// Initialize Firebase
const firebaseApp = initializeApp(config);

// Initialize services
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Named exports for services
export { firebaseApp, db, auth, storage };

// Default export: Bundle services together
export default {
  firebaseApp,
  db,
  auth,
  storage,
};