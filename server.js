const express = require('express');
const envVar = require('dotenv').config() //dotenv npm package to load environment variables from .env file
const port = envVar.parsed.Server_Port || 6000; //port nb from env var or 3000 if not exist
const app = express();
const path = require('path');
const apiResponse = require("./helpers/apiResponse");
const portfolio = require("./API/portfolio")
const nfts = require("./API/nfts")
// const transactions = require("./API/transactions")

// routing APIs
app.use('/api', portfolio);
app.use('/api', nfts);
// app.use('/api', transactions);
app.use(express.json());
app.use(express.static("pages"));

// serving webpage files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/pages/index.html'));
});

// throw 404 if URL not found
app.all("*", function (req, res) {
  return apiResponse.notFoundResponse(res, "404 Page not found");
});

// start server listen and port number
app.listen(port, () => {
  console.log('Server started! At http://localhost:' + port);
});
