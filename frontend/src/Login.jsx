// import React, { useState } from "react";
// import { User, Shield, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Sparkles } from "lucide-react";

// export default function Login({ setUser = () => {} }) {
//   const [isAdminLogin, setIsAdminLogin] = useState(false);
//   const [isSignup, setIsSignup] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });

//   // Mock navigate function for demo
//   const navigate = (path) => console.log('Navigating to:', path);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const submit = async (e) => {
//     e.preventDefault();
//     if (isSignup) {
//       // register - Demo version
//       console.log('Signup with:', form);
//       alert('Registration successful!');
//       setIsSignup(false);
//     } else {
//       // login - Demo version
//       console.log('Login with:', { email: form.email, password: form.password, isAdminLogin });
//       const mockUser = { name: form.email.split('@')[0], isAdmin: isAdminLogin };
//       setUser(mockUser);
//       navigate(isAdminLogin ? "/admin" : "/user-home");
//       alert(`Logged in as ${isAdminLogin ? 'Admin' : 'User'}!`);
//     }
//   };

//   return (
//     <div className="w-screen h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden" style={{margin: 0, padding: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
//       {/* Animated background elements */}
//       <div className="absolute inset-0 w-full h-full overflow-hidden">
//         <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//         <div className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
//         <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-1000"></div>
//         <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-3000"></div>
//       </div>

//       {/* Floating particles */}
//       <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
//         {[...Array(30)].map((_, i) => (
//           <div
//             key={i}
//             className={`absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float`}
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${3 + Math.random() * 4}s`
//             }}
//           />
//         ))}
//       </div>

//       {/* Main container */}
//       <div className="relative w-full max-w-md mx-auto z-10">
//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-105">
//           {/* Logo and title */}
//           <div className="text-center mb-6">
//             <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3 animate-pulse">
//               <Sparkles className="w-6 h-6 text-white" />
//             </div>
//             <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
//               {isSignup ? "Create Account" : isAdminLogin ? "Admin Portal" : "Welcome Back"}
//             </h2>
//             <p className="text-white/70 mt-1 text-sm">
//               {isSignup ? "Join our amazing platform" : "Sign in to continue"}
//             </p>
//           </div>

//           {/* Mode selection buttons */}
//           <div className="flex gap-1 mb-5 p-1 bg-white/5 rounded-xl backdrop-blur-sm">
//             <button
//               onClick={() => { setIsAdminLogin(false); setIsSignup(false); }}
//               className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
//                 !isAdminLogin && !isSignup
//                   ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
//                   : 'text-white/70 hover:text-white hover:bg-white/10'
//               }`}
//             >
//               <User className="w-3 h-3" />
//               User Login
//             </button>
//             <button
//               onClick={() => { setIsAdminLogin(true); setIsSignup(false); }}
//               className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
//                 isAdminLogin
//                   ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg transform scale-105'
//                   : 'text-white/70 hover:text-white hover:bg-white/10'
//               }`}
//             >
//               <Shield className="w-3 h-3" />
//               Admin
//             </button>
//           </div>

//           {/* Signup toggle for user mode */}
//           {!isAdminLogin && (
//             <div className="text-center mb-5">
//               <button
//                 onClick={() => setIsSignup(!isSignup)}
//                 className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/50 hover:decoration-purple-300 transition-colors duration-300 text-sm"
//               >
//                 {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
//               </button>
//             </div>
//           )}

//           {/* Form */}
//           <div className="space-y-4">
//             {/* Name field for signup */}
//             {isSignup && (
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User className="h-4 w-4 text-white/50 group-focus-within:text-purple-400 transition-colors duration-300" />
//                 </div>
//                 <input
//                   name="name"
//                   placeholder="Full Name"
//                   value={form.name}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
//                 />
//               </div>
//             )}

//             {/* Email field */}
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Mail className="h-4 w-4 text-white/50 group-focus-within:text-purple-400 transition-colors duration-300" />
//               </div>
//               <input
//                 name="email"
//                 placeholder="Email Address"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
//               />
//             </div>

