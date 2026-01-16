
const Visit = require("../models/Visit");

const visitLogger = async (req, res, next) => {
  try {
    // Log only GET requests to "/"
    if (req.method === "GET" && req.path === "/") {
      await Visit.create({ ip: req.ip });
    }
  } catch (err) {
    console.error("Failed to log visit:", err.message);
  }
  next();
};

module.exports = visitLogger;
