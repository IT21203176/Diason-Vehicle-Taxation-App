const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

console.log("Starting server initialization...");

// Load env variables
dotenv.config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

console.log("Basic middleware loaded");

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Vehicle Tax Calculator API is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

console.log("Health endpoint created");

// Connect to database
try {
  const connectDB = require("./config/db");
  connectDB();
  console.log("Database connection initiated");
} catch (err) {
  console.error("Database connection error:", err.message);
}

// Load routes one by one with error handling
console.log("Loading routes...");

// Auth routes
try {
  const authRoutes = require("./routes/authRoutes");
  app.use("/api/auth", authRoutes);
  console.log("✓ Auth routes loaded");
} catch (err) {
  console.error("✗ Error loading auth routes:", err.message);
}

// Vehicle routes
try {
  const vehicleRoutes = require("./routes/vehicleRoutes");
  app.use("/api/vehicles", vehicleRoutes);
  console.log("✓ Vehicle routes loaded");
} catch (err) {
  console.error("✗ Error loading vehicle routes:", err.message);
}

// Exchange routes
try {
  const exchangeRoutes = require("./routes/exchange.routes");
  app.use("/api/exchange", exchangeRoutes);
  console.log("✓ Exchange routes loaded");
} catch (err) {
  console.error("✗ Error loading exchange routes:", err.message);
}

console.log("All routes processed");

// Error handlers
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

console.log(`Attempting to start server on port ${PORT}...`);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✓ Server running successfully on port ${PORT}`);
  });
}

module.exports = app;