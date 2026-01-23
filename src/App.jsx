import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Callback from "./pages/Callback";
import { isAuthenticated, logout as spotifyLogout, getUserProfile, getStoredUserProfile } from "./lib/spotifyAuth";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await isAuthenticated();
      setIsSignedIn(authenticated);
      
      if (authenticated) {
        const storedProfile = getStoredUserProfile();
        if (storedProfile) {
          setUserProfile(storedProfile);
        }
        
        const profile = await getUserProfile();
        if (profile) {
          setUserProfile(profile);
        }
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsSignedIn(false);
      setUserProfile(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogout = () => {
    spotifyLogout();
    setIsSignedIn(false);
    setUserProfile(null);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Home isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} onLogout={handleLogout} userProfile={userProfile} />}
      />
      <Route
        path="/artists"
        element={
          <Artists isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} onLogout={handleLogout} userProfile={userProfile} />
        }
      />
      <Route
        path="/callback"
        element={<Callback onAuthSuccess={checkAuthStatus} />}
      />
    </Routes>
  );
}
