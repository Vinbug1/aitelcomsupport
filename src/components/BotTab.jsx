import React, { useState, useEffect } from 'react';
import baseUrl from '../utils/BaseUrl';

const BotTab = () => {
    const [unknownMessages, setUnknownMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [response, setResponse] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch unknown messages on component mount
    useEffect(() => {
        const fetchUnknownMessages = async () => {
            const requestOptions = {
                method: 'GET',
                redirect: 'follow',
              };
              let url = `${baseUrl}/bot/unknown`;

            try {
                const response = await fetch(url, requestOptions); // Use fetch API here
                if (!response.ok) {
                    throw new Error('Failed to fetch unknown messages');
                }
                const data = await response.json();
                console.log(data);
                setUnknownMessages(data.unknownMessages);
            } catch (error) {
                console.error('Error fetching unknown messages:', error);
            }
        };
        fetchUnknownMessages();
    }, []);

    // Handle row click
    const handleRowClick = (message) => {
        setSelectedMessage(message);
        setIsModalOpen(true);
    };

    // Handle save response
const handleSaveResponse = async () => {
    if (!response.trim()) return;
    try {
        const res = await fetch(`${baseUrl}/bot/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: selectedMessage.message,
                response,
            }),
        });

        // Check if the response is successful
        if (res.ok) {
            const data = await res.json(); // Parse the JSON response from the server
            console.log('Response from server:', data); // Log the response from the server
            setIsModalOpen(false);
            setResponse('');
        } else {
            // Log any error status
            const errorData = await res.json();
            console.error('Failed to save response:', errorData); // Log the error data from the server
            throw new Error('Failed to save response');
        }
    } catch (error) {
        console.error('Error saving response:', error);
    }
};


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Bot Unknown Messages</h1>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Message</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unknownMessages.map((message, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleRowClick(message)}
                            >
                                <td className="border border-gray-300 px-4 py-2 truncate">{message.message}</td>
                                <td className="border border-gray-300 px-4 py-2">{new Date(message.response).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Message Details</h2>
                        <p><strong>User ID:</strong> {selectedMessage.userId}</p>
                        <p className="mt-2"><strong>Message:</strong> {selectedMessage.message}</p>
                        <p className="mt-2"><strong>Timestamp:</strong> {new Date(selectedMessage.response).toLocaleString()}</p>

                        <textarea
                            className="mt-4 w-full p-2 border border-gray-300 rounded"
                            placeholder="Enter your response"
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                        />

                        <div className="mt-4 flex justify-end">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded mr-2"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleSaveResponse}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BotTab;
