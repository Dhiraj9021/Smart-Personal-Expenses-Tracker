const Visit = require("../models/Visit");

module.exports = async (req, res, next) => {
  try {
    // Only track GET requests to the home page
    if (req.method === "GET" && req.path === "/") {

      // Track unique visits per session
      if (!req.session.hasVisited) {
        await Visit.create({
          ip: req.ip,
          userId: req.session.userId || null // store userId if logged in
        });

        // Mark this session as visited
        req.session.hasVisited = true;
      }
    }
  } catch (err) {
    console.error("Failed to log visit:", err.message);
  }

  next();
};
