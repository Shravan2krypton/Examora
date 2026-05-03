import app from '../backend/server.js';

export default async function handler(req, res) {
  // Handle all API requests through the backend server
  try {
    await app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
