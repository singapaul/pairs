import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyD5IBGgJRUMFJToArTJsiy6smoEojf5zuQ",
  authDomain: "pairs-93bc2.firebaseapp.com",
  projectId: "pairs-93bc2",
  storageBucket: "pairs-93bc2.firebasestorage.app",
  messagingSenderId: "27330802603",
  appId: "1:27330802603:web:dbece59700fd69c53398ee",
  measurementId: "G-Q5E4EJP9V7"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const db = getFirestore(app)
export const auth = getAuth(app)
// Only initialize analytics on the client side
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export { app } 