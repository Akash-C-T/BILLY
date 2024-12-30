import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // Set logged-in user
      } else {
        navigate('/');  // Redirect to login if not authenticated
      }
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.displayName || 'User'}</h1>
          {/* Add more content for the Dashboard */}
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default Dashboard;
