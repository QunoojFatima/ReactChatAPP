const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Use Server from socket.io
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors());

const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://192.168.0.105:3000"], // Add the IP address of your phone
      methods: ["GET", "POST"],
    },
  });  

const PORT = 3030;

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    console.log('Message received:', message);
    io.emit('message', message); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server is listening on port ${PORT}`);
});
