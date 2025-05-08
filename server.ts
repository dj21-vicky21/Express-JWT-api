import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './src/config/db';
import authRoutes from './src/routes/authRouters';
import protectedRoutes from './src/routes/protectedRoutes';
import { requestLogger, responseLogger } from './src/middleware/logger';

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set Content-Type header for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Apply logging middleware
app.use(requestLogger);
app.use(responseLogger);

// Connect to MongoDB
connectDB();

// Auth routes
app.use('/', authRoutes);

// Protected test route (JWT required)
app.use('/', protectedRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
  console.log(`Logs will be saved to ${process.cwd()}/logs/api_access.log`);
});
