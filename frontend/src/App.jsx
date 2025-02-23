// import React from "react";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import { SignIn, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import "./styles/App.css"; // Import the CSS file
// import Home from "./components/Home";

// export default function App() {
//   return (
//     <BrowserRouter>
//       {/* Navbar */}
//       <nav className="navbar">
//         {/* Logo on the left */}
//         <div className="logo">
//           <Link to="/">FakeJobDetect</Link>
//         </div>

//         {/* Navigation links on the right */}
//         <div className="nav-links">
//           <Link to="/" className="nav-link">Home</Link>
//           <Link to="/aboutus" className="nav-link">About Us</Link>
//           <Link to="/admin" className="nav-link">Admin</Link>
//           <Link to="/contactus" className="nav-link">Contact Us</Link>
//         </div>

//         {/* Authentication section */}
//         <div className="auth-section">
//           <SignedOut>
//             <SignInButton mode="modal">
//               <button className="get-started-button">SignIn</button>
//             </SignInButton>
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//         </div>
//       </nav>

//       {/* Routes */}
//       <Routes>
//         <Route path="/" element={<Home></Home>} />
//         <Route path="/aboutus" element={<h1>About Us</h1>} />
//         <Route path="/admin" element={<h1>Admin Panel</h1>} />
//         <Route path="/contactus" element={<h1>Contact Us</h1>} />
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