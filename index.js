const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("Receptionist running");
});

app.get("/voice", (req, res) => {
  res.status(200).send("Voice route is live");
});

app.post("/voice", (req, res) => {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Hello, thanks for calling Gold Coast Blinds and Shutters. How can I help you today?</Say>
</Response>`;

  res.type("text/xml");
  res.send(twiml);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
