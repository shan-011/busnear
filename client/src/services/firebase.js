import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAvjjZZ8Px1iPa8Kg46LZbYtVNF7U8nAHA",
  authDomain: "gps-busnear.firebaseapp.com",
  databaseURL: "https://gps-busnear-default-rtdb.firebaseio.com",
  projectId: "gps-busnear",
  storageBucket: "gps-busnear.firebasestorage.app",
  messagingSenderId: "808012345678", // Replace with your actual Sender ID if available
  appId: "1:808012345678:web:abcdef123456" // Replace with your actual App ID if available
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export const auth = getAuth(app)
export default app
