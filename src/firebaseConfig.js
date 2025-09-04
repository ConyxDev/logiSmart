
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDRVWntPaOomb6qXu7WLjfojcjCg6H0rB4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "logiciel-infirmier.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://logiciel-infirmier-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "logiciel-infirmier",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "logiciel-infirmier.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "8440825548",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:8440825548:web:e417d1206dfb8ee6ab6469",
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

if (process.env.NODE_ENV === "development") {
  connectStorageEmulator(storage, "127.0.0.1", 9299); // Utilisez le nouveau port
}


export const auth = getAuth(app);
export const database = getDatabase(app);
export { storage };
export default app;