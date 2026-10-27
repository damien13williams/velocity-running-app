const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Velocity API is running",
  });
});

// User routes
app.use("/api/users", userRoutes);

// Team routes
app.use("/api/teams", teamRoutes);


module.exports = app;