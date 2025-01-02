import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignInForm from './components/SignIn';
import SignUpForm from './components/SignUp';
import Dashboard from './components/Dashboard';
import { UserProvider, useUser } from './utils/UserContext';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-blue-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-lg font-bold">Telcome</h1>
            <UserInfo />
          </nav>

          <div className="p-8">
            <Routes>
              <Route path="/" element={<SignInForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route
                path="/dashboard"
                element={
                  <AuthenticatedRoute>
                    <Dashboard />
                  </AuthenticatedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
};

// Protected route wrapper
const AuthenticatedRoute = ({ children }) => {
  const { user } = useUser(); // Use context to check if user is authenticated

  return user ? children : <Navigate to="/" replace />;
};

// User info component in the navigation bar
const UserInfo = () => {
  const { user } = useUser();

  if (!user || !user.username) return null; // Ensure user and username are defined

  return (
    <div className="flex items-center">
      <div className="mr-2">{user.username}</div>
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-blue-800 font-bold">{user.username.charAt(0).toUpperCase()}</span>
      </div>
    </div>
  );
};

export default App;











// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import SignInForm from './components/SignIn';
// import SignUpForm from './components/SignUp';
// import Dashboard from './components/Dashboard';
// import { UserProvider, useUser } from '../src/utils/UserContext';

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleSignInSuccess = () => {
//     setIsAuthenticated(true);
//   };

//   return (
//     <UserProvider>
//       <Router>
//         <div className="min-h-screen bg-gray-100">
//           <nav className="bg-blue-800 text-white p-4 flex justify-between items-center">
//             <h1 className="text-lg font-bold">Telcome</h1>
           
//           </nav>

//           <div className="p-8">
//             <Routes>
//               <Route
//                 path="/"
//                 element={<SignInForm onSignInSuccess={handleSignInSuccess} />}
//               />
//               <Route path="/signup" element={<SignUpForm />} />
//               <Route
//                 path="/dashboard"
//                 element={
//                   <AuthenticatedRoute>
//                     <Dashboard />
//                   </AuthenticatedRoute>
//                 }
//               />
//             </Routes>
//           </div>
//         </div>
//       </Router>
//     </UserProvider>
//   );
// };

// // Protect routes
// const AuthenticatedRoute = ({ children }) => {
//   const { user } = useUser();
//   return user ? children : <Navigate to="/" replace />;
// };

// // Display user name and icon
// const UserInfo = () => {
//   const { user } = useUser();

//   if (!user || !user.username) return null; // Ensure user and username are defined

//   return (
//     <div className="flex items-center text-white">
//       <div className="mr-2">{user.username}</div>
//       <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//         <span className="text-white font-bold">{user.username.charAt(0)}</span>
//       </div>
//     </div>
//   );
// };

// export default App;
