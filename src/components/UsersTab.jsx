import React, { useState, useEffect } from "react";
import baseUrl from "../utils/BaseUrl"; // Adjust the path as necessary
import Pagination from "../utils/Pagination"; // Import the Pagination component

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [ setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${baseUrl}/users`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        setUsers(result);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validate input fields before sending the request
    if (!newUser.username || !newUser.email || !newUser.password || !newUser.role) {
      console.error("All fields are required.");
      return;
    }
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify(newUser);
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
  
    fetch(`${baseUrl}/users/register`, requestOptions)
      .then(async (response) => {
        if (!response.ok) {
          const errorResponse = await response.json();
          console.error("Error response from server:", errorResponse);
          throw new Error(errorResponse.message || "Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        setUsers((prevUsers) => [...prevUsers, result]);
        setNewUser({ username: "", email: "", password: "", role: "user" });
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  // const handleRowClick = (user) => {
  //   setSelectedUser(user);
  //   setIsDetailsModalOpen(true);
  // };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Handle the edit user API call here
    const updatedUser = { ...selectedUser, ...newUser };
    fetch(`${baseUrl}/users/${selectedUser._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? updatedUser : user
          )
        );
        setIsEditModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  const handleDeleteSubmit = () => {
    fetch(`${baseUrl}/users/${selectedUser._id}`, { method: "DELETE" })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== selectedUser._id)
        );
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

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
            <th className="border-b p-2 text-left">Roles</th>
            <th className="border-b p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id} className="cursor-pointer">
              <td className="border-b p-2 text-left">{user.username}</td>
              <td className="border-b p-2 text-left">{user.email}</td>
              <td className="border-b p-2 text-left">{user.role}</td>
              <td className="border-b p-2 text-left">
                <button
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => handleDeleteClick(user)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create User</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-1">
                  Username
                </label>
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
                <label htmlFor="email" className="block mb-1">
                  Email
                </label>
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
                <label htmlFor="password" className="block mb-1">
                  Password
                </label>
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
                  onClick={() => setIsModalOpen(false)}
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

      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={newUser.username || selectedUser.username}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={newUser.email || selectedUser.email}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={newUser.password || selectedUser.password}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 bg-gray-300 p-2 rounded"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete {selectedUser.username}?
            </h2>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 bg-gray-300 p-2 rounded"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-red-500 text-white p-2 rounded"
                onClick={handleDeleteSubmit}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UsersTab;


// import React, { useState, useEffect } from "react";
// import baseUrl from "../utils/BaseUrl"; // Adjust the path as necessary
// import Pagination from "../utils/Pagination"; // Import the Pagination component

// const UsersTab = () => {
//   const [users, setUsers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [newUser, setNewUser] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "client",
//   });
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch(`${baseUrl}/users`, requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((result) => {
//         setUsers(result);
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//       });
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewUser({ ...newUser, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
  
//     // Validate input fields before sending the request
//     if (!newUser.username || !newUser.email || !newUser.password || !newUser.role) {
//       console.error("All fields are required.");
//       return;
//     }
  
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
  
//     const raw = JSON.stringify(newUser);
  
//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       //redirect: "follow",
//     };
  
//     fetch(`${baseUrl}/users/register`, requestOptions)
//       .then(async (response) => {
//         if (!response.ok) {
//           // Try to parse and log the error response body
//           const errorResponse = await response.json();
//           console.error("Error response from server:", errorResponse);
//           throw new Error(errorResponse.message || "Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((result) => {
//         console.log("User created successfully:", result);
//         // Update the users list
//         setUsers((prevUsers) => [...prevUsers, result]);
//         // Reset the form
//         setNewUser({ username: "", email: "", password: "", role: "user" }); // Set default role if required
//         // Close the modal
//         setIsModalOpen(false);
//       })
//       .catch((error) => {
//         console.error("Error creating user:", error);
//       });
//   };
  

//   const handleRowClick = (user) => {
//     setSelectedUser(user);
//     setIsDetailsModalOpen(true);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const indexOfLastUser = currentPage * itemsPerPage;
//   const indexOfFirstUser = indexOfLastUser - itemsPerPage;
//   const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <h3 className="font-semibold">Users</h3>
//         <button
//           className="bg-blue-500 text-white p-2 rounded"
//           onClick={() => setIsModalOpen(true)}
//         >
//           Add User
//         </button>
//       </div>
//       <table className="mt-6 w-full border-collapse">
//         <thead>
//           <tr>
//             <th className="border-b p-2 text-left">Name</th>
//             <th className="border-b p-2 text-left">Email</th>
//             <th className="border-b p-2 text-left">Roles</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentUsers.map((user) => (
//             <tr
//               key={user._id}
//               onClick={() => handleRowClick(user)}
//               className="cursor-pointer"
//             >
//               <td className="border-b p-2 text-left">{user.username}</td>
//               <td className="border-b p-2 text-left">{user.email}</td>
//               <td className="border-b p-2 text-left">{user.role}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">Create User</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label htmlFor="username" className="block mb-1">
//                   Username
//                 </label>
//                 <input
//                   id="username"
//                   type="text"
//                   name="username"
//                   value={newUser.username}
//                   onChange={handleInputChange}
//                   className="border p-2 w-full"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="email" className="block mb-1">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   name="email"
//                   value={newUser.email}
//                   onChange={handleInputChange}
//                   className="border p-2 w-full"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="password" className="block mb-1">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   name="password"
//                   value={newUser.password}
//                   onChange={handleInputChange}
//                   className="border p-2 w-full"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   className="mr-2 bg-gray-300 p-2 rounded"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white p-2 rounded"
//                 >
//                   Create User
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {isDetailsModalOpen && selectedUser && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">User Details</h2>
//             <p>
//               <strong>Username:</strong> {selectedUser.username}
//             </p>
//             <p>
//               <strong>Email:</strong> {selectedUser.email}
//             </p>
//             <p>
//               <strong>Role:</strong> {selectedUser.role}
//             </p>
//             <div className="flex justify-end mt-4">
//               <button
//                 className="bg-gray-300 p-2 rounded"
//                 onClick={() => setIsDetailsModalOpen(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Pagination
//         totalItems={users.length}
//         itemsPerPage={itemsPerPage}
//         currentPage={currentPage}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// };

// export default UsersTab;
