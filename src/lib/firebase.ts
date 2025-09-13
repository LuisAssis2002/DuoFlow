import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiGuKhsu99PQkPB70PkhWJP-G4LatbpDA",
  authDomain: "duoflow-1762f.firebaseapp.com",
  projectId: "duoflow-1762f",
  storageBucket: "duoflow-1762f.appspot.com",
  messagingSenderId: "541168092610",
  appId: "1:541168092610:web:30a2e5659df076c0ecc25b",
  measurementId: "G-9K5YS2N0MW"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
