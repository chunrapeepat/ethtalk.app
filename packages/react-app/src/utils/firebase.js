import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore } from "firebase/firestore";
import { connectAuthEmulator } from "@firebase/auth";
import { connectFirestoreEmulator } from "@firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// TODO: store firebase config inside .env instead
const firebaseConfig = {
  apiKey: "AIzaSyBeRAiuKDBCQQ17ihc3j_4OgDLnNEYVGLk",
  authDomain: "ethtalk.firebaseapp.com",
  projectId: "ethtalk",
  storageBucket: "ethtalk.appspot.com",
  messagingSenderId: "362072049625",
  appId: "1:362072049625:web:467665d4fd8a67807dbbc8",
  measurementId: "G-0BW4MBSVM5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const firestore = getFirestore(app);

if (process.env.NODE_ENV === "development") {
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(firestore, "localhost", 8080);
  console.log("?");
}
