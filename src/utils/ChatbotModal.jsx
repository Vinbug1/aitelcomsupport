import React, { useState } from 'react';
import baseUrl from './BaseUrl';
import { useUser } from '../utils/UserContext'; // Use the custom hook
import ElizaBot from 'elizabot'; // Import ElizaBot

const ChatbotModal = ({ isOpen, onClose }) => {
    const { user } = useUser(); // Get user from context using the custom hook
    const userId = user?._id; // Ensure userId is extracted safely
    const userName = user?.username || 'there'; // Fallback if username is undefined

    const [messages, setMessages] = useState([
        { sender: 'bot', text: `Hi ${userName}` },
        { sender: 'bot', text: `I am Eliza. How can I help you today?` }
    ]);
    const [input, setInput] = useState('');

    // Initialize ElizaBot
    const eliza = new ElizaBot();

    const sendMessage = async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        const newMessages = [...messages, { sender: 'user', text: trimmedInput }];
        setMessages(newMessages);

        try {
            const response = await fetch(`${baseUrl}/bot/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: trimmedInput,
                    userId: userId, // Include the userId in the request body
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setMessages([...newMessages, { sender: 'bot', text: data.response }]);
        } catch (error) {
            console.error("Error sending message to backend:", error);

            // Use existing fallback or ElizaBot as an alternative
            const fallbackResponse = eliza.transform(trimmedInput) || "An error occurred. Please try again.";
            setMessages([
                ...newMessages,
                { sender: 'bot', text: fallbackResponse },
            ]);
        } finally {
            setInput('');
        }
    };

    return isOpen ? (
        <div className="fixed bottom-16 right-6 bg-white shadow-lg rounded-lg p-4 w-96">
            <h3 className="text-lg font-bold mb-2">Chatbot</h3>
            <div className="h-64 overflow-y-auto border p-2 rounded">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`mb-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}>
                        <p className={`inline-block p-2 rounded ${msg.sender === 'bot' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                            {msg.text}
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex mt-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border p-2 rounded"
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded ml-2">Send</button>
            </div>
            <button onClick={onClose} className="mt-2 text-sm text-gray-500">Close</button>
        </div>
    ) : null;
};

export default ChatbotModal;






// import React, { useState } from 'react';
// import baseUrl from './BaseUrl';
// import { useUser } from '../utils/UserContext'; // Use the custom hook
// import ElizaBot from 'elizabot'; // Import ElizaBot

// const ChatbotModal = ({ isOpen, onClose }) => {
//     const [messages, setMessages] = useState([
//         { sender: 'bot', text: "Hi! i am elizabot?" }
//     ]);
//     const [input, setInput] = useState('');
//     const { user } = useUser(); // Get user from context using the custom hook
//     const userId = user?._id; // Ensure userId is extracted safely

//     // Initialize ElizaBot
//     const eliza = new ElizaBot();

//     const sendMessage = async () => {
//         const trimmedInput = input.trim();
//         if (!trimmedInput) return;

//         const newMessages = [...messages, { sender: 'user', text: trimmedInput }];
//         setMessages(newMessages);

//         try {
//             const response = await fetch(`${baseUrl}/bot/message`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     message: trimmedInput,
//                     userId: userId, // Include the userId in the request body
//                 }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
//             }

//             const data = await response.json();
//             setMessages([...newMessages, { sender: 'bot', text: data.response }]);
//         } catch (error) {
//             console.error("Error sending message to backend:", error);

//             // Use existing fallback or ElizaBot as an alternative
//             const fallbackResponse = eliza.transform(trimmedInput) || "An error occurred. Please try again.";
//             setMessages([
//                 ...newMessages,
//                 { sender: 'bot', text: fallbackResponse },
//             ]);
//         } finally {
//             setInput('');
//         }
//     };

//     return isOpen ? (
//         <div className="fixed bottom-16 right-6 bg-white shadow-lg rounded-lg p-4 w-96">
//             <h3 className="text-lg font-bold mb-2">Chatbot</h3>
//             <div className="h-64 overflow-y-auto border p-2 rounded">
//                 {messages.map((msg, idx) => (
//                     <div key={idx} className={`mb-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}>
//                         <p className={`inline-block p-2 rounded ${msg.sender === 'bot' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
//                             {msg.text}
//                         </p>
//                     </div>
//                 ))}
//             </div>
//             <div className="flex mt-2">
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Type your message..."
//                     className="flex-1 border p-2 rounded"
//                 />
//                 <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded ml-2">Send</button>
//             </div>
//             <button onClick={onClose} className="mt-2 text-sm text-gray-500">Close</button>
//         </div>
//     ) : null;
// };

// export default ChatbotModal;











// // import React, { useState } from 'react';
// // import baseUrl from './BaseUrl';
// // import { useUser } from '../utils/UserContext';  // Use the custom hook

// // const ChatbotModal = ({ isOpen, onClose }) => {
// //     const [messages, setMessages] = useState([
// //         { sender: 'bot', text: "Hi! How can I assist you today?" }
// //     ]);
// //     const [input, setInput] = useState('');
// //     const { user } = useUser();  // Get user from context using the custom hook
// //     const userId = user?._id;  // Ensure userId is extracted safely

// //     const sendMessage = async () => {
// //         const trimmedInput = input.trim();
// //         if (!trimmedInput) return;

// //         const newMessages = [...messages, { sender: 'user', text: trimmedInput }];
// //         setMessages(newMessages);

// //         try {
// //             const response = await fetch(`${baseUrl}/bot/message`, {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify({
// //                     message: trimmedInput,
// //                     userId: userId,  // Include the userId in the request body
// //                 }),
// //             });

// //             if (!response.ok) {
// //                 const errorData = await response.json();
// //                 throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
// //             }

// //             const data = await response.json();
// //             setMessages([...newMessages, { sender: 'bot', text: data.response }]);
// //         } catch (error) {
// //             setMessages([
// //                 ...newMessages,
// //                 { sender: 'bot', text: error.message || "An error occurred. Please try again." },
// //             ]);
// //             console.error("Error sending message:", error);
// //         } finally {
// //             setInput('');
// //         }
// //     };

// //     return isOpen ? (
// //         <div className="fixed bottom-16 right-6 bg-white shadow-lg rounded-lg p-4 w-96">
// //             <h3 className="text-lg font-bold mb-2">Chatbot</h3>
// //             <div className="h-64 overflow-y-auto border p-2 rounded">
// //                 {messages.map((msg, idx) => (
// //                     <div key={idx} className={`mb-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}>
// //                         <p className={`inline-block p-2 rounded ${msg.sender === 'bot' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
// //                             {msg.text}
// //                         </p>
// //                     </div>
// //                 ))}
// //             </div>
// //             <div className="flex mt-2">
// //                 <input
// //                     type="text"
// //                     value={input}
// //                     onChange={(e) => setInput(e.target.value)}
// //                     placeholder="Type your message..."
// //                     className="flex-1 border p-2 rounded"
// //                 />
// //                 <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded ml-2">Send</button>
// //             </div>
// //             <button onClick={onClose} className="mt-2 text-sm text-gray-500">Close</button>
// //         </div>
// //     ) : null;
// // };

// // export default ChatbotModal;
