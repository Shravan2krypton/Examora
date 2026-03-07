const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');

const authRoutes = require('./routes/auth.js');
const examRoutes = require('./routes/exam.js');
const questionRoutes = require('./routes/question.js');
const examAttemptRoutes = require('./routes/examAttempt.js');
const resultRoutes = require('./routes/result.js');
const questionBankRoutes = require('./routes/questionBank.js');

const { initSocket } = require('./socket.js');

// Database configuration
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Neon connection string from .env
  ssl: {
    rejectUnauthorized: false // Neon requires SSL
  }
});

module.exports = pool;

const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
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

// Initialize Socket.io
initSocket(httpServer);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database URL: ${process.env.DATABASE_URL}`);
});