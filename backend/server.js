// Main server entrypoint for the MongoDB-backed Express API.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { connectDB, closeDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes');
const ApiError = require('./utils/ApiError');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Keep the CORS setup flexible enough for Expo development and production hosts.
const corsOrigin = process.env.CORS_ORIGIN;
const corsOptions = {
  origin: !corsOrigin || corsOrigin === '*' ? true : corsOrigin.split(',').map((value) => value.trim()),
  credentials: true,
};

// Core middleware for JSON payloads, form submissions, and cross-origin requests.
app.use(cors(corsOptions));
app.use(express.json({ limit: process.env.JSON_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded assets when the project starts storing media files.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple request trace for local debugging without adding a logging dependency.
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root health check gives a quick process-level status before hitting the router tree.
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount the versioned API routes after the shared middleware.
app.use('/api/auth', authRoutes);
app.use(API_PREFIX, apiRoutes);

// Convert all unmatched requests into a centralized API error.
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
});

// Centralized error handling stays last so all controllers can delegate failures here.
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log('\n═══════════════════════════════════════════════════════════');
      console.log('🚀 EV CHARGING BACKEND STARTED SUCCESSFULLY');
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`📌 Server is running on: http://localhost:${PORT}`);
      console.log(`📌 API Prefix: ${API_PREFIX}`);
      console.log(`📌 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📌 MongoDB URI: ${process.env.MONGODB_URI || 'not configured'}`);
      console.log('═══════════════════════════════════════════════════════════\n');
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received: closing server`);
      server.close(async () => {
        await closeDB();
        console.log('HTTP server and MongoDB connection closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
