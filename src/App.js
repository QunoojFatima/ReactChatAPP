import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [currentUser] = useState(`user${Math.round(Math.random() * 100)}`);

  useEffect(() => {
    const newSocket = io('http://192.168.0.105:3030');
    setSocket(newSocket);

    newSocket.on('connect', () => console.log('Socket connected!'));
    newSocket.on('message', (message) => setMessages((prevMessages) => [...prevMessages, message]));
    newSocket.on('disconnect', () => console.log('Socket disconnected!'));

    return () => {
      newSocket.disconnect();
      console.log('Socket disconnected and cleanup.');
    };
  }, []);

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && socket) {
      const message = { text: newMessage, sender: currentUser };
      socket.emit('message', message);
      setNewMessage('');
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        <h1 className="chat-heading">React Chat - {currentUser}</h1>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={handleInputChange}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;