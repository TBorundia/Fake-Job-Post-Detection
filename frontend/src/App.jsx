// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import ValidateInput from './ValidateInput'
// // import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <ValidateInput />
//     </>
//   )
// }

// export default App

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <header className="header">
        {/* Show Sign-In button for signed-out users */}
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>

        {/* Show User Profile button for signed-in users */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<h1>Welcome to the Home Page!</h1>} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <h1>Welcome to the Dashboard!</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
