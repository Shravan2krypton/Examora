import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Pool } from 'pg';

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Neon connection string from .env
  ssl: {
    rejectUnauthorized: false // Neon requires SSL
  },
  // Add connection timeout for serverless
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000
});

export default pool;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: [
    'https://test-system-smoky.vercel.app', // Your actual frontend URL
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
import authRoutes from './routes/auth.js';
import examRoutes from './routes/exam.js';
import questionRoutes from './routes/question.js';
import examAttemptRoutes from './routes/examAttempt.js';
import resultRoutes from './routes/result.js';
import questionBankRoutes from './routes/questionBank.js';

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exam', examAttemptRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/questionbank', questionBankRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handler for multer etc.
app.use((err, req, res, next) => {
  if (err) {
    res.status(400).json({ error: err.message || 'Bad request' });
  } else {
    next();
  }
});

import { initSocket } from './socket.js';
initSocket(httpServer);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database configured: ${process.env.DATABASE_URL ? 'YES' : 'NO'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});