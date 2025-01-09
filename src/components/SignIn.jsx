import React, { useState } from 'react';
import baseUrl from '../utils/BaseUrl';
import { useNavigate } from "react-router-dom";
import { useUser } from '../utils/UserContext';

const SignInForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useUser();
  const navigate = useNavigate();

  // Function to validate form input
  const validateForm = () => {
    setErrorMessage(null); // Clear previous error messages
    if (!formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  // Function to get network information and strength
  const getNetworkInfo = () => {
    if (navigator.connection) {
      const { effectiveType, downlink } = navigator.connection;

      // Determine network strength
      let strength = "Unknown";
      if (downlink >= 10) {
        strength = "Excellent";
      } else if (downlink >= 5) {
        strength = "Good";
      } else if (downlink >= 1) {
        strength = "Fair";
      } else {
        strength = "Poor";
      }

      return {
        type: effectiveType, // e.g., '4g', 'wifi'
        downlink, // Mbps
        rtt: navigator.connection.rtt || "N/A", // Round-trip time in ms (fallback to N/A if unavailable)
        strength, // Network strength
      };
    }

    return null; // Fallback if unsupported
  };

  // Function to get region information using IP-based geolocation
  const getRegionInfo = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Failed to fetch region info');
      const data = await response.json();
      return {
        country: data.country_name,
        region: data.region,
        city: data.city,
      };
    } catch (error) {
      console.error('Error fetching region info:', error);
      return null; // Fallback
    }
  };

  const saveNetworkInfo = async (userId, network, region) => {
    const loaddata = {
      userId,
      network,
      region,
    };

    try {
      const response = await fetch(`${baseUrl}/bot/network-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loaddata),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error saving network info");
      }

      console.log(data.message || "Network info saved successfully.");
    } catch (error) {
      console.error("Error saving network info:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Get network and region information
      const networkInfo = getNetworkInfo();
      const regionInfo = await getRegionInfo();
      // Log the information in the console
    //console.log("Network Information:", networkInfo);
    //console.log("Region Information:", regionInfo);

      // Combine all data
      const payload = {
        ...formData,
      };

      // Send data to the backend
      const response = await fetch(`${baseUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const result = await response.json();
      saveNetworkInfo(result.user._id, networkInfo, regionInfo);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      setUser(result.user);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl">
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://via.placeholder.com/400x500"
            alt="SignIn"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back!</h2>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                required
              />
            </div>
            {/* Password */}
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-10"
                aria-label="Toggle password visibility"
              >
                {/* Icons */}
              </button>
            </div>
            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none hover:bg-blue-700"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
            {/* Error */}
            {errorMessage && (
              <p className="text-red-500 text-center mt-4">{errorMessage}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;











// import React, { useState } from 'react';
// import baseUrl from '../utils/BaseUrl';
// import { useNavigate } from "react-router-dom";
// import { useUser } from '../utils/UserContext';

// const SignInForm = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const { setUser } = useUser();
//   const navigate = useNavigate();

//   // Function to validate form input
//   const validateForm = () => {
//     if (!formData.email.includes("@")) {
//       setErrorMessage("Please enter a valid email address.");
//       return false;
//     }
//     if (formData.password.length < 6) {
//       setErrorMessage("Password must be at least 6 characters long.");
//       return false;
//     }
//     return true;
//   };

//   // Function to get network information and strength
// const getNetworkInfo = () => {
//   if (navigator.connection) {
//     const { effectiveType, downlink } = navigator.connection;

//     // Determine network strength
//     let strength = "Unknown";
//     if (downlink >= 10) {
//       strength = "Excellent";
//     } else if (downlink >= 5) {
//       strength = "Good";
//     } else if (downlink >= 1) {
//       strength = "Fair";
//     } else {
//       strength = "Poor";
//     }

//     return {
//       type: effectiveType, // e.g., '4g', 'wifi'
//       downlink, // Mbps
//       rtt: navigator.connection.rtt, // Round-trip time in ms
//       strength, // Network strength
//     };
//   }

//   return null; // Fallback if unsupported
// };


//   // Function to get region information using IP-based geolocation
//   const getRegionInfo = async () => {
//     try {
//       const response = await fetch('https://ipapi.co/json/');
//       if (!response.ok) throw new Error('Failed to fetch region info');
//       const data = await response.json();
//       return {
//         country: data.country_name,
//         region: data.region,
//         city: data.city,
//       };
//     } catch (error) {
//       console.error('Error fetching region info:', error);
//       return null; // Fallback
//     }
//   };

//   const saveNetworkInfo = async (userId, network, region) => {
//     const loaddata = {
//         userId,
//         network,
//         region,
//     }

//     try {
//         const response = await fetch(`${baseUrl}/bot/network-info`, {
//           method: "POST",
//          headers: { "Content-Type": "application/json" },
//          body: JSON.stringify(loaddata),

//         });
//         console.log(response.data.message);
//     } catch (error) {
//         console.error('Error saving network info:', error);
//     }
// };

//   // Handle form submission
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!validateForm()) return;

//   setIsLoading(true);

//   try {
//     // Get network and region information
//     const networkInfo = getNetworkInfo();
//     const regionInfo = await getRegionInfo();

//     // Log the information in the console
//     //console.log("Network Information:", networkInfo);
//     //console.log("Region Information:", regionInfo);

//     // Combine all data
//     const payload = {
//       ...formData,
//     };
     


//     // Send data to the backend
//     const response = await fetch(`${baseUrl}/users/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Login failed");
//     }

//     const result = await response.json();
//     saveNetworkInfo(result.user._id, networkInfo, regionInfo);
//     localStorage.setItem("user", JSON.stringify(result.user));
//     localStorage.setItem("token", result.token);
//     setUser(result.user);
//     navigate("/dashboard");
//   } catch (error) {
//     setErrorMessage(error.message);
//   } finally {
//     setIsLoading(false);
//   }
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl">
//         <div className="hidden md:block md:w-1/2">
//           <img
//             src="https://via.placeholder.com/400x500"
//             alt="SignIn"
//             className="h-full w-full object-cover"
//           />
//         </div>
//         <div className="w-full md:w-1/2 p-8">
//           <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back!</h2>
//           <form onSubmit={handleSubmit}>
//             {/* Email */}
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                 required
//               />
//             </div>
//             {/* Password */}
//             <div className="mb-4 relative">
//               <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
//                 Password
//               </label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 placeholder="Enter your password"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute right-4 top-10"
//                 aria-label="Toggle password visibility"
//               >
//                 {/* Icons */}
//               </button>
//             </div>
//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
//               disabled={isLoading}
//             >
//               {isLoading ? "Signing In..." : "Sign In"}
//             </button>
//           </form>
//           {/* Forgot Password */}
//           <p className="text-center text-gray-600 mt-4">
//             Forgot your password?{' '}
//             <a href="/forget-password" className="text-blue-600 hover:underline">
//               Reset it here
//             </a>
//           </p>
//           {/* Sign Up Link */}
//           <p className="text-center text-gray-600 mt-2">
//             Don't have an account?{' '}
//             <a href="/signup" className="text-blue-600 hover:underline">
//               Sign up
//             </a>
//           </p>
//           {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignInForm;









// import React, { useState } from 'react';
// import baseUrl from '../utils/BaseUrl';
// import { useNavigate } from "react-router-dom";
// import { useUser } from '../utils/UserContext';
// const SignInForm = ({ onSignInSuccess }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const { setUser } = useUser();
//   const navigate = useNavigate();

//   const validateForm = () => {
//     if (!formData.email.includes("@")) {
//       setErrorMessage("Please enter a valid email address.");
//       return false;
//     }
//     if (formData.password.length < 6) {
//       setErrorMessage("Password must be at least 6 characters long.");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsLoading(true);
//     fetch(`${baseUrl}/users/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           return response.json().then((err) => {
//             throw new Error(err.message || "Login failed");
//           });
//         }
//         return response.json();
//       })
//       .then((result) => {
//         localStorage.setItem("user", JSON.stringify(result.user));
//         localStorage.setItem("token", result.token);
//         setUser(result.user);
//         setIsLoading(false);
//         navigate("/dashboard");
//       })
//       .catch((error) => {
//         setIsLoading(false);
//         setErrorMessage(error.message);
//       });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl">
//         <div className="hidden md:block md:w-1/2">
//           <img
//             src="https://via.placeholder.com/400x500"
//             alt="SignIn"
//             className="h-full w-full object-cover"
//           />
//         </div>
//         <div className="w-full md:w-1/2 p-8">
//           <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back!</h2>
//           <form onSubmit={handleSubmit}>
//             {/* Email */}
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                 required
//               />
//             </div>
//             {/* Password */}
//             <div className="mb-4 relative">
//               <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
//                 Password
//               </label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 placeholder="Enter your password"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute right-4 top-10"
//                 aria-label="Toggle password visibility"
//               >
//                 {/* Icons */}
//               </button>
//             </div>
//             {/* Submit */}
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
//               disabled={isLoading}
//             >
//               {isLoading ? "Signing In..." : "Sign In"}
//             </button>
//           </form>
//           {/* Forgot Password? */}
//           <p className="text-center text-gray-600 mt-4">
//             Forgot your password?{' '}
//             <a href="/forget-password" className="text-blue-600 hover:underline">
//               Reset it here
//             </a>
//           </p>

//           {/* Sign Up Link */}
//           <p className="text-center text-gray-600 mt-2">
//             Don't have an account?{' '}
//             <a href="/signup" className="text-blue-600 hover:underline">
//               Sign up
//             </a>
//           </p>
//           {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignInForm;


// const SignInForm = ({ onSignInSuccess }) => {

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const navigate = useNavigate();

//   const [errorMessage, setErrorMessage] = useState(null);
//   const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

//   const { setUser } = useUser();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
  
//     const raw = JSON.stringify(formData);
  
//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };
  
//     fetch(`${baseUrl}/users/login`, requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Login failed");
//         }
//         return response.json();
//       })
//       .then((result) => {
//         console.log("User Data:", result);
  
//         // Save user and token to localStorage
//         localStorage.setItem('user', JSON.stringify(result.user));
//         localStorage.setItem('token', result.token);
  
//         // Update the context with user data
//         setUser(result.user); 
  
//         // Redirect to the dashboard
//         navigate("/dashboard");
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setErrorMessage("Login failed. Please try again.");
//       });
//   };
  

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl">
//         {/* Left Side: Image */}
//         <div className="hidden md:block md:w-1/2">
//           <img
//             src="https://via.placeholder.com/400x500" // Replace with your image URL
//             alt="SignIn"
//             className="h-full w-full object-cover"
//           />
//         </div>

//         {/* Right Side: Form */}
//         <div className="w-full md:w-1/2 p-8">
//           <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
//             Welcome Back!
//           </h2>
//           <form onSubmit={handleSubmit}>
//             {/* Email Field */}
//             <div className="mb-4">
//               <label
//                 htmlFor="email"
//                 className="block text-gray-700 font-semibold mb-2"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               />
//             </div>

//             {/* Password Field */}
//             <div className="mb-4 relative">
//               <label
//                 htmlFor="password"
//                 className="block text-gray-700 font-semibold mb-2"
//               >
//                 Password
//               </label>
//               <input
//                 type={showPassword ? "text" : "password"} // Toggle input type
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               />
//               {/* Eye Icon */}
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute right-4 top-10 text-gray-600 focus:outline-none"
//               >
//                 {showPassword ? (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="1.5"
//                     stroke="currentColor"
//                     className="w-6 h-6"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M3.98 8.942c1.815-3.632 5.353-6.142 8.02-6.142s6.206 2.51 8.02 6.142a11.948 11.948 0 01-8.02 6.14 11.948 11.948 0 01-8.02-6.14zm6.02-.942a3 3 0 100 6 3 3 0 000-6z"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="1.5"
//                     stroke="currentColor"
//                     className="w-6 h-6"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M3.98 8.942c1.815-3.632 5.353-6.142 8.02-6.142s6.206 2.51 8.02 6.142a11.948 11.948 0 01-8.02 6.14 11.948 11.948 0 01-8.02-6.14zm8.02-3.142a3 3 0 100 6 3 3 0 000-6z"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
//             >
//               Sign In
//             </button>
//           </form>

//           {/* Forgot Password? */}
//           <p className="text-center text-gray-600 mt-4">
//             Forgot your password?{' '}
//             <a href="/forget-password" className="text-blue-600 hover:underline">
//               Reset it here
//             </a>
//           </p>

//           {/* Sign Up Link */}
//           <p className="text-center text-gray-600 mt-2">
//             Don't have an account?{' '}
//             <a href="/signup" className="text-blue-600 hover:underline">
//               Sign up
//             </a>
//           </p>
//           {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}

//         </div>
//       </div>
//     </div>
//   );
// };

//export default SignInForm;
