import React, { useState } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/outline';
import TicketTab from './TicketTab';
import UsersTab from './UsersTab';
import BillsTab from './BillsTab';
import DiscordTab from './DiscordTab';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
//import { useUser } from '../utils/UserContext'; // Correct import for user context
import BotTab from './BotTab';
import ChatbotModal from '../utils/ChatbotModal';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router-dom for navigation

const Dashboard = () => {
 // const { user } = useUser(); // Get both user and setUser from context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('ticket');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate(); // For navigation

  //const [role, setRole] = useState('user');

  //useEffect(() => {
   // if (user) {
    //  setRole(user.role); // Set the role based on user data
   // }
  //}, [user]);

  const handleModalClose = () => setIsModalOpen(false);
  ///const handleChatbotToggle = () => setIsChatbotOpen(!isChatbotOpen);
  const handleTabClick = (tab) => setCurrentTab(tab);

  const handleLogout = () => {
    // Add your logout logic here, e.g., clearing user data
    navigate('/'); // Redirect to the SignIn screen
  };

  
 
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white h-full flex flex-col p-4 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-30' : 'w-60'} fixed left-0 top-0 bottom-0`}>
        <button className="mb-4 text-white" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
          {isSidebarCollapsed ? (
            <ChevronRightIcon className="h-6 w-6 text-white" />
          ) : (
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Tabs */}
        <div className="space-y-6 mt-4">
          <Tab icon="📑" label="Ticket" onClick={() => handleTabClick('ticket')} isCollapsed={isSidebarCollapsed} />
        {/*  {role === 'admin' && <Tab icon="👥" label="Users" onClick={() => handleTabClick('users')} isCollapsed={isSidebarCollapsed} />}*/}
          <Tab icon="👥" label="Users" onClick={() => handleTabClick('users')} isCollapsed={isSidebarCollapsed} />

          <Tab icon="💰" label="Bills" onClick={() => handleTabClick('bills')} isCollapsed={isSidebarCollapsed} />
          <Tab icon="💬" label="Discord" onClick={() => handleTabClick('discord')} isCollapsed={isSidebarCollapsed} />
         {/* {role === 'admin' && <Tab icon="👥" label="Eliza" onClick={() => handleTabClick('eliza')} isCollapsed={isSidebarCollapsed} />}*/}
          <Tab icon="💬" label="Eliza" onClick={() => handleTabClick('eliza')} isCollapsed={isSidebarCollapsed} />
        </div>

        <button
          className="mt-auto flex items-center space-x-2 text-red-500 cursor-pointer"
          onClick={handleLogout}
        >
          <span>🚪</span>
          <span className={`transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Logout</span>
        </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="mt-6">
          {currentTab === 'users' && <UsersTab />}
          {currentTab === 'ticket' && <TicketTab />}
          {currentTab === 'bills' && <BillsTab />}
          {currentTab === 'discord' && <DiscordTab />}
          {currentTab === 'eliza' && <BotTab />}
        </div>
      </div>

      {/* Modal for creating item */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Create Item Modal"
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h3 className="text-xl font-semibold mb-4">Create {currentTab.slice(0, -1)}</h3>
        <div className="space-y-4">
          <div className="flex justify-end space-x-4">
            <button onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button onClick={handleModalClose} className="px-4 py-2 bg-blue-500 text-white rounded-md">Create</button>
          </div>
        </div>
      </Modal>

      {/* Conditionally render the Chatbot Button */}
      {/*{role !== 'user' && (*/}
      {/* onClick={handleChatbotToggle */}
        <button
                        onClick={() => setIsChatbotOpen(true)}

          className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg"
        >
          💬
        </button>
      {/*//)}*/}
      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

      {/* Chatbot Modal */}
     
     {/* )}*/}
    </div>
  );
};

const Tab = ({ icon, label, onClick, isCollapsed }) => (
  <button className="flex items-center space-x-2 cursor-pointer" onClick={onClick}>
    <span>{icon}</span>
    <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>{label}</span>
  </button>
);

Tab.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
};

export default Dashboard;
