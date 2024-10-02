import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const config = {
  apiKey: "AIzaSyCAvvjKMJw9ATFufmfK5w6AWoSYVr5DL4k",
  authDomain: "techconnect-1e55d.firebaseapp.com",
  projectId: "techconnect-1e55d",
  storageBucket: "techconnect-1e55d.appspot.com",
  messagingSenderId: "42876821709",
  appId: "1:42876821709:web:d6af72e92a28e00db74984",
  measurementId: "G-2WK693PREV",
};

// Initialize Firebase app
const firebaseApp = initializeApp(config);

// Initialize services
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

// Firestore collections
const fire_posts = collection(firestore, "posts");
const fire_comments = collection(firestore, "comments");

export { firebaseApp, firestore, storage, auth, fire_posts, fire_comments };