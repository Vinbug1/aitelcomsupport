import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// UserProvider to manage the user state and provide it to the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data and token from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    console.log('Stored user from localStorage:', storedUser);  // Debugging log
    console.log('Stored token from localStorage:', storedToken);  // Debugging log

    // Check if both user and token exist
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser)); // Set user from localStorage
    } else {
      console.log("No user or token found in localStorage.");  // Debugging log
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
