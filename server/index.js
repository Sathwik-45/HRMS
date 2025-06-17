const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config({ path: __dirname + "/.env" });

// Import database connection
const connectDB = require("./config/database");

// Import routes
const eventRoutes = require("./routes/events");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // React dev servers
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/events", eventRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HRMS Backend Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to HRMS Backend API",
    version: "1.0.0",
    endpoints: {
      events: "/api/events",
      health: "/api/health",
    },
  });
});

// Error handler middleware (should be last)
app.use(errorHandler);

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 HRMS Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
