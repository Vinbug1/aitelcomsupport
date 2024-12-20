import React, { useState, useEffect } from 'react';
import baseUrl from '../utils/BaseUrl'; // Adjust the path as necessary
import { useUser } from '../utils/UserContext';  // Use the custom hook
import Pagination from '../utils/Pagination'; // Import the Pagination component

const TicketTab = () => {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ user: '', description: '', status:'' });
  const { user } = useUser();  // Get user from context using the custom hook
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set the number of items per page

  useEffect(() => {
    if (user && user._id) {
      console.log('Ticket User ID:', user._id);

      const fetchTickets = async () => {
        const requestOptions = {
          method: 'GET',
          redirect: 'follow',
        };

        let url = `${baseUrl}/tickets`;
        if (user.role === 'user') {
          url = `${baseUrl}/tickets/${user._id}`;
        }

        try {
          const response = await fetch(url, requestOptions);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const result = await response.json();
          console.log('Response from server:', result);

          // Check if result.tickets is an array before using .map
          if (Array.isArray(result.tickets) && result.tickets.length > 0) {
            setTickets(result.tickets); // Set tickets as an array of ticket details
          } else {
            console.error('No ticket data found or invalid format');
            setTickets([]); // Set empty array if no data
          }
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      };

      fetchTickets();
    } else {
      console.log('No user found or user._id is missing');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticketWithUserId = { ...newTicket, user: user._id };

    // Submit new ticket to the backend
    fetch(`${baseUrl}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketWithUserId), // Convert newTicket object to JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((result) => {
        console.log('Ticket created:', result);
        setTickets((prevTickets) => [...prevTickets, result]); // Add new ticket to the state
        setNewTicket({ user: '', description: '', status:'' }); // Reset form fields
        setIsModalOpen(false); // Close modal after submission
      })
      .catch((error) => {
        console.error('Error creating ticket:', error);
      });
  };

  const handleRowClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsModalOpen(true);
  }; 


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the index of the first and last items for the current page
  const indexOfLastTicket = currentPage * itemsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - itemsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Tickets</h3>
        <button 
          className="bg-blue-500 text-white p-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add Ticket
        </button>
      </div>

      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2 text-left">User</th>
            <th className="border-b p-2 text-left">Description</th>
            <th className="border-b p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTickets.map((ticket) => (
          <tr key={ticket._id} onClick={() => handleRowClick(ticket)} className="cursor-pointer">
              <td className="border-b p-2 text-left">
              {ticket.user && ticket.user.username ? ticket.user.username : 'Unknown'}
              </td> {/* Adjust if ticket.user is an object */}
              <td className="border-b p-2 text-left">{ticket.description}</td>
              <td className="border-b p-2 text-left">{ticket.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for creating a new ticket */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create Ticket</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="description" className="block mb-1">Description</label>
                <input 
                  id="description"
                  type="text" 
                  name="description" 
                  value={newTicket.description} 
                  onChange={handleInputChange} 
                  className="border p-2 w-full" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block mb-1">Status</label>
                <input 
                  id="status"
                  type="text" 
                  name="status" 
                  value={newTicket.status} 
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
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill Details Modal */}
      {isDetailsModalOpen && selectedTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Ticket Details</h2>
            <p><strong>User:</strong> {selectedTicket.user?.username || 'No username available'}</p>
            <p><strong>Address:</strong> {selectedTicket.description}</p>
            <p><strong>Status:</strong> {selectedTicket.status}</p>
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
        totalItems={tickets.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

    </div>
  );
};

export default TicketTab;
