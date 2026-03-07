import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

import authRoutes from './routes/auth.js';
import examRoutes from './routes/exam.js';
import questionRoutes from './routes/question.js';
import examAttemptRoutes from './routes/examAttempt.js';
import resultRoutes from './routes/result.js';
import questionBankRoutes from './routes/questionBank.js';

import { initSocket } from './socket.js';

const __filename = fileURLToPath(import.meta.url);
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
});
