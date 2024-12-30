// src/firebase-config.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHhlWNJ1FybB4XEfMyXU8vK3OTvEq2Kcg",
  authDomain: "auth-form-a065a.firebaseapp.com",
  projectId: "auth-form-a065a",
  storageBucket: "auth-form-a065a.appspot.com",
  messagingSenderId: "27268350267",
  appId: "1:27268350267:web:0539757e5faac8444af71e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication and Firestore instances
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
