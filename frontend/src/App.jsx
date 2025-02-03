// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import {
//   SignIn,
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";
// import ProtectedRoute from "./routes/ProtectedRoute";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <header className="header">
//         {/* Show Sign-In button for signed-out users */}
//         <SignedOut>
//           <SignInButton mode="modal" />
//         </SignedOut>

//         {/* Show User Profile button for signed-in users */}
//         <SignedIn>
//           <UserButton />
//         </SignedIn>
//       </header>

//       <Routes>
//         {/* Public Route */}
//         <Route path="/" element={<h1>Welcome to the Home Page!</h1>} />

//         {/* Protected Route */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <h1>Welcome to the Dashboard!</h1>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import React from "react";
import CompleteBackend from "./CompleteBackend";

function App() {
  return (
    <div className="app">
      <CompleteBackend />
    </div>
  );
}

export default App;