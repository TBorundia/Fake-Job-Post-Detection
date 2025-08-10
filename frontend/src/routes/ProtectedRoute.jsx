/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// import React from "react";
// import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// export default function ProtectedRoute({ children }) {
//   return (
//     <>
//       <SignedIn>{children}</SignedIn>
//       <SignedOut>
//         <RedirectToSignIn />
//       </SignedOut>
//     </>
//   );
// }





import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;