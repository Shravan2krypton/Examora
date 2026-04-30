import app from '../backend/server.js';
import { connectDB } from '../backend/config/database.js';

export default async function handler(req, res) {
  // Ensure database connection for serverless
  try {
    await connectDB();
    await app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
