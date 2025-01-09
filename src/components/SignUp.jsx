import React, { useState } from 'react';
import baseUrl from '../utils/BaseUrl';
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client', // Added role to the state
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify(formData);
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    fetch(`${baseUrl}/users/register`, requestOptions)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          console.error("Server error:", result); // Log the error response
          throw new Error(result.error || "Registration failed");
        }
        return result;
      })
      .then((result) => {
        console.log("Registration Successful:", result);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage(error.message); // Show specific error
      });
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl">
        {/* Left Side: Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://via.placeholder.com/400x500" // Replace with your image URL
            alt="Signup"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Create Your Account
          </h2>
          {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-semibold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-10 text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.942c1.815-3.632 5.353-6.142 8.02-6.142s6.206 2.51 8.02 6.142a11.948 11.948 0 01-8.02 6.14 11.948 11.948 0 01-8.02-6.14zm6.02-.942a3 3 0 100 6 3 3 0 000-6z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.942c1.815-3.632 5.353-6.142 8.02-6.142s6.206 2.51 8.02 6.142a11.948 11.948 0 01-8.02 6.14 11.948 11.948 0 01-8.02-6.14zm8.02-3.142a3 3 0 100 6 3 3 0 000-6z"
                    />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Role Field */}
            <div className="mb-6">
              <label
                htmlFor="role"
                className="block text-gray-700 font-semibold mb-2"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="client">Client</option>
                {/* <option value="admin">Admin</option> */}
              </select>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Sign Up
            </button>
          </form>

          {/* Already have an account? */}
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
