## Telecom Frontend
# Overview
This project is the frontend application for a telecom startup that uses ReactJS, TailwindCSS, and a manually implemented chatbot to interact with the ElizaBotController in the backend. The goal of this application is to automate customer support, monitor network performance, and engage customers through various channels. The frontend communicates with the backend via network calls, allowing the chatbot to provide assistance to customers in real-time.
The application features a customer support AI chatbot, a dashboard to monitor network performance, and Discord integration to offer customers seamless interactions directly from their preferred communication platform.

## Features
# AI-Powered Chatbot:
 * Built manually and integrated into the frontend.
 * Communicates with the backend's ElizaBotController to provide automated responses to common customer queries.
 * Handles customer issues, FAQs, and escalation to human agents when needed.
  
# Network Performance Monitoring Dashboard:
 * Real-time tracking of network performance and issues.
 * Visual representations of network status, health, and resolutions.
  
# Discord Integration:
 * Provides a bridge between the chatbot and Discord.
 * Customers can interact with the AI bot in Discord for support, check network status, and get advice.
  
# Technologies Used
 * ReactJS: For building the user interface and handling frontend logic.
 * TailwindCSS: For styling the UI with a utility-first approach.
 * Axios: For making network calls to interact with the backend.
 * ElizaBotController: Backend controller that interacts with the AI chatbot system.
 * Node.js/Express: The backend that powers the ElizaBotController (though not part of this repository, the frontend interacts with it via API calls).

## Installation
Clone the repository: git clone https://github.com/Vinbug1/aitelcomsupport.git
cd aitelcomsupport

Install dependencies:`npm install`
Start the development server: `npm start`
Visit the app in your browser at http://localhost:3000.

# Hypothetical Use Case
# Automate Customer Support:
The chatbot allows customers to ask frequently asked questions (FAQs) and receive automated responses, such as:
  * Billing inquiries
  * Account status checks
  * Network issues In case of complex queries, the bot escalates the issue to a human agent.
  
## Chatbot Integration

 # Backend Communication
The chatbot frontend communicates with the ElizaBotController in the backend through API calls.
The frontend sends customer messages to the backend for processing, and the backend responds with an appropriate reply.
In case the chatbot cannot resolve a query, it  ave the issue in json file so that when the human comes he can add response to the input or redirects the customer to relevant resources.

## Manual Chatbot Implementation
Due to issues with the Eliza framework, a custom chatbot was implemented in the frontend.
The chatbot listens for user input and sends the query to the backend via network requests to fetch a response from the AI bot.
Endpoints
POST /bot/message: Sends a message to the backend and receives a response from the chatbot and there are keyword  like"bill" to triger a function like create billing record, "network" to check region network.

Configuration
To configure the backend communication, ensure that the following environment variables are set:

REACT_APP_BACKEND_URL: The base URL for the backend API `http://localhost:5000`.

# Contributing
We welcome contributions! If you would like to contribute to the project:

# Fork the repository.
 * Create a new branch (git checkout -b feature-name).
 * Commit your changes (git commit -am 'Add new feature').
 * Push to the branch (git push origin feature-name).
 * Open a pull request.

#Contact
For any inquiries, please reach out to `vincentwilliamsjohn9626@gmail.com`.