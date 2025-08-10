// import React, { useState, useEffect } from "react";
// import AdminPanel from "./components/AdminPanel";
// import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
// import { FaHome, FaInfoCircle, FaSearch, FaSun, FaMoon } from "react-icons/fa";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import "./styles/App.css";
// import Home from "./components/Home";
// import CompleteBackend from "./CompleteBackend";
// import AboutUs from "./AboutUs";
// import JobResult from "./components/JobResult";
// import Login from "./Login";

// export default function App() {
//   const [theme, setTheme] = useState("light");
//   const [user, setUser] = useState(null);
  
//   useEffect(() => {
//     if (theme === "dark") {
//       document.body.classList.add("dark-theme");
//       document.body.classList.remove("light-theme");
//     } else {
//       document.body.classList.add("light-theme");
//       document.body.classList.remove("dark-theme");
//     }
//   }, [theme]);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/me", {
//       credentials: "include"
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.user) {
//           setUser(data.user);
//           // No need to navigate here - the Routes will handle it
//         }
//       });
//   }, []);

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch("http://localhost:5000/api/logout", {
//         method: "POST",
//         credentials: "include"
//       });
//       setUser(null);
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <BrowserRouter>
//       {user ? (
//         <>
//           <nav className="navbar">
//             <div className="navbar-container">
//               <div className="logo">
//                 <Link to="/">TRAP</Link>
//               </div>
              
//               <div className="nav-links">
//                 <Link to="/" className="nav-link">
//                   <span className="nav-text">Home</span>
//                   <span className="nav-icon"><FaHome /></span>
//                 </Link>
//                 <Link to="/aboutus" className="nav-link">
//                   <span className="nav-text">About Us</span>
//                   <span className="nav-icon"><FaInfoCircle /></span>
//                 </Link>
//                 <Link to="/analyzepost" className="nav-link">
//                   <span className="nav-text">Analyze Post</span>
//                   <span className="nav-icon"><FaSearch /></span>
//                 </Link>
//                 <button onClick={toggleTheme} className="theme-toggle-btn">
//                   <span className="nav-text">{theme === "light" ? "Dark" : "Light"}</span>
//                   <span className="nav-icon">
//                     {theme === "light" ? <FaMoon /> : <FaSun />}
//                   </span>
//                 </button>
//               </div>
              
//               <div className="auth-section">
//                 <button onClick={handleLogout} className="get-started-button">
//                   Logout
//                 </button>
//                 <div className="user-avatar">
//                   {user?.username?.charAt(0).toUpperCase()}
//                 </div>
//               </div>
//             </div>
//           </nav>
          
//           <Routes>
//             <Route path="/" element={<Home user={user} />} />
//             <Route path="/aboutus" element={<AboutUs />} />
//             <Route
//               path="/analyzepost"
//               element={
//                 <ProtectedRoute user={user}>
//                   <CompleteBackend />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/job-result" element={<JobResult />} />
//             <Route path="/admin" element={
//               user?.isAdmin ? <AdminPanel /> : <Navigate to="/" />
//             } />
//             {/* Redirect any unknown paths to home */}
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </>
//       ) : (
//         <Routes>
//           <Route path="/" element={<Login setUser={setUser} />} />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       )}
//     </BrowserRouter>
//   );
// }











import React, { useState, useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { FaHome, FaInfoCircle, FaSearch, FaSun, FaMoon } from "react-icons/fa";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./styles/App.css";
import Home from "./components/Home";
import CompleteBackend from "./CompleteBackend";
import AboutUs from "./AboutUs";
import JobResult from "./components/JobResult";
import Login from "./Login";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  useEffect(() => {
    fetch("http://localhost:5003/api/me", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          // No need to navigate here - the Routes will handle it
        }
      });
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5003/api/logout", {
        method: "POST",
        credentials: "include"
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

return (
  <BrowserRouter>
    {user ? (
      <>
        {/* Show navbar only for non-admin users */}
        {!user.isAdmin && (
          <nav className="navbar">
            <div className="navbar-container">
              <div className="logo">
                <Link to="/">TRAP</Link>
              </div>
              
              <div className="nav-links">
                <Link to="/" className="nav-link">
                  <span className="nav-text">Home</span>
                  <span className="nav-icon"><FaHome /></span>
                </Link>
                <Link to="/aboutus" className="nav-link">
                  <span className="nav-text">About Us</span>
                  <span className="nav-icon"><FaInfoCircle /></span>
                </Link>
                <Link to="/analyzepost" className="nav-link">
                  <span className="nav-text">Analyze Post</span>
                  <span className="nav-icon"><FaSearch /></span>
                </Link>
                <button onClick={toggleTheme} className="theme-toggle-btn">
                  <span className="nav-text">{theme === "light" ? "Dark" : "Light"}</span>
                  <span className="nav-icon">
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                  </span>
                </button>
              </div>
              
              <div className="auth-section">
                <button onClick={handleLogout} className="get-started-button">
                  Logout
                </button>
                <div className="user-avatar">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Routes */}
        <Routes>
          {!user.isAdmin && (
            <>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route
                path="/analyzepost"
                element={
                  <ProtectedRoute user={user}>
                    <CompleteBackend />
                  </ProtectedRoute>
                }
              />
              <Route path="/job-result" element={<JobResult />} />
            </>
          )}

          {user.isAdmin && (
            <Route
              path="/admin"
              element={<AdminPanel handleLogout={handleLogout} />}
            />
          )}

          {/* Default route based on role */}
          <Route path="*" element={<Navigate to={user.isAdmin ? "/admin" : "/"} />} />
        </Routes>
      </>
    ) : (
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    )}
  </BrowserRouter>
);
}
