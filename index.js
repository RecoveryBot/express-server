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

const latestRates = {};
let log = '';

app.get('/', (req, res) => {
  res.send(log);
});

app.post('/bpm', (req, res) => {
  const { heartRate, userId } = req.query;
  latestRates[userId] = heartRate;
  log += `Heart rate: ${heartRate}\n`;
  res.sendStatus(200);
});
