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
const fetch = require('node-fetch');

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
const userNames = {};

app.get('/', (req, res) => {
  res.send(latestRates);
});

app.post('/register', (req, res) => {
  const { userId, userName } = req.query;
  userNames[userId] = userName;
  res.sendStatus(200);
});

app.get('/user', (req, res) => {
  const { userId } = req.query;
  res.send(userNames[userId] || userId);
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

  if (!heartRate || !userId) {
    res.sendStatus(400);
  }

  // Store heart rate.
  latestRates[userId] = heartRate;

  // Emit rate.
  const socket = io.sockets.connected[connections[userId]];
  if (socket) {
    socket.emit('heartRate', heartRate);
  }

  res.sendStatus(200);
});

app.post('/alert', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    res.sendStatus(400);
  }

  const name = userNames[userId] || userId;
  const number = '6502195319';
  const msg = `Hey! ${name} is experiencing withdrawal symptoms and could really use your support! Please call ${name} ASAP!`

  fetch(`https://unitingdust.api.stdlib.com/examples-twilio@dev/?tel=${number}&body=${encodeURIComponent(msg)}`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit'
  })
  .then(() => {
    console.log('Sent to Twilio.');
    res.sendStatus(200);
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(400);
  });
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

    // Emit last heart rate immediately.
    socket.emit('heartRate', latestRates[email] || 0);
  });
});

socketLogger = (socket, message) => {
  console.log(`[${socket.id}] ${message}`);
};
