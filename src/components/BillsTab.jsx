import React, { useState, useEffect } from "react";
import { useUser } from "../utils/UserContext";
import baseUrl from "../utils/BaseUrl";
import Pagination from "../utils/Pagination"; // Import the Pagination component

const BillsTab = () => {
  const { user } = useUser();
  const [bills, setBills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [newBill, setNewBill] = useState({
    userId: "",
    billingAddress: "",
    description: "",
    amount: "",
    status: "",
  });
  const [selectedBill, setSelectedBill] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user && user._id) {
      console.log("User ID:", user._id);

      const fetchBills = async () => {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        let url = `${baseUrl}/bills`;
        if (user.role === "user" || user.role === "client") {
          url = `${baseUrl}/bills/${user._id}`;
        }

        try {
          const response = await fetch(url, requestOptions);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const result = await response.json();
          console.log("Response from server:", result);

          // Check if result.data is an array before using .map
          if (Array.isArray(result.data) && result.data.length > 0) {
            setBills(result.data); // Set bills as an array of billing details
          } else {
            console.error("No billing data found or invalid format");
            setBills([]); // Set empty array if no data
          }
        } catch (error) {
          console.error("Error fetching bills:", error);
        }
      };

      fetchBills();
    } else {
      console.log("No user found or user._id is missing");
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditModalOpen && selectedBill) {
      setSelectedBill({ ...selectedBill, [name]: value });
    } else {
      setNewBill({ ...newBill, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Attach userId to the new bill when creating
    const billWithUserId = { ...newBill, userId: user._id };

    // Define headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Define request options
    const raw = JSON.stringify(billWithUserId); // Correct payload
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    };

    fetch(`${baseUrl}/bills`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            console.error("Error details:", err);
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            );
          });
        }
        return response.json();
      })
      .then((result) => {
        console.log("Bill created:", result);
        setBills((prevBills) => [...prevBills, result]); // Optionally update the list of bills
        setIsModalOpen(false); // Always close the modal upon success
        setNewBill({
          userId: "",
          billingAddress: "",
          description: "",
          amount: "",
          status: "",
        }); // Reset the form
      })
      .catch((error) => {
        console.error("Error creating bill:", error);
        setIsModalOpen(false); // Always close the modal even if there is an error
      });
  };

  const handleRowClick = (bill) => {
    setSelectedBill(bill);
    //setIsDetailsModalOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditBill = async (e) => {
    e.preventDefault();
    if (!selectedBill || !selectedBill._id) return;

    try {
      const response = await fetch(`${baseUrl}/bills/${selectedBill._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedBill),
      });
      if (!response.ok) throw new Error("Failed to update bill");
      const result = await response.json();
      setBills((prev) =>
        prev.map((bill) => (bill._id === result._id ? result : bill))
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error editing bill:", error);
    }
  };

  const handleDeleteBill = async () => {
    if (!selectedBill || !selectedBill._id) {
      console.log("Deleting bill:", selectedBill._id);
      console.error("No bill selected or bill id is missing");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/bills/${selectedBill._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete bill");
      setBills((prev) => prev.filter((bill) => bill._id !== selectedBill._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };
  


  // Calculate the index of the first and last items for the current page
  const indexOfLastBill = currentPage * itemsPerPage;
  const indexOfFirstBill = indexOfLastBill - itemsPerPage;
  const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);


  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Bills</h3>
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add Bill
        </button>
      </div>
      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2 text-left">User</th>
            <th className="border-b p-2 text-left">Address</th>
            <th className="border-b p-2 text-left">Description</th>
            <th className="border-b p-2 text-left">Amount</th>
            <th className="border-b p-2 text-left">Status</th>
            <th className="border-b p-2 text-left">Actions</th> {/* Add Actions Column */}
          </tr>
        </thead>
        <tbody>
          {currentBills.map((bill, index) => (
            <tr
              key={bill._id || index}
              onClick={() => handleRowClick(bill)}
              className="cursor-pointer"
            >
              <td className="border-b p-2 text-left">
                {bill.user?.username || "No username available"}
              </td>
              <td className="border-b p-2 text-left">
                {bill.billing?.billingAddress}
              </td>
              <td className="border-b p-2 text-left">
                {bill.billing?.description}
              </td>

              <td className="border-b p-2 text-left">{bill.billing.amount}</td>
              <td className="border-b p-2 text-left">{bill.billing.status}</td>
              <td className="border-b p-2 text-left">
                <button
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                  onClick={() => { setSelectedBill(bill); setIsEditModalOpen(true); }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => { setSelectedBill(bill); setIsDeleteModalOpen(true); }}
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
            <h2 className="text-lg font-semibold mb-4">Create Bill</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="billingAddress" className="block mb-1">
                  Address
                </label>
                <input
                  id="billingAddress"
                  type="text"
                  name="billingAddress"
                  value={newBill.billingAddress}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block mb-1">
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  value={newBill.description}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block mb-1">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={newBill.amount}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block mb-1">
                  Status
                </label>
                <input
                  id="status"
                  type="text"
                  name="status"
                  value={newBill.status}
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
                  Create Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


        {/* Modal for Editing Bill */}
        {isEditModalOpen && selectedBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Bill</h2>
            <form onSubmit={handleEditBill}>
              <div className="mb-4">
                <label htmlFor="billingAddress" className="block mb-1">
                  Address
                </label>
                <input
                  id="billingAddress"
                  type="text"
                  name="billingAddress"
                  value={selectedBill.billingAddress || ""}
                  onChange={(e) => setSelectedBill({ ...selectedBill, billingAddress: e.target.value })}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block mb-1">
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  name="description"
                  value={selectedBill.description || ""}
                  onChange={(e) => setSelectedBill({ ...selectedBill, description: e.target.value })}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 bg-gray-300 p-2 rounded"
                  onClick={() => setIsEditModalOpen(false)} // Close modal
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Update Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Bill Details Modal */}
      {/* {isDetailsModalOpen && selectedBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Bill Details</h2>
            <p>
              <strong>User:</strong> {selectedBill.user?.username}
            </p>
            <p>
              <strong>Address:</strong> {selectedBill.billing?.billingAddress}
            </p>
            <p>
              <strong>Description:</strong> {selectedBill.billing?.description}
            </p>
            <p>
              <strong>Amount:</strong> {selectedBill.billing?.amount}
            </p>
            <p>
              <strong>Status:</strong> {selectedBill.billing?.status}
            </p>
            <p>
              <strong>Status:</strong> {selectedBill.billing.ticketId}
            </p>
            <button
              className="bg-gray-300 p-2 rounded mt-4"
              onClick={() => setIsDetailsModalOpen(false)} // Close details modal
            >
              Close
            </button>
          </div>
        </div>
      )} */}
            {isDeleteModalOpen && selectedBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Delete Bill</h2>
            <p>Are you sure you want to delete this bill?</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 bg-gray-300 p-2 rounded"
                onClick={() => setIsDeleteModalOpen(false)} // Close modal
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-red-500 text-white p-2 rounded"
                onClick={handleDeleteBill} // Delete the bill
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={bills.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BillsTab;
