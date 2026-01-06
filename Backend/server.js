const express = require("express");
const connectDB = require("./config/db"); // ⭐ THIS LINE WAS MISSING
require("dotenv").config();

const app = express();

app.use(express.json());

// connect database
connectDB();

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
