import app from '../backend/server.js';

export default async function handler(req, res) {
  // Handle all API routes
  await app(req, res);
}
