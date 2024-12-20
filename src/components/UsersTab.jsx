import React, { useState, useEffect } from 'react';
import baseUrl from '../utils/BaseUrl'; // Adjust the path as necessary
import Pagination from '../utils/Pagination'; // Import the Pagination component

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '',password:'' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    // Fetch users data when this tab is selected
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`${baseUrl}/users`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((result) => {
        console.log('Response from server:', result);
        setUsers(result);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Submit new user to the backend
    fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser), // Convert newUser object to JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((result) => {
        console.log('User created:', result);
        setUsers((prevUsers) => [...prevUsers, result]); // Add new user to the state
        setNewUser({ username: '', email: '',password:'' }); // Reset form fields
        setIsModalOpen(false); // Close modal after submission
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    // Calculate the index of the first and last items for the current page
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Users</h3>
        <button 
          className="bg-blue-500 text-white p-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add User
        </button>
      </div>
      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2 text-left">Name</th>
            <th className="border-b p-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id} onClick={() => handleRowClick(user)} className="cursor-pointer">

              <td className="border-b p-2 text-left">{user.username}</td>
              <td className="border-b p-2 text-left">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for creating a new user */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create User</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-1">Username</label>
                <input 
                  id="username"
                  type="text" 
                  name="username" 
                  value={newUser.username} 
                  onChange={handleInputChange} 
                  className="border p-2 w-full" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">Email</label>
                <input 
                  id="email"
                  type="email" 
                  name="email" 
                  value={newUser.email} 
                  onChange={handleInputChange} 
                  className="border p-2 w-full" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-1">Password</label>
                <input 
                  id="password"
                  type="password" 
                  name="password" 
                  value={newUser.password} 
                  onChange={handleInputChange} 
                  className="border p-2 w-full" 
                  required 
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="mr-2 bg-gray-300 p-2 rounded" 
                  onClick={() => setIsModalOpen(false)} // Close modal
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Bill Details Modal */}
      {isDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">User Details</h2>
            <p><strong>Address:</strong> {selectedUser.username}</p>
            <p><strong>Description:</strong> {selectedUser.email}</p>
            <p><strong>Ticket:</strong> {selectedUser.role}</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 p-2 rounded"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Pagination Component */}
            <Pagination
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UsersTab;
