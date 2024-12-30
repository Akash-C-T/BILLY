import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig'; // Import Firebase config
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import '../App.css'; // Correct path to App.css

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and SignUp
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null); // Track logged-in user
  const [isResetPassword, setIsResetPassword] = useState(false); // Track Reset Password Mode

  useEffect(() => {
    // Listen for changes in authentication state (user logged in/out)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Update user when logged in
      } else {
        setUser(null); // If no user, reset to null
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  // Handle input changes (Form State)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  // Handle form submission (Login or Sign-Up)
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLogin) {
      // Login logic
      try {
        await signInWithEmailAndPassword(auth, formState.email, formState.password);
        setMessage(''); // No message after login (only show the welcome message below)
      } catch (error) {
        setMessage('Failed to log in: ' + error.message);
      }
    } else {
      // Sign-up logic
      if (formState.password !== formState.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        // Create new user in Firebase Authentication
        await createUserWithEmailAndPassword(auth, formState.email, formState.password);
        
        // Store user details in Firestore
        const userDocRef = doc(db, 'users', formState.email);
        await setDoc(userDocRef, {
          fullName: formState.fullName,
          email: formState.email
        });

        // After successful sign-up, reset form and show the message
        setMessage('Account created successfully! Please login to continue.');

        // Switch to login mode after sign-up (without auto-login)
        setIsLogin(true);
        setFormState({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

      } catch (error) {
        setMessage('Failed to create account: ' + error.message);
      }
    }
  };

  // Toggle between Login and Sign-Up modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormState({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setMessage(''); // Reset message on mode change
  };

  // Logout functionality
  const handleLogout = () => {
    auth.signOut(); // Firebase logout method
    setMessage(''); // Reset message after logout
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!formState.email) {
      setMessage('Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formState.email);
      setMessage('Password reset email sent! Check your inbox.');
      setIsResetPassword(false); // Reset the mode after sending the reset email
    } catch (error) {
      setMessage('Failed to send reset email: ' + error.message);
    }
  };

  return (
    <div className="background-container">
      <div className="circle small"></div>
      <div className="circle medium"></div>
      <div className="circle large"></div>

      <div className="auth-container">
        <div className="form-wrapper">
          {!user ? (
            <>
              <div className="tabs">
                <button
                  className={`tab ${isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={`tab ${!isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>

              {isResetPassword ? (
                // Password reset form
                <div>
                  <h2>Reset Password</h2>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <button onClick={handleForgotPassword} className="submit-button">
                    Send Reset Link
                  </button>
                  <p className="toggle-text">
                    Remembered your password? <span onClick={() => setIsResetPassword(false)} className="toggle-link">Go back to Login</span>
                  </p>
                  {message && <p>{message}</p>}
                </div>
              ) : (
                // Regular Login or Sign-Up form
                <form className="auth-form" onSubmit={handleSubmit}>
                  <h2 className="form-title">{isLogin ? 'Login Form' : 'Sign Up Form'}</h2>

                  {/* Show full name input only for sign-up */}
                  {!isLogin && (
                    <div className="form-group">
                      <input
                        type="text"
                        name="fullName"
                        value={formState.fullName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        required
                      />
                    </div>
                  )}

                  {/* Email input for both Login and Sign-Up */}
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      required
                    />
                  </div>

                  {/* Password input for both Login and Sign-Up */}
                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      value={formState.password}
                      onChange={handleInputChange}
                      placeholder={isLogin ? "Password" : "Create Password"}
                      required
                    />
                  </div>

                  {/* Confirm password input for Sign-Up only */}
                  {!isLogin && (
                    <div className="form-group">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formState.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        required
                      />
                    </div>
                  )}

                  <div className="extra-options">
                    {isLogin && (
                      <a
                        href="#"
                        className="forgot-password"
                        onClick={() => setIsResetPassword(true)}
                      >
                        Forgot password?
                      </a>
                    )}
                  </div>

                  <button type="submit" className="submit-button">
                    {isLogin ? 'Login' : 'Create Account'}
                  </button>

                  <p className="toggle-text">
                    {isLogin ? "Not a member?" : "Already a member?"}
                    <span onClick={toggleMode} className="toggle-link">
                      {isLogin ? ' Sign Up now' : ' Login'}
                    </span>
                  </p>
                  {message && <p>{message}</p>} {/* Display messages */}
                </form>
              )}
            </>
          ) : (
            // Display welcome message when user is logged in
            <div>
              <h2>Welcome, {user.email}!</h2>
              <button onClick={handleLogout}>Log Out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