//             {/* Password field */}
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Lock className="h-4 w-4 text-white/50 group-focus-within:text-purple-400 transition-colors duration-300" />
//               </div>
//               <input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors duration-300"
//               >
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </button>
//             </div>

//             {/* Confirm password field for signup */}
//             {isSignup && (
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-4 w-4 text-white/50 group-focus-within:text-purple-400 transition-colors duration-300" />
//                 </div>
//                 <input
//                   name="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   placeholder="Confirm Password"
//                   value={form.confirmPassword}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors duration-300"
//                 >
//                   {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             )}

//             {/* Submit button */}
//             <button
//               onClick={submit}
//               className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
//             >
//               {isSignup ? (
//                 <>
//                   <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
//                   Create Account
//                 </>
//               ) : (
//                 <>
//                   <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//                   Sign In
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Footer */}
//           <div className="mt-6 text-center">
//             <p className="text-white/50 text-xs">
//               Secure • Encrypted • Protected
//             </p>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0% {
//             transform: translate(0px, 0px) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//           100% {
//             transform: translate(0px, 0px) scale(1);
//           }
//         }
        
//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-20px);
//           }
//         }

//         .animate-blob {
//           animation: blob 7s infinite;
//         }

//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }

//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }

//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </div>
//   );
// }

















import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Sparkles } from "lucide-react";

export default function Login({ setUser }) {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSignup) {
        // register
        if (form.password !== form.confirmPassword) {
          throw new Error("Passwords don't match");
        }

        const res = await fetch("http://localhost:5003/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }
        
        // Show success and switch to login
        setIsSignup(false);
        setForm({ ...form, password: "", confirmPassword: "" });
        setError(""); // Clear any previous errors
      } else {
        // login
        const res = await fetch("http://localhost:5003/api/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            isAdminLogin
          })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }
        
        // Success - set user and navigate
        setUser(data.user);
        navigate(data.user.isAdmin ? "/admin" : "/user-home");
      }
    } catch (err) {
      setError(err.message);
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden" style={{margin: 0, padding: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-3000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-md mx-auto z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 hover:scale-105">
          {/* Logo and title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3 animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {isSignup ? "Create Account" : isAdminLogin ? "Admin Portal" : "Welcome Back"}
            </h2>
            <p className="text-white/70 mt-1 text-sm">
              {isSignup ? "Join our amazing platform" : "Sign in to continue"}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Mode selection buttons */}
          <div className="flex gap-1 mb-5 p-1 bg-white/5 rounded-xl backdrop-blur-sm">
            <button
              onClick={() => { setIsAdminLogin(false); setIsSignup(false); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                !isAdminLogin && !isSignup
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <User className="w-3 h-3" />
              User Login
            </button>
            <button
              onClick={() => { setIsAdminLogin(true); setIsSignup(false); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                isAdminLogin
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg transform scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>
          </div>

          {/* Signup toggle for user mode */}
          {!isAdminLogin && (
            <div className="text-center mb-5">
              <button
                onClick={() => { setIsSignup(!isSignup); setError(""); }}
                className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/50 hover:decoration-purple-300 transition-colors duration-300 text-sm"
              >
                {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* Name field for signup */}
            {isSignup && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-white/50 group-focus-within:text-purple-400 transition-colors duration-300" />
                </div>
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                  required
                />
              </div>
            )}

            {/* Email field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-white/50 group-focus-within:text-purple-400 transition-colors duration-300" />
              </div>
              <input
                name="email"
                placeholder="Email Address"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                required
              />
            </div>

            {/* Password field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-white/50 group-focus-within:text-purple-400 transition-colors duration-300" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors duration-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Confirm password field for signup */}
            {isSignup && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-white/50 group-focus-within:text-purple-400 transition-colors duration-300" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={submit}
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : isSignup ? (
                <>
                  <UserPlus className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  Sign In
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-white/50 text-xs">
              Secure • Encrypted • Protected
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}