const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Generate a random username and color
function generateUserInfo() {
  const adjectives = ['Happy', 'Sad', 'Funny', 'Smart', 'Clever', 'Brave', 'Shy', 'Caring', 'Lucky'];
  const nouns = ['Cat', 'Dog', 'Fox', 'Bear', 'Lion', 'Tiger', 'Elephant', 'Giraffe', 'Monkey'];
  const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF33A1', '#33A1FF', '#A1FF33', '#FF3333', '#33FFA1', '#A133FF'];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return { username: `${adjective}${noun}`, color };
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Set up a connection event
io.on('connection', (socket) => {
  console.log('a user connected');

  // Assign a random username and color to the user
  const userInfo = generateUserInfo();
  io.emit('chat message', { content: `[${userInfo.username}] has joined the chat`, color: '#0FE2D4' });

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    console.log(`[${userInfo.username}] message: ${msg}`);

    // Broadcast the message with the username and color to all connected clients
    io.emit('chat message', { content: `[${userInfo.username}] ${msg}`, color: userInfo.color });
  });

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log(`[${userInfo.username}] user disconnected`);
    io.emit('chat message', { content: `[${userInfo.username}] has left the chat`, color: '#0FE2D4' });
  });
});

// Serve the HTML file
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
