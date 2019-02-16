/*
  Settings
*/
const PORT = 3000;

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
