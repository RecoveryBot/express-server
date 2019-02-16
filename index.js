/*
  Settings
*/
const PORT = process.env.port || 3000;

/*
  Modules
*/
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

/*
  Server Setup
*/
const app = express();
const server = http.Server(app);
const io = socketio(server);
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

/*
  Express Methods
*/
const latestRates = {};

app.get('/', (req, res) => {
  res.send(latestRates);
});

app.get('/bpm', (req, res) => {
  const { userId } = req.query;
  if (latestRates[userId]) {
    res.send(latestRates[userId]);
  } else {
    res.sendStatus(400);
  }
});

app.post('/bpm', (req, res) => {
  const { heartRate, userId } = req.query;
  latestRates[userId] = heartRate;
  res.sendStatus(200);
});

/*
  Socket.io Methods
*/
const connections = {}; // Key: User email, Value: Socket ID.

io.on('connection', socket => {
  socketLogger(socket, 'Connected.');

  // Login user.
  socket.on('login', email => {
    connections[email] = socket.id;
    socketLogger(socket, `Logged in as ${email}`);
  });
});

socketLogger = (socket, message) => {
  console.log(`[${socket.id}] ${message}`);
};
