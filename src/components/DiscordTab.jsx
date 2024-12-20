import React from 'react';

const DiscordTab = () => {
  return (
    <div>
      <h3 className="font-semibold">Chat with Eliza Chatbot</h3>
      <p className="mt-4">Redirecting to the Discord page...</p>
      {/* Add logic for redirecting to Discord */}
      <a href="https://discord.com" className="text-blue-500 underline">
        Click here to chat with Eliza on Discord.
      </a>
    </div>
  );
};

export default DiscordTab;
