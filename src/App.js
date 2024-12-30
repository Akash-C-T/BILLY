import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm'; // Default import of AuthForm component
import CommentSection from './components/CommentSection'; // Default import of CommentSection component
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Auth
import './App.css'; // CSS styles

const App = () => {
  const [user, setUser] = useState(null); // State to store authenticated user

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the logged-in user or null
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  return (
    <Router>
      <Routes>
        {/* If user is logged in, redirect to comment section, otherwise show AuthForm */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/comment-section" /> : <AuthForm />} 
        />
        
        {/* If user is logged in, show CommentSection, otherwise redirect to login */}
        <Route 
          path="/comment-section" 
          element={user ? <CommentSection /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
