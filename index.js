/*
  Settings
*/
const PORT = process.env.port || 3000;

/*
  Modules
*/
const express = require('express');

/*
  Express Setup
*/
const app = express();
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

/*
  Methods
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
