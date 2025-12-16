// Import Express.js
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config;

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use body-parser to parse JSON payloads from Meta
app.use(bodyParser.json());

app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  }); //new Date().toISOString();

  console.log(`\n[${timestamp}] ${req.method} ${req.originalUrl}`);
  console.log("IP:", req.ip);
  console.log("Query:", JSON.stringify(req.query, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("----------------------------------------");

  next();
});

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = "f33";
console.log(verifyToken);

app.get("/info", (req, res) => {
  res.status(200).send(":OK");
});

// Route for GET requests
app.get("/webhook", (req, res) => {
  const {
    "hub.mode": mode,
    "hub.challenge": challenge,
    "hub.verify_token": token,
  } = req.query;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Not working");
  }
});

// Route for POST requests
app.post("/webhook", (req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
