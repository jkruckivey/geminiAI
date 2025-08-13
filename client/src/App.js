import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    const newMessage = { sender: 'user', text: message };
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage('');

    try {
      const backendUrl = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND_URL
        : 'http://localhost:5000';

      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });
      const data = await response.json();
      setChatHistory((prev) => [...prev, { sender: 'ai', text: data.text }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory((prev) => [...prev, { sender: 'ai', text: 'Error: Could not connect to the server.' }]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Teaching Assistant</h1>
      </header>
      <div className="chat-container">
        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;