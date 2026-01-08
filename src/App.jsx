import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Concerts from "./pages/Concerts";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={<Home isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />}
      />
      <Route
        path="/artists"
        element={
          <Artists isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
        }
      />
      <Route
        path="/concerts"
        element={
          <Concerts isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
        }
      />
    </Routes>
  );
}
